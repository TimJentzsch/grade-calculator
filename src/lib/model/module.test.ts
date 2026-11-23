import { describe, expect, test } from 'vitest';
import Module from './module.svelte';

describe('Module', () => {
  // --- Attributes ---
  describe('attributes', () => {
    // Name
    describe('name', () => {
      test('correct assignment', () => {
        const module = new Module('Test module', 5, 2.3, 1);
        expect(module.name).toEqual('Test module');
      });
    });
    // Credits
    describe('credits', () => {
      test('correct assignment', () => {
        const module = new Module('Test module', 5, 2.3, 1);
        expect(module.credits).toBe(5);
      });
      test('default assignment is 0', () => {
        const module = new Module('Test module', undefined, 2.3, 1);
        expect(module.credits).toBe(0);
      });
    });
    // Has grade
    describe('hasGrade', () => {
      test('false for ungraded module', () => {
        const module = new Module('Test module', 5, undefined, 1, true, true);
        expect(module.hasGrade).toBeFalsy();
      });
      test('false for graded module without credits', () => {
        const module = new Module('Test module', 0, 2.3, 1);
        expect(module.hasGrade).toBeFalsy();
      });
      test('false for graded incomplete module', () => {
        const module = new Module('Test module', 5, undefined, 1);
        expect(module.hasGrade).toBeFalsy();
      });
      test('true for graded complete module', () => {
        const module = new Module('Test module', 5, 2.3, 1);
        expect(module.hasGrade).toBeTruthy();
      });
    });
    // Is graded
    describe('isGraded', () => {
      test('true assignment', () => {
        const module = new Module('Test module', 5, 2.3, 1);
        expect(module.isGraded).toBeTruthy();
      });
      test('false assignment', () => {
        const module = new Module('Test module', 5, undefined, 1, true, true);
        expect(module.isGraded).toBeFalsy();
      });
    });
    // Completed
    describe('completed', () => {
      test('true for graded assignment', () => {
        const module = new Module('Test module', 5, 2.3, 1);
        expect(module.completed).toBeTruthy();
      });
      test('false for graded assignment', () => {
        const module = new Module('Test module', 5, undefined, 1);
        expect(module.completed).toBeFalsy();
      });
      test('true for ungraded assignment', () => {
        const module = new Module('Test module', 5, undefined, 1, true, true);
        expect(module.completed).toBeTruthy();
      });
      test('false for ungraded assignment', () => {
        const module = new Module('Test module', 5, undefined, 1, true);
        expect(module.completed).toBeFalsy();
      });
    });
    // Weight
    describe('weight', () => {
      test('correct assignment', () => {
        const module = new Module('Test module', 5, 2.3, 1.5);
        expect(module.weight).toBe(1.5);
      });
      test('default assignment is 1', () => {
        const module = new Module('Test module', 5, 2.3);
        expect(module.weight).toBe(1);
      });
    });
    // Weighted credits
    describe('weightedCredits', () => {
      test('3 * 5 = 15', () => {
        const module = new Module('Test module', 5, 2.3, 3);
        expect(module.weightedCredits).toBe(15);
      });
    });
    // Weighted grade
    describe('weightedGrade', () => {
      test('3 * 5 * 2.3 = 34.5', () => {
        const module = new Module('Test module', 5, 2.3, 3);
        expect(module.weightedGrade).toBe(34.5);
      });
    });
    // Grade text
    describe('gradeText', () => {
      test('incomplete graded module text is "TBD"', () => {
        const module = new Module('Test module', 5, undefined, 3);
        expect(module.gradeText).toEqual('TBD');
      });
      test('incomplete ungraded module text is "TBD"', () => {
        const module = new Module('Test module', 5, undefined, 3, true);
        expect(module.gradeText).toEqual('TBD');
      });
      test('complete graded module text is grade', () => {
        const module = new Module('Test module', 5, 2.3, 3);
        expect(module.gradeText).toEqual('2.3');
      });
      test('complete ungraded module text is "B"', () => {
        const module = new Module('Test module', 5, undefined, 3, true, true);
        expect(module.gradeText).toEqual('B');
      });
      test('grade is truncated to one decimal place', () => {
        const module = new Module('Test module', 5, 2.37);
        expect(module.grade).toBe(2.3);
        expect(module.gradeText).toEqual('2.3');
      });
      test('grade of a loaded module is truncated', () => {
        const module = Module.fromObject({ name: 'Test module', credits: 5, grade: 1.99 });
        expect(module.grade).toBe(1.9);
      });
      describe('isEmpty', () => {
        test('empty module', () => {
          const module = new Module('', 5, undefined, 3);
          expect(module.isEmpty).toBeTruthy();
        });
        test('non-empty module', () => {
          const module = new Module('Test module', 5, undefined, 3);
          expect(module.isEmpty).toBeFalsy();
        });
      });
    });
  });
  // --- Functions ---
  describe('functions', () => {
    // Clone
    describe('clone', () => {
      test('equality for graded module', () => {
        const module = new Module('Test module', 5, 2.3, 3);
        expect(module.clone()).toEqual(module);
      });
      test('equality for ungraded module', () => {
        const module = new Module('Test module', 5, undefined, 3, true, true);
        expect(module.clone()).toEqual(module);
      });
      test('equality for graded module', () => {
        const module = new Module('Test module', 5, 2.3, 3, undefined, undefined, true);
        const clone = module.clone();

        clone.eliminated = undefined;
        expect(module.eliminated).toBeTruthy();
        expect(clone.eliminated).toBeFalsy();
      });
    });
    // Best case
    describe('bestCase', () => {
      test('incomplete graded module recieves 1.0 as grade', () => {
        const module = new Module('Test module', 5, undefined, 3);
        expect(module.bestCase().grade).toBe(1.0);
      });
      test('no changes for graded module with grade', () => {
        const module = new Module('Test module', 5, 2.3, 3);
        expect(module.bestCase()).toEqual(module);
      });
      test('incomplete ungraded module passes', () => {
        const module = new Module('Test module', 5, undefined, 3, true);
        expect(module.bestCase().passed).toBeTruthy();
      });
      test('no changes for ungraded passed module', () => {
        const module = new Module('Test module', 5, undefined, 3, true, true);
        expect(module.bestCase()).toEqual(module);
      });
    });
    // Worst case
    describe('worstCase', () => {
      test('incomplete graded module recieves 4.0 as grade', () => {
        const module = new Module('Test module', 5, undefined, 3);
        expect(module.worstCase().grade).toBe(4.0);
      });
      test('no changes for module with grade', () => {
        const module = new Module('Test module', 5, 2.3, 3);
        expect(module.worstCase()).toEqual(module);
      });
      test('incomplete ungraded module passes', () => {
        const module = new Module('Test module', 5, undefined, 3, true);
        expect(module.worstCase().passed).toBeTruthy();
      });
      test('no changes for ungraded module', () => {
        const module = new Module('Test module', 5, undefined, 3, true, true);
        expect(module.worstCase()).toEqual(module);
      });
    });
    // To object
    describe('toObject', () => {
      test('complete graded module', () => {
        const module = new Module('Test module', 5, 2.3, 3);
        const expectedObj = {
          name: 'Test module',
          credits: 5,
          grade: 2.3,
          weight: 3,
        };
        expect(module.toObject()).toEqual(expectedObj);
      });
      test('incomplete ungraded module', () => {
        const module = new Module('Test module', 5, undefined, 3);
        const expectedObj = {
          name: 'Test module',
          credits: 5,
          weight: 3,
        };
        expect(module.toObject()).toEqual(expectedObj);
      });
      test('complete ungraded module', () => {
        const module = new Module('Test module', 5, undefined, 3, true, true);
        const expectedObj = {
          name: 'Test module',
          credits: 5,
          weight: 3,
          notGraded: true,
          passed: true,
        };
        expect(module.toObject()).toEqual(expectedObj);
      });
      test('incomplete ungraded module', () => {
        const module = new Module('Test module', 5, undefined, 3, true);
        const expectedObj = {
          name: 'Test module',
          credits: 5,
          weight: 3,
          notGraded: true,
        };
        expect(module.toObject()).toEqual(expectedObj);
      });
      test('default weight deleted', () => {
        const module = new Module('Test module', 5, undefined, 1, true);
        expect(module.toObject().weight).toBeUndefined();
      });
      test('graded module annotation deleted', () => {
        const module = new Module('Test module', 5, 2.3, 1);
        expect(module.toObject().notGraded).toBeUndefined();
      });
    });
    // From object
    describe('fromObject', () => {
      test('from graded object', () => {
        const obj = {
          name: 'Test module',
          credits: 5,
          grade: 2.3,
          weight: 3,
        };
        const expectedModule = new Module('Test module', 5, 2.3, 3);
        expect(Module.fromObject(obj)).toEqual(expectedModule);
      });
      test('from ungraded object', () => {
        const obj = {
          name: 'Test module',
          credits: 5,
          weight: 3,
          notGraded: true,
          passed: true,
        };
        const expectedModule = new Module('Test module', 5, undefined, 3, true, true);
        expect(Module.fromObject(obj)).toEqual(expectedModule);
      });
    });
  });

  describe('setGraded', () => {
    test('an entered grade counts as passed', () => {
      const module = new Module('Programming', 8, 2.3, 1, false, undefined, true);
      module.setGraded(false);
      expect(module.isGraded).toBe(false);
      expect(module.passed).toBe(true);
      expect(module.grade).toBeUndefined();
      expect(module.eliminated).toBeUndefined();
      expect(module.completed).toBe(true);
    });

    test('an open grade stays open', () => {
      const module = new Module('Programming', 8);
      module.setGraded(false);
      expect(module.passed).toBeFalsy();
      expect(module.completed).toBe(false);
    });

    test('a passed module starts with an open grade', () => {
      const module = new Module('Lab', 6, undefined, 1, true, true);
      module.setGraded(true);
      expect(module.isGraded).toBe(true);
      expect(module.passed).toBeUndefined();
      expect(module.grade).toBeUndefined();
      expect(module.gradeText).toBe('TBD');
    });

    test('does nothing if the type does not change', () => {
      const module = new Module('Programming', 8, 2.3, 1, false, undefined, true);
      module.setGraded(true);
      expect(module.grade).toBe(2.3);
      expect(module.eliminated).toBe(true);
    });
  });

  describe('additional', () => {
    test('survives saving and loading', () => {
      const module = new Module('Test module', 5, 2.3);
      module.setAdditional(true);
      expect(module.toObject().additional).toBe(true);
      expect(Module.fromObject(module.toObject()).additional).toBe(true);
      expect(module.clone().additional).toBe(true);
    });

    test('is omitted from the saved object if not set', () => {
      expect(new Module('Test module', 5, 2.3).toObject().additional).toBeUndefined();
    });

    test('resets the elimination', () => {
      const module = new Module('Test module', 5, 2.3, 1, false, undefined, true);
      module.setAdditional(true);
      expect(module.eliminated).toBeUndefined();
      module.setAdditional(false);
      expect(module.additional).toBeUndefined();
    });
  });

  describe('unknown grade', () => {
    /** An eliminated module imported from a Notenspiegel, which only shows "B". */
    const unknownGrade = () => new Module('Test module', 6, undefined, 1, false, true, true);

    test('is completed, but has no grade', () => {
      const module = unknownGrade();
      expect(module.gradeUnknown).toBe(true);
      expect(module.completed).toBe(true);
      expect(module.hasGrade).toBe(false);
    });

    test('is shown as passed', () => {
      const module = unknownGrade();
      expect(module.gradeText).toBe('B');
      expect(module.eliminationGradeText).toBe('B');
    });

    test('requires the module to be eliminated and passed', () => {
      expect(new Module('Test module', 6, undefined, 1, false, true).gradeUnknown).toBe(false);
      expect(new Module('Test module', 6, undefined, 1, false, false, true).gradeUnknown).toBe(
        false,
      );
      expect(new Module('Test module', 6, undefined, 1, true, true, true).gradeUnknown).toBe(false);
    });

    test('becomes a normal eliminated module once a grade is entered', () => {
      const module = unknownGrade();
      module.grade = 3.7;
      expect(module.gradeUnknown).toBe(false);
      expect(module.eliminated).toBe(true);
      expect(module.gradeText).toBe('3.7');
    });

    test('survives saving and loading', () => {
      const module = Module.fromObject(unknownGrade().toObject());
      expect(module.gradeUnknown).toBe(true);
    });
  });
});
