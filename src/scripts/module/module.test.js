import Module from './module.js';

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
});
