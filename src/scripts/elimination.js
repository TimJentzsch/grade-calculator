// eslint-disable-next-line no-unused-vars
import Curriculum from './curriculum/curriculum.js';

/**
 * Calculates the best possible elimination for the given curriculum.
 * @param {Curriculum} curriculum The curriculum to calculate the elimination for.
 * @param {number} index The index of the current module.
 * @returns {Promise<Curriculum>} The best elimination of the curriculum.
 */
async function calculateBestElimination(curriculum, index) {
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

  if (curriculumElimBest.eliminationGrade < (await curriculumNoElimBest).eliminationGrade) {
    // If the elimination gives a better result, use it
    return curriculumElimBest;
  }

  // Otherwise do not eliminate
  return curriculumNoElimBest;
}

/**
 * Calculates the best possible elimination for the given curriculum.
 * @param {Curriculum} curriculum The curriculum to calculate the elimination for.
 * @returns {Promise<Curriculum>} The best elimination of the curriculum.
 */
export default async function getBestElimination(curriculum) {
  const clearCurriculum = curriculum.clone();
  clearCurriculum.resetElimination();

  return calculateBestElimination(clearCurriculum, 0);
}
