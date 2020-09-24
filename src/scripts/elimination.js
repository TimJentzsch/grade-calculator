// eslint-disable-next-line no-unused-vars
import Curriculum from './curriculum/curriculum.js';

/**
 * Calculates the best possible elimination for the given curriculum.
 * @param {Curriculum} curriculum The curriculum to calculate the elimination for.
 * @param {number} index The index of the current module.
 * @returns {Curriculum} The best elimination of the curriculum.
 */
function calculateBestElimination(curriculum, index) {
  const curriculumElim = curriculum.clone();
  const moduleElim = curriculum.modules[index];

  if (!moduleElim) {
    // We reached the end
    return curriculum;
  }

  moduleElim.eliminated = true;

  // Calculate the best outcome without the elimination
  const curriculumNoElimBest = calculateBestElimination(curriculum, index + 1);

  if (!curriculumElim.isValidElimination) {
    return curriculumNoElimBest;
  }

  // Calculate the best outcome with the elimination
  const curriculumElimBest = calculateBestElimination(curriculumElim, index + 1);

  if (curriculumElimBest.grade < curriculumNoElimBest.grade) {
    // If the elimination gives a better result, use it
    return curriculumElimBest;
  }

  // Otherwise do not eliminate
  return curriculumNoElimBest;
}

/**
 * Calculates the best possible elimination for the given curriculum.
 * @param {Curriculum} curriculum The curriculum to calculate the elimination for.
 * @returns {Curriculum} The best elimination of the curriculum.
 */
export default function getBestElimination(curriculum) {
  const clearCurriculum = curriculum.clone();
  clearCurriculum.resetElimination();

  return calculateBestElimination(curriculum, 0);
}
