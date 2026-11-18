/** The best possible grade. */
export const MIN_GRADE = 1.0;
/** The worst possible passing grade. */
export const MAX_GRADE = 4.0;

const GRADE_PATTERN = /^\d+(?:[.,]\d+)?$/;

/**
 * Parses a grade entered by the user.
 *
 * Both `.` and `,` are accepted as decimal separators.
 * @param text - The text to parse.
 * @returns The grade, or `undefined` if the text is not a grade between
 * {@link MIN_GRADE} and {@link MAX_GRADE} (inclusive).
 */
export function parseGrade(text: string): number | undefined {
  const trimmed = text.trim();
  if (!GRADE_PATTERN.test(trimmed)) {
    return undefined;
  }

  const grade = Number(trimmed.replace(',', '.'));
  if (grade < MIN_GRADE || grade > MAX_GRADE) {
    return undefined;
  }

  return grade;
}

/**
 * Formats a grade for editing, with at least one decimal place.
 * @param grade - The grade to format.
 */
export function formatGrade(grade: number): string {
  return Number.isInteger(grade * 10) ? grade.toFixed(1) : String(grade);
}
