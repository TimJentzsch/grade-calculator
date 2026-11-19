import {
  countsForGrade,
  type EliminationCurriculum,
  getEliminationGrade,
  hasGrade,
  isCompleted,
  isValidElimination,
} from './elimination.ts';

/** Objective improvements at or below this value are treated as no improvement. */
const EPSILON = 1e-9;

/**
 * A new elimination only replaces the current one if it improves the grade by more than this.
 * Without it, an equally good elimination could replace the current one due to rounding errors.
 * It is far below any difference that shows up in the displayed grade.
 */
const GRADE_TOLERANCE = 1e-9;

/** A module that can be eliminated, i.e. one that counts towards the grade. */
interface Candidate {
  /** The index into `curriculum.modules`. */
  index: number;
  /** The index of the module area containing the module. */
  areaIndex: number;
  grade: number;
  credits: number;
  weightedCredits: number;
  /** How much eliminating the module improves the objective of the current subproblem. */
  profit: number;
}

/** The modules to eliminate and their total profit. */
interface SubproblemSolution {
  indices: number[];
  profit: number;
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
          profit: 0,
        });
      }
      index += 1;
    }
  });

  return candidates;
}

/**
 * The eliminated modules of a state. States share these structurally instead of copying
 * index arrays, which would make every DP step linear in the number of eliminated modules.
 */
type Selection = null | { index: number; rest: Selection } | { left: Selection; right: Selection };

function toIndices(selection: Selection, indices: number[] = []): number[] {
  if (selection === null) {
    return indices;
  }
  if ('index' in selection) {
    indices.push(selection.index);
    return toIndices(selection.rest, indices);
  }
  toIndices(selection.left, indices);
  return toIndices(selection.right, indices);
}

/** A partial elimination: the eliminated modules and their totals. */
interface State {
  count: number;
  credits: number;
  profit: number;
  selection: Selection;
}

/** Which totals have to be tracked, because a limit depends on them. */
interface TrackedTotals {
  count: boolean;
  credits: boolean;
}

/**
 * The states with the same tracked totals, keyed by them.
 * Only the state with the highest profit is kept for each key.
 */
type StateTable = Map<string, State>;

function key(state: State, tracked: TrackedTotals): string {
  return `${tracked.count ? state.count : ''}|${tracked.credits ? state.credits : ''}`;
}

function addState(table: StateTable, state: State, tracked: TrackedTotals): void {
  const stateKey = key(state, tracked);
  const existing = table.get(stateKey);
  if (existing === undefined || state.profit > existing.profit) {
    table.set(stateKey, state);
  }
}

function withinLimits(state: State, countLimit: number, creditLimit: number): boolean {
  return state.count <= countLimit && state.credits <= creditLimit;
}

/**
 * Solves the knapsack subproblem of Dinkelbach's method with dynamic programming: finds the
 * elimination with the maximum total profit that respects all elimination limits.
 *
 * The module areas are disjoint, and an area's eliminated count and credits are exactly what it
 * adds to the curriculum's totals. So each area is solved on its own, as a table from its totals to
 * the best profit, and the area tables are then merged into a table for the whole curriculum.
 * Totals are only tracked if a limit depends on them, so the tables stay small.
 */
function solveSubproblem(
  curriculum: EliminationCurriculum,
  candidates: Candidate[],
): SubproblemSolution {
  // Curriculum limits are only active when truthy, mirroring `Curriculum.isValidElimination`
  const countLimit = curriculum.eliminationLimit || Infinity;
  const creditLimit = curriculum.eliminationCPLimit || Infinity;
  const globalTracked: TrackedTotals = {
    count: countLimit !== Infinity,
    credits: creditLimit !== Infinity,
  };

  const empty: State = { count: 0, credits: 0, profit: 0, selection: null };
  let table: StateTable = new Map([[key(empty, globalTracked), empty]]);

  curriculum.moduleAreas.forEach((moduleArea, areaIndex) => {
    const areaCandidates = candidates.filter((candidate) => candidate.areaIndex === areaIndex);
    if (areaCandidates.length === 0) {
      return;
    }

    // Area limits are active whenever they are defined, mirroring `ModuleArea`
    const areaCountLimit = Math.min(moduleArea.eliminationLimit ?? Infinity, countLimit);
    const areaCreditLimit = Math.min(moduleArea.eliminationCPLimit ?? Infinity, creditLimit);
    const areaTracked: TrackedTotals = {
      count: areaCountLimit !== Infinity,
      credits: areaCreditLimit !== Infinity,
    };

    // Solve the area on its own (0/1 knapsack over its candidates)
    let areaTable: StateTable = new Map([[key(empty, areaTracked), empty]]);
    for (const candidate of areaCandidates) {
      const next = new Map(areaTable);
      for (const state of areaTable.values()) {
        const extended: State = {
          count: state.count + 1,
          credits: state.credits + candidate.credits,
          profit: state.profit + candidate.profit,
          selection: { index: candidate.index, rest: state.selection },
        };
        if (withinLimits(extended, areaCountLimit, areaCreditLimit)) {
          addState(next, extended, areaTracked);
        }
      }
      areaTable = next;
    }

    // Merge the area into the curriculum table
    const merged: StateTable = new Map();
    for (const state of table.values()) {
      for (const areaState of areaTable.values()) {
        const combined: State = {
          count: state.count + areaState.count,
          credits: state.credits + areaState.credits,
          profit: state.profit + areaState.profit,
          selection:
            areaState.selection === null
              ? state.selection
              : { left: state.selection, right: areaState.selection },
        };
        if (withinLimits(combined, countLimit, creditLimit)) {
          addState(merged, combined, globalTracked);
        }
      }
    }
    table = merged;
  });

  let best = empty;
  for (const state of table.values()) {
    if (state.profit > best.profit) {
      best = state;
    }
  }

  return { indices: toIndices(best.selection), profit: best.profit };
}

/**
 * Calculates the best possible elimination for the given curriculum with Dinkelbach's method
 * and dynamic programming.
 *
 * The elimination grade is the ratio `Σ g·w / Σ w` over the modules that are not eliminated.
 * Starting with `λ` as the grade of the current elimination (or of no elimination, if that is
 * better or the current elimination is invalid), repeatedly find the valid elimination
 * maximizing `Σ w·(g − λ)` over the eliminated modules (a small knapsack problem solved by
 * dynamic programming), and update `λ` to the resulting grade, until no further improvement is
 * possible. Only modules with a grade worse than `λ` have a positive profit, so the others are
 * never passed to the subproblem.
 *
 * Because an elimination is only replaced by a strictly better one, a current elimination that is
 * already optimal is kept, even if other eliminations reach the same grade.
 * @param curriculum The curriculum to calculate the elimination for.
 * @returns The indices into `curriculum.modules` of the modules that should be eliminated.
 */
export function getBestEliminationIndicesDp(curriculum: EliminationCurriculum): number[] {
  const moduleCount = curriculum.moduleAreas.reduce(
    (total, moduleArea) => total + moduleArea.modules.length,
    0,
  );
  const allCandidates = getCandidates(curriculum);
  const toElimination = (indices: number[]) => {
    const elimination = new Array<boolean>(moduleCount).fill(false);
    for (const index of indices) {
      elimination[index] = true;
    }
    return elimination;
  };

  let best: number[] = [];
  let bestGrade = getEliminationGrade(curriculum, toElimination(best));

  if (bestGrade === undefined) {
    return best;
  }

  // Start from the current elimination, if it is valid and at least as good as no elimination.
  // Eliminated flags of modules that cannot be eliminated (e.g. ungraded ones) are ignored.
  const modules = curriculum.moduleAreas.flatMap((moduleArea) => moduleArea.modules);
  const current = allCandidates
    .filter((candidate) => modules[candidate.index].eliminated)
    .map((candidate) => candidate.index);

  if (current.length > 0 && isValidElimination(curriculum, toElimination(current))) {
    const currentGrade = getEliminationGrade(curriculum, toElimination(current));
    if (currentGrade !== undefined && currentGrade <= bestGrade) {
      best = current;
      bestGrade = currentGrade;
    }
  }

  // Each iteration strictly improves the grade, so this terminates.
  // The bound is only a safeguard against floating point issues.
  for (let iteration = 0; iteration <= allCandidates.length; iteration += 1) {
    const lambda: number = bestGrade;
    const candidates = allCandidates
      .filter((candidate) => candidate.grade > lambda)
      .map((candidate) => ({
        ...candidate,
        profit: candidate.weightedCredits * (candidate.grade - lambda),
      }));

    const solution = solveSubproblem(curriculum, candidates);
    if (solution.profit <= EPSILON) {
      break;
    }

    const indices = [...solution.indices].sort((a, b) => a - b);
    const grade = getEliminationGrade(curriculum, toElimination(indices));
    if (grade === undefined || grade >= bestGrade - GRADE_TOLERANCE) {
      break;
    }

    best = indices;
    bestGrade = grade;
  }

  return best;
}
