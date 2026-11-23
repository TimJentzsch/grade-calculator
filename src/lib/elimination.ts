import type Curriculum from './model/curriculum.svelte';

/** The data of a module that is relevant for the elimination. */
export interface EliminationModule {
  credits: number;
  grade: number | undefined;
  weight: number;
  isGraded: boolean;
  passed: boolean | undefined;
  /** Whether the module is currently eliminated, used as the starting point of the search. */
  eliminated?: boolean;
  /** Whether the module is an additional module, which doesn't count at all. */
  additional?: boolean;
}

/** The data of a module area that is relevant for the elimination. */
export interface EliminationModuleArea {
  modules: EliminationModule[];
  eliminationLimit: number | undefined;
  eliminationCPLimit: number | undefined;
}

/**
 * The data of a curriculum that is relevant for the elimination.
 *
 * Unlike the Svelte models these are plain objects, so they can be sent to a web worker
 * and copied cheaply during the search.
 */
export interface EliminationCurriculum {
  moduleAreas: EliminationModuleArea[];
  eliminationLimit: number | undefined;
  eliminationCPLimit: number | undefined;
}

/**
 * Which modules are eliminated, indexed like `curriculum.modules`,
 * i.e. the modules of all module areas in order.
 */
type Elimination = boolean[];

/**
 * Converts a curriculum to the plain data needed to calculate its elimination.
 * @param curriculum The curriculum to convert.
 * @returns The elimination data of the curriculum.
 */
export function toEliminationCurriculum(curriculum: Curriculum): EliminationCurriculum {
  return {
    moduleAreas: curriculum.moduleAreas.map((moduleArea) => ({
      modules: moduleArea.modules.map((module) => ({
        credits: module.credits,
        grade: module.grade,
        weight: module.weight,
        isGraded: module.isGraded,
        passed: module.passed,
        eliminated: Boolean(module.eliminated),
        additional: Boolean(module.additional),
      })),
      eliminationLimit: moduleArea.eliminationLimit,
      eliminationCPLimit: moduleArea.eliminationCPLimit,
    })),
    eliminationLimit: curriculum.eliminationLimit,
    eliminationCPLimit: curriculum.eliminationCPLimit,
  };
}

/**
 * Applies an elimination calculated by `getBestEliminationIndicesDp` to the curriculum.
 * Existing eliminations are reset first.
 * @param curriculum The curriculum to modify.
 * @param indices The indices into `curriculum.modules` of the modules to eliminate.
 */
export function applyElimination(curriculum: Curriculum, indices: number[]): void {
  curriculum.resetElimination();
  const modules = curriculum.modules;
  for (const index of indices) {
    modules[index].eliminated = true;
  }
}

// The functions below mirror the corresponding getters of the Svelte models.
// They must stay in sync with them, which is checked by the tests.

/** Mirrors `Module.gradeUnknown`: such modules are always eliminated. */
export function isGradeUnknown(module: EliminationModule): boolean {
  return Boolean(
    module.isGraded && module.eliminated && module.passed && module.grade === undefined,
  );
}

/** Mirrors `Module.completed`. */
export function isCompleted(module: EliminationModule): boolean {
  return Boolean(
    module.credits &&
    ((!module.isGraded && module.passed) || module.grade || isGradeUnknown(module)),
  );
}

/** Mirrors `Module.hasGrade`. */
export function hasGrade(module: EliminationModule, eliminated: boolean): boolean {
  return Boolean(module.credits && module.isGraded && module.grade && !eliminated);
}

/** Mirrors the filter of `ModuleArea.gradedModules`. */
export function countsForGrade(module: EliminationModule): boolean {
  return !module.additional && module.isGraded && module.weight !== 0;
}

/** The elimination-related values of a module area, as computed by `ModuleArea`. */
interface ModuleAreaEliminationStats {
  isValidElimination: boolean;
  eliminatedModules: EliminationModule[];
  eliminationIsGraded: boolean;
  eliminationGradePartiallyCompleted: boolean;
  eliminationWeightedCredits: number | undefined;
  eliminationWeightedGrade: number | undefined;
}

function getModuleAreaStats(
  moduleArea: EliminationModuleArea,
  elimination: Elimination,
  offset: number,
): ModuleAreaEliminationStats {
  let completedCount = 0;
  let eliminationGradedCount = 0;
  let eliminationCompletedGradedCount = 0;
  let eliminatedCredits = 0;
  let weightedCredits = 0;
  let weightedGrade = 0;
  const eliminatedModules: EliminationModule[] = [];

  moduleArea.modules.forEach((module, index) => {
    // Mirrors `ModuleArea.countedModules`
    if (module.additional) {
      return;
    }

    // Modules with an unknown grade can't be part of the grade, so they stay eliminated
    const eliminated = elimination[offset + index] || isGradeUnknown(module);
    const completed = isCompleted(module);

    if (completed) {
      completedCount += 1;
    }

    if (!countsForGrade(module)) {
      return;
    }

    if (eliminated) {
      eliminatedModules.push(module);
      eliminatedCredits += module.credits;
      return;
    }

    eliminationGradedCount += 1;

    if (completed) {
      eliminationCompletedGradedCount += 1;
      const moduleWeightedCredits = module.credits * module.weight;
      weightedCredits += moduleWeightedCredits;
      weightedGrade += (module.grade as number) * moduleWeightedCredits;
    }
  });

  const validElimination =
    (moduleArea.eliminationLimit !== undefined
      ? eliminatedModules.length <= moduleArea.eliminationLimit
      : true) &&
    (moduleArea.eliminationCPLimit !== undefined
      ? eliminatedCredits <= moduleArea.eliminationCPLimit
      : true);

  const eliminationIsGraded = eliminationGradedCount > 0;
  const eliminationGradePartiallyCompleted = eliminationIsGraded
    ? eliminationCompletedGradedCount > 0
    : completedCount > 0;
  const hasGradeValue = eliminationIsGraded && eliminationGradePartiallyCompleted;

  return {
    isValidElimination: validElimination,
    eliminatedModules,
    eliminationIsGraded,
    eliminationGradePartiallyCompleted,
    eliminationWeightedCredits: hasGradeValue ? weightedCredits : undefined,
    // Computed via the grade like `ModuleArea.eliminationWeightedGrade`,
    // so that rounding (and therefore tie-breaking) is identical
    eliminationWeightedGrade: hasGradeValue
      ? (weightedGrade / weightedCredits) * weightedCredits
      : undefined,
  };
}

function getAllModuleAreaStats(
  curriculum: EliminationCurriculum,
  elimination: Elimination,
): ModuleAreaEliminationStats[] {
  let offset = 0;
  return curriculum.moduleAreas.map((moduleArea) => {
    const stats = getModuleAreaStats(moduleArea, elimination, offset);
    offset += moduleArea.modules.length;
    return stats;
  });
}

/**
 * Determines whether the elimination respects all limits. Mirrors `Curriculum.isValidElimination`.
 * @param curriculum The curriculum.
 * @param elimination Which modules are eliminated, indexed like `curriculum.modules`.
 */
export function isValidElimination(
  curriculum: EliminationCurriculum,
  elimination: Elimination,
): boolean {
  const areaStats = getAllModuleAreaStats(curriculum, elimination);

  if (!areaStats.every((stats) => stats.isValidElimination)) {
    return false;
  }

  const eliminatedModules = areaStats.flatMap((stats) => stats.eliminatedModules);

  const validCount = curriculum.eliminationLimit
    ? eliminatedModules.length <= curriculum.eliminationLimit
    : true;

  if (!validCount) return false;

  const eliminatedCredits = eliminatedModules.reduce((total, module) => total + module.credits, 0);

  const validCP = curriculum.eliminationCPLimit
    ? eliminatedCredits <= curriculum.eliminationCPLimit
    : true;

  return validCP;
}

/**
 * Calculates the grade of the curriculum with the elimination applied.
 * Mirrors `Curriculum.eliminationGrade`.
 * @param curriculum The curriculum.
 * @param elimination Which modules are eliminated, indexed like `curriculum.modules`.
 */
export function getEliminationGrade(
  curriculum: EliminationCurriculum,
  elimination: Elimination,
): number | undefined {
  const gradedAreas = getAllModuleAreaStats(curriculum, elimination).filter(
    (stats) => stats.eliminationIsGraded && stats.eliminationGradePartiallyCompleted,
  );

  if (gradedAreas.length === 0) {
    return undefined;
  }

  let weightedGrade = 0;
  let weightedCredits = 0;
  gradedAreas.forEach((stats) => {
    weightedGrade += stats.eliminationWeightedGrade as number;
    weightedCredits += stats.eliminationWeightedCredits as number;
  });

  return weightedGrade / weightedCredits;
}
