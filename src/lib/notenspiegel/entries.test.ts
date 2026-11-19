import { describe, expect, test } from 'vitest';
import type { ModuleAreaObject } from '../model/module-area.svelte';
import { addModules, thesisGrade } from './entries';
import type { NotenspiegelEntry } from './parse';

function module(name: string, grade: number, credits: number): NotenspiegelEntry {
  return { name, grade, credits, children: [], isExam: false };
}

describe('addModules', () => {
  test('adds the modules in order', () => {
    const area: ModuleAreaObject = { name: 'Electives', modules: [] };
    const used: string[] = [];
    addModules(area, [module('A', 1.3, 6), module('B', 2.0, 8)], (entry) => used.push(entry.name));
    expect(area.modules).toEqual([
      { name: 'A', credits: 6, grade: 1.3 },
      { name: 'B', credits: 8, grade: 2.0 },
    ]);
    expect(used).toEqual(['A', 'B']);
  });
});

describe('thesisGrade', () => {
  test('averages thesis and colloquium by credits', () => {
    const thesis = {
      ...module('Bachelorarbeit', 1.3, 12),
      children: [{ ...module('Kolloquium', 1.0, 3), isExam: true }],
    };
    expect(thesisGrade(thesis)).toBe(1.2);
  });

  test('uses the grade of a thesis without a separate colloquium', () => {
    expect(thesisGrade(module('Masterarbeit', 1.7, 30))).toBe(1.7);
  });

  test('is unknown until everything is passed', () => {
    expect(thesisGrade(undefined)).toBeUndefined();
    expect(thesisGrade({ ...module('Masterarbeit', 1.7, 30), grade: undefined })).toBeUndefined();
  });
});
