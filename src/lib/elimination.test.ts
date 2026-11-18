import { describe, expect, test } from 'vitest';
import { getBestElimination, getBestEliminationIndices } from './elimination';
import Curriculum from './model/curriculum.svelte';
import ModuleArea from './model/module-area.svelte';
import Module from './model/module.svelte';

describe('elimination', () => {
  describe('getBestEliminationIndices', () => {
    test('eliminates the worst grade when one module may be eliminated', () => {
      const curriculum = new Curriculum(
        'Test curriculum',
        [
          new ModuleArea('Test module area', [
            new Module('Test module 1', 6, 1.3),
            new Module('Test module 2', 6, 3.7),
            new Module('Test module 3', 6, 2.0),
          ]),
        ],
        1,
      );

      expect(getBestEliminationIndices(curriculum)).toEqual([1]);
    });

    test('respects the elimination limit', () => {
      const curriculum = new Curriculum(
        'Test curriculum',
        [
          new ModuleArea('Test module area', [
            new Module('Test module 1', 6, 1.0),
            new Module('Test module 2', 6, 3.7),
            new Module('Test module 3', 6, 3.3),
            new Module('Test module 4', 6, 2.0),
          ]),
        ],
        2,
      );

      expect(getBestEliminationIndices(curriculum)).toEqual([1, 2]);
    });

    test('respects the elimination CP limit', () => {
      const curriculum = new Curriculum(
        'Test curriculum',
        [
          new ModuleArea('Test module area', [
            new Module('Test module 1', 6, 1.0),
            new Module('Test module 2', 12, 4.0),
            new Module('Test module 3', 6, 3.7),
          ]),
        ],
        undefined,
        10,
      );

      expect(getBestEliminationIndices(curriculum)).toEqual([2]);
    });

    test('respects the module area limits', () => {
      const curriculum = new Curriculum('Test curriculum', [
        new ModuleArea('Test module area 1', [new Module('Test module 1', 6, 4.0)], 0),
        new ModuleArea(
          'Test module area 2',
          [new Module('Test module 2', 6, 1.0), new Module('Test module 3', 6, 3.0)],
          1,
        ),
      ]);

      expect(getBestEliminationIndices(curriculum)).toEqual([2]);
    });

    test('ignores modules without a grade', () => {
      const curriculum = new Curriculum(
        'Test curriculum',
        [
          new ModuleArea('Test module area', [
            new Module('Test module 1', 6, 1.3),
            new Module('Test module 2', 6, undefined),
            new Module('Test module 3', 6, undefined, undefined, true, true),
          ]),
        ],
        1,
      );

      expect(getBestEliminationIndices(curriculum)).toEqual([]);
    });

    test('ignores existing eliminations', () => {
      const curriculum = new Curriculum(
        'Test curriculum',
        [
          new ModuleArea('Test module area', [
            new Module('Test module 1', 6, 1.3, undefined, undefined, undefined, true),
            new Module('Test module 2', 6, 3.7),
            new Module('Test module 3', 6, 2.0),
          ]),
        ],
        1,
      );

      expect(getBestEliminationIndices(curriculum)).toEqual([1]);
    });
  });

  describe('getBestElimination', () => {
    test('does not modify the given curriculum', () => {
      const curriculum = new Curriculum(
        'Test curriculum',
        [
          new ModuleArea('Test module area', [
            new Module('Test module 1', 6, 1.3, undefined, undefined, undefined, true),
            new Module('Test module 2', 6, 3.7),
          ]),
        ],
        1,
      );

      const result = getBestElimination(curriculum);

      expect(result).not.toBe(curriculum);
      expect(result.modules.map((module) => module.eliminated)).toEqual([undefined, true]);
      expect(curriculum.modules.map((module) => module.eliminated)).toEqual([true, undefined]);
    });
  });
});
