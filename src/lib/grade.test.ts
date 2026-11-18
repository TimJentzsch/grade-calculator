import { describe, expect, test } from 'vitest';
import { formatGrade, parseGrade } from './grade';

describe('parseGrade', () => {
  test.each([
    ['1', 1.0],
    ['1.0', 1.0],
    ['1,0', 1.0],
    ['2.1', 2.1],
    ['2,1', 2.1],
    ['3.75', 3.75],
    ['4', 4.0],
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

describe('formatGrade', () => {
  test.each([
    [1, '1.0'],
    [2.1, '2.1'],
    [2.3, '2.3'],
    [3.75, '3.75'],
    [4, '4.0'],
  ])('formats %d as %j', (grade, text) => {
    expect(formatGrade(grade)).toBe(text);
  });
});
