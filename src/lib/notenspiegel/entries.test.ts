import { describe, expect, test } from 'vitest';
import type { ModuleAreaObject } from '../model/module-area.svelte';
import { fillAreas, thesisGrade } from './entries';
import type { NotenspiegelEntry } from './parse';

function module(name: string, grade: number, credits: number): NotenspiegelEntry {
  return { name, grade, credits, children: [], isExam: false };
}

function placeholderArea(name: string, count: number, credits = 6): ModuleAreaObject {
  return {
    name,
    modules: Array.from({ length: count }, () => ({ name: 'Elective Module', credits })),
  };
}

const names = (area: ModuleAreaObject) => area.modules.map((m) => [m.name, m.credits, m.grade]);

describe('fillAreas', () => {
  test('replaces placeholders in order and adds further modules', () => {
    const area = placeholderArea('Electives', 2);
    const used: string[] = [];
    fillAreas(
      [{ area, entries: [module('A', 1.3, 6), module('B', 2.0, 8), module('C', 1.0, 6)] }],
      (entry) => used.push(entry.name),
    );
    expect(names(area)).toEqual([
      ['A', 6, 1.3],
      ['B', 8, 2.0],
      ['C', 6, 1.0],
    ]);
    expect(used).toEqual(['A', 'B', 'C']);
  });

  test('keeps all remaining placeholders without limits', () => {
    const area = placeholderArea('Electives', 3);
    fillAreas([{ area, entries: [module('A', 1.3, 6)] }], () => {});
    expect(names(area)).toEqual([
      ['A', 6, 1.3],
      ['Elective Module', 6, undefined],
      ['Elective Module', 6, undefined],
    ]);
  });

  test('keeps placeholders across areas up to the target', () => {
    const first = placeholderArea('First', 2);
    const second = placeholderArea('Second', 2);
    fillAreas(
      [
        { area: first, entries: [module('A', 1.0, 5)] },
        { area: second, entries: [] },
      ],
      () => {},
      { target: 16, minimum: 10 },
    );
    // 5 + 6 + 5 (shortened) = 16
    expect(names(first)).toEqual([
      ['A', 5, 1.0],
      ['Elective Module', 6, undefined],
    ]);
    expect(names(second)).toEqual([['Elective Module', 5, undefined]]);
  });

  test('drops placeholders once the minimum is reached', () => {
    const area = placeholderArea('Electives', 3);
    fillAreas([{ area, entries: [module('A', 1.0, 6), module('B', 1.0, 6)] }], () => {}, {
      target: 18,
      minimum: 12,
    });
    expect(names(area)).toEqual([
      ['A', 6, 1.0],
      ['B', 6, 1.0],
    ]);
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
