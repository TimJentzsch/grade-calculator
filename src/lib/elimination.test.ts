import { describe, expect, test } from 'vitest';
import {
  applyElimination,
  getEliminationGrade,
  isValidElimination,
  toEliminationCurriculum,
} from './elimination';
import { getBestEliminationIndicesDp } from './elimination-dp';
import Curriculum from './model/curriculum.svelte';
import ModuleArea from './model/module-area.svelte';
import Module from './model/module.svelte';

/**
 * Finds the best elimination by trying every combination on the Svelte models.
 * This is far too slow for real curricula, but obviously correct, so it is the reference
 * that the dynamic programming is checked against.
 */
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

/** The indices into `curriculum.modules` of the modules eliminated by the reference search. */
function referenceBestIndices(curriculum: Curriculum): number[] {
  const clear = curriculum.clone();
  // `resetElimination` only resets graded modules, but other modules may still be flagged.
  // Modules with an unknown grade always stay eliminated.
  clear.modules.forEach((module) => {
    if (!module.gradeUnknown) {
      module.eliminated = undefined;
    }
  });
  return referenceBestElimination(clear, 0).modules.flatMap((module, index) =>
    module.eliminated ? [index] : [],
  );
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
  });

  describe('getBestEliminationIndicesDp', () => {
    const bestIndices = (curriculum: Curriculum) =>
      getBestEliminationIndicesDp(toEliminationCurriculum(curriculum));

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

      expect(getBestEliminationIndicesDp(toEliminationCurriculum(curriculum))).toEqual([1]);
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

      expect(bestIndices(curriculum)).toEqual([1, 2]);
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

      expect(bestIndices(curriculum)).toEqual([2]);
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

      expect(bestIndices(curriculum)).toEqual([2]);
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

      expect(bestIndices(curriculum)).toEqual([]);
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

      expect(getBestEliminationIndicesDp(toEliminationCurriculum(curriculum))).toEqual([1]);
    });
  });

  describe('dynamic programming starts from the current elimination', () => {
    /** Two modules with the same grade and credits, so eliminating either is optimal. */
    function tiedCurriculum(eliminated: number): Curriculum {
      const modules = [
        new Module('Test module 1', 6, 1.0),
        new Module('Test module 2', 6, 3.0),
        new Module('Test module 3', 6, 3.0),
      ];
      modules[eliminated].eliminated = true;
      return new Curriculum('Test curriculum', [new ModuleArea('Test module area', modules)], 1);
    }

    test('keeps an optimal elimination when another one is equally good', () => {
      expect(getBestEliminationIndicesDp(toEliminationCurriculum(tiedCurriculum(1)))).toEqual([1]);
      expect(getBestEliminationIndicesDp(toEliminationCurriculum(tiedCurriculum(2)))).toEqual([2]);
    });

    test('replaces an elimination that is not optimal', () => {
      const curriculum = new Curriculum(
        'Test curriculum',
        [
          new ModuleArea('Test module area', [
            new Module('Test module 1', 6, 1.0),
            new Module('Test module 2', 6, 3.0, undefined, undefined, undefined, true),
            new Module('Test module 3', 6, 4.0),
          ]),
        ],
        1,
      );

      expect(getBestEliminationIndicesDp(toEliminationCurriculum(curriculum))).toEqual([2]);
    });

    test('keeps modules with an unknown grade eliminated', () => {
      const curriculum = new Curriculum('Test curriculum', [
        new ModuleArea(
          'Test module area 1',
          [
            new Module('Test module 1', 6, 1.0),
            new Module('Test module 2', 6, undefined, undefined, false, true, true),
            new Module('Test module 3', 6, 4.0),
          ],
          1,
        ),
        new ModuleArea(
          'Test module area 2',
          [new Module('Test module 4', 6, 1.0), new Module('Test module 5', 6, 3.0)],
          1,
        ),
      ]);

      // The unknown grade uses up the elimination of the first area
      expect(getBestEliminationIndicesDp(toEliminationCurriculum(curriculum))).toEqual([1, 4]);
    });

    test('counts modules with an unknown grade towards the curriculum limits', () => {
      const curriculum = new Curriculum(
        'Test curriculum',
        [
          new ModuleArea('Test module area', [
            new Module('Test module 1', 6, 1.0),
            new Module('Test module 2', 8, undefined, undefined, false, true, true),
            new Module('Test module 3', 6, 4.0),
          ]),
        ],
        undefined,
        10,
      );

      expect(getBestEliminationIndicesDp(toEliminationCurriculum(curriculum))).toEqual([1]);
    });

    test('ignores an elimination that exceeds the limits', () => {
      const curriculum = new Curriculum(
        'Test curriculum',
        [
          new ModuleArea('Test module area', [
            new Module('Test module 1', 6, 1.0),
            new Module('Test module 2', 6, 3.7, undefined, undefined, undefined, true),
            new Module('Test module 3', 6, 4.0, undefined, undefined, undefined, true),
          ]),
        ],
        1,
      );

      expect(getBestEliminationIndicesDp(toEliminationCurriculum(curriculum))).toEqual([2]);
    });
  });

  describe('dynamic programming matches the exhaustive search', () => {
    /**
     * The grade after applying the elimination, which must also be valid,
     * unless the modules with an unknown grade alone already break a limit.
     */
    function gradeOf(curriculum: Curriculum, indices: number[]): number | undefined {
      const plain = toEliminationCurriculum(curriculum);
      const elimination = curriculum.modules.map(() => false);
      const fixedValid = isValidElimination(plain, elimination);
      for (const index of indices) {
        elimination[index] = true;
      }
      if (fixedValid) {
        expect(isValidElimination(plain, elimination)).toBe(true);
      }
      return getEliminationGrade(plain, elimination);
    }

    // The random curricula also contain eliminated modules, valid or not,
    // which the dynamic programming uses as its starting point
    test('on random curricula', () => {
      const random = createRandom(1337);
      for (let i = 0; i < 1000; i += 1) {
        const curriculum = randomCurriculum(random);
        const plain = toEliminationCurriculum(curriculum);
        const expected = gradeOf(curriculum, referenceBestIndices(curriculum));
        const actual = gradeOf(curriculum, getBestEliminationIndicesDp(plain));

        if (expected === undefined) {
          expect(actual).toBeUndefined();
        } else {
          expect(actual).toBeCloseTo(expected, 9);
        }
      }
    });

    test('keeps the current elimination if it is optimal', () => {
      const random = createRandom(2024);
      for (let i = 0; i < 1000; i += 1) {
        const curriculum = randomCurriculum(random);
        const optimal = referenceBestIndices(curriculum);
        applyElimination(curriculum, optimal);

        expect(getBestEliminationIndicesDp(toEliminationCurriculum(curriculum))).toEqual(optimal);
      }
    });

    test('solves large curricula quickly', () => {
      const random = createRandom(7);
      const grades = [1.0, 1.3, 1.7, 2.0, 2.3, 2.7, 3.0, 3.3, 3.7, 4.0];
      const curriculum = new Curriculum(
        'Large curriculum',
        Array.from(
          { length: 10 },
          (__, areaIndex) =>
            new ModuleArea(
              `Area ${areaIndex}`,
              Array.from(
                { length: 8 },
                (___, moduleIndex) =>
                  new Module(
                    `Module ${moduleIndex}`,
                    [3, 5, 6, 8, 10][Math.floor(random() * 5)],
                    grades[Math.floor(random() * grades.length)],
                  ),
              ),
              2,
              15,
            ),
        ),
        8,
        50,
      );

      const start = performance.now();
      const indices = getBestEliminationIndicesDp(toEliminationCurriculum(curriculum));
      const duration = performance.now() - start;

      expect(indices.length).toBeGreaterThan(0);
      expect(gradeOf(curriculum, indices)).toBeLessThan(curriculum.grade as number);
      expect(duration).toBeLessThan(500);
    });
  });
});
