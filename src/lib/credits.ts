const CREDITS_PATTERN = /^\d+([.,]\d+)?$/;

/**
 * Parses entered credit points, e.g. `6` or `7.5`.
 * Returns `undefined` if the text is not a non-negative number.
 */
export function parseCredits(text: string): number | undefined {
  const trimmed = text.trim();
  if (!CREDITS_PATTERN.test(trimmed)) {
    return undefined;
  }
  return Number(trimmed.replace(',', '.'));
}
