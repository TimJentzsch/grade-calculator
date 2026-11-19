import { describe, expect, test } from 'vitest';
import { formatAverageGrade, formatGrade, parseGrade, truncateGrade } from './grade';

describe('parseGrade', () => {
  test.each([
    ['1', 1.0],
    ['1.0', 1.0],
    ['1,0', 1.0],
    ['2.1', 2.1],
    ['2,1', 2.1],
    ['3.75', 3.7],
    ['2.39', 2.3],
    ['1,99', 1.9],
    ['4', 4.0],
    ['4.05', 4.0],
    ['4,0', 4.0],
    [' 2.3 ', 2.3],
  ])('parses %j as %d', (text, grade) => {
    expect(parseGrade(text)).toBe(grade);
  });

  test.each([
    '',
    ' ',
    '0.9',
    '0',
    '4.1',
    '5',
    '-1',
    '2.',
    ',5',
    '2.1.3',
    '2,1,3',
    '1.5e0',
    'abc',
    'TBD',
  ])('rejects %j', (text) => {
    expect(parseGrade(text)).toBeUndefined();
  });
});

describe('truncateGrade', () => {
  test.each([
    [1.0, 1.0],
    [1.3, 1.3],
    [1.59, 1.5],
    [1.599999, 1.5],
    [2.37, 2.3],
    [3.99, 3.9],
    [4.0, 4.0],
  ])('truncates %d to %d', (grade, truncated) => {
    expect(truncateGrade(grade)).toBe(truncated);
  });

  test('is not affected by floating point errors', () => {
    // Exactly 1.6, but calculated as 1.5999999999999999
    const average = (1.0 * 7 + 2.3 * 6) / 13;
    expect(average).toBeLessThan(1.6);
    expect(truncateGrade(average)).toBe(1.6);
  });

  test.each([
    [1.596, 1.59],
    [1.5999999999999999, 1.6],
    [2.8333, 2.83],
    [4.0, 4.0],
  ])('truncates %d to %d with two decimal places', (grade, truncated) => {
    expect(truncateGrade(grade, 2)).toBe(truncated);
  });

  test('keeps all standard grades unchanged', () => {
    for (const grade of [1.0, 1.3, 1.7, 2.0, 2.3, 2.7, 3.0, 3.3, 3.7, 4.0, 5.0]) {
      expect(truncateGrade(grade)).toBe(grade);
    }
  });
});

describe('formatGrade', () => {
  test.each([
    [1, '1.0'],
    [2.1, '2.1'],
    [2.3, '2.3'],
    [3.75, '3.7'],
    [1.59, '1.5'],
    [4, '4.0'],
  ])('formats %d as %j', (grade, text) => {
    expect(formatGrade(grade)).toBe(text);
  });
});

describe('formatAverageGrade', () => {
  test.each([
    [1, '1.00'],
    [1.596, '1.59'],
    [1.5999999999999999, '1.60'],
    [2.8333, '2.83'],
    [4, '4.00'],
  ])('formats %d as %j', (grade, text) => {
    expect(formatAverageGrade(grade)).toBe(text);
  });
});
