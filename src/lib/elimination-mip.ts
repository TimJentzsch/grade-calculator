import { type Coefficients, type Constraint, type Model, solve } from 'yalps';
import {
  countsForGrade,
  type EliminationCurriculum,
  getEliminationGrade,
  hasGrade,
  isCompleted,
} from './elimination.ts';

/** Objective improvements at or below this value are treated as no improvement. */
const EPSILON = 1e-9;

/** A module that can be eliminated, i.e. one that counts towards the grade. */
interface Candidate {
  /** The index into `curriculum.modules`. */
  index: number;
  /** The index of the module area containing the module. */
  areaIndex: number;
  grade: number;
  credits: number;
  weightedCredits: number;
}

function getCandidates(curriculum: EliminationCurriculum): Candidate[] {
  const candidates: Candidate[] = [];
  let index = 0;

  curriculum.moduleAreas.forEach((moduleArea, areaIndex) => {
    for (const module of moduleArea.modules) {
      if (isCompleted(module) && hasGrade(module, false) && countsForGrade(module)) {
        candidates.push({
          index,
          areaIndex,
          grade: module.grade as number,
          credits: module.credits,
          weightedCredits: module.credits * module.weight,
        });
      }
      index += 1;
    }
  });

  return candidates;
}

/**
 * Builds the integer program that finds the elimination maximizing
 * `Σ weightedCredits · (grade − λ)` over the eliminated modules,
 * subject to all elimination limits.
 *
 * If this maximum is positive, the elimination improves the grade beyond `λ` (Dinkelbach's method).
 * Only modules with a grade worse than `λ` can contribute positively, so all others are left out.
 */
function buildModel(
  curriculum: EliminationCurriculum,
  candidates: Candidate[],
  lambda: number,
): Model {
  const constraints: Record<string, Constraint> = {};
  const variables: Record<string, Coefficients> = {};

  curriculum.moduleAreas.forEach((moduleArea, areaIndex) => {
    // Area limits are active whenever they are defined, mirroring `ModuleArea`
    if (moduleArea.eliminationLimit !== undefined) {
      constraints[`area${areaIndex}:count`] = { max: moduleArea.eliminationLimit };
    }
    if (moduleArea.eliminationCPLimit !== undefined) {
      constraints[`area${areaIndex}:cp`] = { max: moduleArea.eliminationCPLimit };
    }
  });

  // Curriculum limits are only active when truthy, mirroring `Curriculum.isValidElimination`
  if (curriculum.eliminationLimit) {
    constraints.count = { max: curriculum.eliminationLimit };
  }
  if (curriculum.eliminationCPLimit) {
    constraints.cp = { max: curriculum.eliminationCPLimit };
  }

  for (const candidate of candidates) {
    if (candidate.grade <= lambda) {
      continue;
    }

    const coefficients: Record<string, number> = {
      profit: candidate.weightedCredits * (candidate.grade - lambda),
    };
    const usage: [string, number][] = [
      [`area${candidate.areaIndex}:count`, 1],
      [`area${candidate.areaIndex}:cp`, candidate.credits],
      ['count', 1],
      ['cp', candidate.credits],
    ];
    for (const [key, value] of usage) {
      if (key in constraints) {
        coefficients[key] = value;
      }
    }
    variables[`m${candidate.index}`] = coefficients;
  }

  return {
    direction: 'maximize',
    objective: 'profit',
    constraints,
    variables,
    binaries: true,
  };
}

/**
 * Calculates the best possible elimination for the given curriculum using integer programming.
 * Existing eliminations are ignored.
 *
 * The elimination grade is the ratio `Σ g·w / Σ w` over the modules that are not eliminated.
 * This fractional objective is minimized with Dinkelbach's method: starting with `λ` as the
 * grade without elimination, repeatedly find the valid elimination maximizing
 * `Σ w·(g − λ)` over the eliminated modules (a small binary knapsack problem),
 * and update `λ` to the resulting grade, until no further improvement is possible.
 * @param curriculum The curriculum to calculate the elimination for.
 * @returns The indices into `curriculum.modules` of the modules that should be eliminated.
 */
export function getBestEliminationIndicesMip(curriculum: EliminationCurriculum): number[] {
  const moduleCount = curriculum.moduleAreas.reduce(
    (total, moduleArea) => total + moduleArea.modules.length,
    0,
  );
  const candidates = getCandidates(curriculum);

  let best: number[] = [];
  let bestGrade = getEliminationGrade(curriculum, new Array<boolean>(moduleCount).fill(false));

  if (bestGrade === undefined) {
    return best;
  }

  // Each iteration strictly improves the grade, so this terminates.
  // The bound is only a safeguard against floating point issues.
  for (let iteration = 0; iteration <= candidates.length; iteration += 1) {
    const solution = solve(buildModel(curriculum, candidates, bestGrade));

    if (solution.status !== 'optimal' || solution.result <= EPSILON) {
      break;
    }

    const indices = solution.variables
      .filter(([, value]) => value > 0.5)
      .map(([name]) => Number(name.slice(1)))
      .sort((a, b) => a - b);

    const elimination = new Array<boolean>(moduleCount).fill(false);
    for (const index of indices) {
      elimination[index] = true;
    }

    const grade = getEliminationGrade(curriculum, elimination);
    if (grade === undefined || grade >= bestGrade) {
      break;
    }

    best = indices;
    bestGrade = grade;
  }

  return best;
}
