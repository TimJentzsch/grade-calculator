/** The best possible grade. */
export const MIN_GRADE = 1.0;
/** The worst possible passing grade. */
export const MAX_GRADE = 4.0;

const GRADE_PATTERN = /^\d+(?:[.,]\d+)?$/;

/**
 * Tolerance for floating point errors when truncating.
 * For example, the average of 1.0 (7 CP) and 2.3 (6 CP) is exactly 1.6,
 * but is calculated as 1.5999999999999999.
 */
const TRUNCATION_TOLERANCE = 1e-9;

/**
 * Truncates a grade to one decimal place, as required by the examination regulations:
 * "Bei der Bildung der Noten und der Gesamtnote wird nur die erste Dezimalstelle hinter dem
 * Komma berücksichtigt. Alle weiteren Stellen werden gestrichen. Eine Rundung erfolgt nicht."
 * (RWTH ÜPO § 10 Abs. 11)
 * @param grade - The grade to truncate.
 * @param decimalPlaces - The number of decimal places to keep. Officially, this is always 1.
 * @returns The grade with all further decimal places removed, e.g. 1.59 becomes 1.5.
 */
export function truncateGrade(grade: number, decimalPlaces = 1): number {
  const factor = 10 ** decimalPlaces;
  return Math.floor(grade * factor + TRUNCATION_TOLERANCE) / factor;
}

/**
 * Parses a grade entered by the user.
 *
 * Both `.` and `,` are accepted as decimal separators.
 * Like all grades, the result is truncated to one decimal place (see {@link truncateGrade}).
 * @param text - The text to parse.
 * @returns The truncated grade, or `undefined` if the text is not a grade between
 * {@link MIN_GRADE} and {@link MAX_GRADE} (inclusive) after truncation.
 */
export function parseGrade(text: string): number | undefined {
  const trimmed = text.trim();
  if (!GRADE_PATTERN.test(trimmed)) {
    return undefined;
  }

  const grade = truncateGrade(Number(trimmed.replace(',', '.')));
  if (grade < MIN_GRADE || grade > MAX_GRADE) {
    return undefined;
  }

  return grade;
}

/**
 * Formats a grade with one decimal place. Further decimal places are truncated, not rounded.
 * @param grade - The grade to format.
 */
export function formatGrade(grade: number): string {
  return truncateGrade(grade).toFixed(1);
}

/**
 * Formats an average grade with two decimal places. Further decimal places are truncated.
 *
 * Officially only the first decimal place counts. The second one is shown anyway,
 * so users can see how close they are to a better grade.
 * Because it is truncated as well, the first decimal place is always the official grade.
 * @param grade - The grade to format.
 */
export function formatAverageGrade(grade: number): string {
  return truncateGrade(grade, 2).toFixed(2);
}
