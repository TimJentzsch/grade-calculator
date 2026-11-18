import { describe, expect, test } from 'vitest';
import {
  applyElimination,
  getBestEliminationIndices as getBestEliminationIndicesPlain,
  getEliminationGrade,
  isValidElimination,
  toEliminationCurriculum,
} from './elimination';
import Curriculum from './model/curriculum.svelte';
import ModuleArea from './model/module-area.svelte';
import Module from './model/module.svelte';

function getBestEliminationIndices(curriculum: Curriculum): number[] {
  return getBestEliminationIndicesPlain(toEliminationCurriculum(curriculum));
}

/** The original search on the Svelte models, used as a reference for the plain implementation. */
function referenceBestElimination(curriculum: Curriculum, index: number): Curriculum {
  const module = curriculum.modules[index];
  if (!module) return curriculum;

  const noElimBest = referenceBestElimination(curriculum, index + 1);
  if (!module.completed || !module.hasGrade) return noElimBest;

  const elim = curriculum.clone();
  elim.modules[index].eliminated = true;
  if (!elim.isValidElimination) return noElimBest;

  const elimBest = referenceBestElimination(elim, index + 1);
  return (elimBest.eliminationGrade as number) < (noElimBest.eliminationGrade as number)
    ? elimBest
    : noElimBest;
}

/** The eliminated flags of all modules after running the reference search. */
function referenceEliminationResult(curriculum: Curriculum): (boolean | undefined)[] {
  const clear = curriculum.clone();
  clear.resetElimination();
  return referenceBestElimination(clear, 0).modules.map((module) => module.eliminated);
}

/** The eliminated flags of all modules after applying the plain search, as the app does. */
function eliminationResult(curriculum: Curriculum): (boolean | undefined)[] {
  const result = curriculum.clone();
  applyElimination(result, getBestEliminationIndices(curriculum));
  return result.modules.map((module) => module.eliminated);
}

/** A small deterministic pseudo-random number generator (mulberry32). */
function createRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Creates a random curriculum covering the edge cases of the grade calculation. */
function randomCurriculum(random: () => number): Curriculum {
  const pick = <T>(items: T[]): T => items[Math.floor(random() * items.length)];
  const limit = () => pick([undefined, undefined, 0, 1, 2, 3]);
  const cpLimit = () => pick([undefined, undefined, 0, 6, 10, 15]);

  return new Curriculum(
    'Random curriculum',
    Array.from({ length: 1 + Math.floor(random() * 3) }, (_, areaIndex) => {
      return new ModuleArea(
        `Area ${areaIndex}`,
        Array.from({ length: Math.floor(random() * 4) }, (__, moduleIndex) => {
          return new Module(
            `Module ${moduleIndex}`,
            pick([0, 3, 5, 6, 6, 8, 12]),
            pick([undefined, 1.0, 1.3, 1.7, 2.0, 2.3, 2.7, 3.0, 3.3, 3.7, 4.0]),
            pick([undefined, undefined, 0, 0.5, 2]),
            random() < 0.15,
            pick([undefined, true, false]),
            random() < 0.3,
          );
        }),
        limit(),
        cpLimit(),
      );
    }),
    limit(),
    cpLimit(),
  );
}

describe('elimination', () => {
  describe('plain implementation matches the Svelte models', () => {
    const random = createRandom(42);
    const curricula = Array.from({ length: 300 }, () => randomCurriculum(random));

    test('getEliminationGrade', () => {
      for (const curriculum of curricula) {
        const elimination = curriculum.modules.map((module) => Boolean(module.eliminated));
        expect(getEliminationGrade(toEliminationCurriculum(curriculum), elimination)).toBe(
          curriculum.eliminationGrade,
        );
      }
    });

    test('isValidElimination', () => {
      for (const curriculum of curricula) {
        const elimination = curriculum.modules.map((module) => Boolean(module.eliminated));
        expect(isValidElimination(toEliminationCurriculum(curriculum), elimination)).toBe(
          curriculum.isValidElimination,
        );
      }
    });

    test('best elimination', () => {
      for (const curriculum of curricula) {
        expect(eliminationResult(curriculum)).toEqual(referenceEliminationResult(curriculum));
      }
    });
  });

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
});
