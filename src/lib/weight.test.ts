import { describe, expect, test } from 'vitest';
import { formatWeight, parseWeight } from './weight.ts';

describe('parseWeight', () => {
  test('parses non-negative numbers', () => {
    expect(parseWeight('2')).toBe(2);
    expect(parseWeight('0')).toBe(0);
    expect(parseWeight('0.0')).toBe(0);
    expect(parseWeight(' 1.5 ')).toBe(1.5);
    expect(parseWeight('0,25')).toBe(0.25);
  });

  test('rejects everything else', () => {
    for (const text of ['', '-1', 'x2', '1e3', '.5']) {
      expect(parseWeight(text)).toBeUndefined();
    }
  });
});

describe('formatWeight', () => {
  test('shows at least one decimal place', () => {
    expect(formatWeight(0)).toBe('0.0');
    expect(formatWeight(1)).toBe('1.0');
    expect(formatWeight(2)).toBe('2.0');
    expect(formatWeight(1.5)).toBe('1.5');
    expect(formatWeight(0.25)).toBe('0.25');
  });
});
