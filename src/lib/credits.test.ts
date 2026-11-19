import { describe, expect, test } from 'vitest';
import { parseCredits } from './credits.ts';

describe('parseCredits', () => {
  test('parses whole and decimal numbers', () => {
    expect(parseCredits('6')).toBe(6);
    expect(parseCredits(' 0 ')).toBe(0);
    expect(parseCredits('7.5')).toBe(7.5);
    expect(parseCredits('7,5')).toBe(7.5);
  });

  test('rejects everything else', () => {
    for (const text of ['', ' ', '-3', 'abc', '6 CP', '1e3', '.5', '5.']) {
      expect(parseCredits(text)).toBeUndefined();
    }
  });
});
