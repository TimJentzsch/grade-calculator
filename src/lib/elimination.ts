import type Curriculum from './model/curriculum.svelte';

/**
 * Calculates the best possible elimination for the given curriculum.
 * @param curriculum The curriculum to calculate the elimination for.
 * @param index The index of the current module.
 * @returns The best elimination of the curriculum.
 */
async function calculateBestElimination(
  curriculum: Curriculum,
  index: number,
): Promise<Curriculum> {
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

  // Check if the module can still be eliminated
  if (!curriculumElim.isValidElimination) {
    return curriculumNoElimBest;
  }

  // Calculate the best outcome WITH the elimination
  const curriculumElimBest = await calculateBestElimination(curriculumElim, index + 1);

  if (
    (curriculumElimBest.eliminationGrade as number) <
    ((await curriculumNoElimBest).eliminationGrade as number)
  ) {
    // If the elimination gives a better result, use it
    return curriculumElimBest;
  }

  // Otherwise do not eliminate
  return curriculumNoElimBest;
}

/**
 * Calculates the best possible elimination for the given curriculum.
 * @param curriculum The curriculum to calculate the elimination for.
 * @returns The best elimination of the curriculum.
 */
export default async function getBestElimination(curriculum: Curriculum): Promise<Curriculum> {
  const clearCurriculum = curriculum.clone();
  clearCurriculum.resetElimination();

  return calculateBestElimination(clearCurriculum, 0);
}
