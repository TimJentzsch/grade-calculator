import { flushSync } from 'svelte';
import type Curriculum from './model/curriculum.svelte';

/**
 * Calculates the best possible elimination for the given curriculum.
 * @param curriculum The curriculum to calculate the elimination for.
 * @param index The index of the current module.
 * @returns The best elimination of the curriculum.
 */
function calculateBestElimination(curriculum: Curriculum, index: number): Curriculum {
  const module = curriculum.modules[index];

  if (!module) {
    // We reached the end
    return curriculum;
  }

  // Calculate the best outcome WITHOUT the elimination
  const curriculumNoElimBest = calculateBestElimination(curriculum, index + 1);

  if (!module.completed || !module.hasGrade) {
    // If the module has no grade yet we don't need to eliminate it
    return curriculumNoElimBest;
  }

  const curriculumElim = curriculum.clone();
  // Eliminate the module
  curriculumElim.modules[index].eliminated = true;
  // Svelte collects every state change in a batch that is only cleared once it is flushed.
  // This calculation runs synchronously (in a worker) and never yields, so flush explicitly;
  // otherwise the batch grows with every clone, slowing everything down until it overflows.
  flushSync();

  // Check if the module can still be eliminated
  if (!curriculumElim.isValidElimination) {
    return curriculumNoElimBest;
  }

  // Calculate the best outcome WITH the elimination
  const curriculumElimBest = calculateBestElimination(curriculumElim, index + 1);

  if (
    (curriculumElimBest.eliminationGrade as number) <
    (curriculumNoElimBest.eliminationGrade as number)
  ) {
    // If the elimination gives a better result, use it
    return curriculumElimBest;
  }

  // Otherwise do not eliminate
  return curriculumNoElimBest;
}

/**
 * Calculates the best possible elimination for the given curriculum.
 *
 * This can take a long time for larger curricula, so it should not be run on the main thread.
 * @param curriculum The curriculum to calculate the elimination for. It is not modified.
 * @returns A copy of the curriculum with the best elimination applied.
 */
export function getBestElimination(curriculum: Curriculum): Curriculum {
  const clearCurriculum = curriculum.clone();
  clearCurriculum.resetElimination();

  return calculateBestElimination(clearCurriculum, 0);
}

/**
 * Calculates the best possible elimination for the given curriculum.
 * @param curriculum The curriculum to calculate the elimination for. It is not modified.
 * @returns The indices into `curriculum.modules` of the modules that should be eliminated.
 */
export function getBestEliminationIndices(curriculum: Curriculum): number[] {
  return getBestElimination(curriculum)
    .modules.map((module, index) => (module.eliminated ? index : -1))
    .filter((index) => index >= 0);
}
