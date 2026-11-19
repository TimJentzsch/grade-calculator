const WEIGHT_PATTERN = /^\d+([.,]\d+)?$/;

/**
 * Parses an entered weight, e.g. `2` or `1.5`.
 * A weight of 0 is valid, the module then doesn't count towards the grade.
 * Returns `undefined` if the text is not a non-negative number.
 */
export function parseWeight(text: string): number | undefined {
  const trimmed = text.trim();
  if (!WEIGHT_PATTERN.test(trimmed)) {
    return undefined;
  }
  return Number(trimmed.replace(',', '.'));
}

/** Formats a weight with at least one decimal place, e.g. `1.0` or `0.25`. */
export function formatWeight(weight: number): string {
  return Number.isInteger(weight) ? weight.toFixed(1) : String(weight);
}
