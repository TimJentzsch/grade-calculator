import Module from './module.js';

describe('Module', () => {
  // --- Attributes ---
  describe('attributes', () => {
    // Name
    describe('name', () => {
      test('correct assignment', () => {
        const module = new Module('Test module', 5, 2.3, 1, undefined, undefined);
        expect(module.name).toEqual('Test module');
      });
    });
    // Credits
    describe('credits', () => {
      test('correct assignment', () => {
        const module = new Module('Test module', 5, 2.3, 1, undefined, undefined);
        expect(module.credits).toBe(5);
      });
    });
    // Is graded
    describe('isGraded', () => {
      test('true assignment', () => {
        const module = new Module('Test module', 5, 2.3, 1, undefined, undefined);
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
        const module = new Module('Test module', 5, 2.3, 1, undefined, undefined);
        expect(module.completed).toBeTruthy();
      });
      test('false for graded assignment', () => {
        const module = new Module('Test module', 5, undefined, 1, undefined, undefined);
        expect(module.completed).toBeFalsy();
      });
      test('true for ungraded assignment', () => {
        const module = new Module('Test module', 5, undefined, 1, true, true);
        expect(module.completed).toBeTruthy();
      });
      test('false for ungraded assignment', () => {
        const module = new Module('Test module', 5, undefined, 1, true, undefined);
        expect(module.completed).toBeFalsy();
      });
    });
    // Weight
    describe('weight', () => {
      test('correct assignment', () => {
        const module = new Module('Test module', 5, 2.3, 1.5, undefined, undefined);
        expect(module.weight).toBe(1.5);
      });
      test('default assignment is 1', () => {
        const module = new Module('Test module', 5, 2.3, undefined, undefined, undefined);
        expect(module.weight).toBe(1);
      });
    });
    // Weighted credits
    describe('weightedCredits', () => {
      test('3 * 5 = 15', () => {
        const module = new Module('Test module', 5, 2.3, 3, undefined, undefined);
        expect(module.weightedCredits).toBe(15);
      });
    });
    // Weighted grade
    describe('weightedGrade', () => {
      test('3 * 5 * 2.3 = 34.5', () => {
        const module = new Module('Test module', 5, 2.3, 3, undefined, undefined);
        expect(module.weightedGrade).toBe(34.5);
      });
    });
    // Grade text
    describe('gradeText', () => {
      test('incomplete graded module text is "TBD"', () => {
        const module = new Module('Test module', 5, undefined, 3, undefined, undefined);
        expect(module.gradeText).toEqual('TBD');
      });
      test('incomplete ungraded module text is "TBD"', () => {
        const module = new Module('Test module', 5, undefined, 3, true, undefined);
        expect(module.gradeText).toEqual('TBD');
      });
      test('complete graded module text is grade', () => {
        const module = new Module('Test module', 5, 2.3, 3, undefined, undefined);
        expect(module.gradeText).toEqual('2.3');
      });
      test('complete ungraded module text is "B"', () => {
        const module = new Module('Test module', 5, undefined, 3, true, true);
        expect(module.gradeText).toEqual('B');
      });
    });
  });
  // --- Functions ---
  describe('functions', () => {
    // Clone
    describe('clone', () => {
      test('equality for graded module', () => {
        const module = new Module('Test module', 5, 2.3, 3, undefined, undefined);
        expect(module.clone()).toEqual(module);
      });
      test('equality for ungraded module', () => {
        const module = new Module('Test module', 5, undefined, 3, true, true);
        expect(module.clone()).toEqual(module);
      });
    });
    // Best case
    describe('bestCase', () => {
      test('Incomplete graded module recieves 1.0 as grade', () => {
        const module = new Module('Test module', 5, undefined, 3, undefined, undefined);
        expect(module.bestCase().grade).toBe(1.0);
      });
      test('no changes for module with grade', () => {
        const module = new Module('Test module', 5, 2.3, 3, undefined, undefined);
        expect(module.bestCase()).toEqual(module);
      });
      test('no changes for ungraded module', () => {
        const module = new Module('Test module', 5, undefined, 3, true, true);
        expect(module.bestCase()).toEqual(module);
      });
    });
    // Worst case
    describe('worstCase', () => {
      test('Incomplete graded module recieves 4.0 as grade', () => {
        const module = new Module('Test module', 5, undefined, 3, undefined, undefined);
        expect(module.worstCase().grade).toBe(4.0);
      });
      test('no changes for module with grade', () => {
        const module = new Module('Test module', 5, 2.3, 3, undefined, undefined);
        expect(module.worstCase()).toEqual(module);
      });
      test('no changes for ungraded module', () => {
        const module = new Module('Test module', 5, undefined, 3, true, true);
        expect(module.worstCase()).toEqual(module);
      });
    });
    // To object
    describe('toObject', () => {
      test('complete graded module', () => {
        const module = new Module('Test module', 5, 2.3, 3, undefined, undefined);
        const expectedObj = {
          name: 'Test module',
          credits: 5,
          grade: 2.3,
          weight: 3,
        };
        expect(module.toObject()).toEqual(expectedObj);
      });
      test('incomplete ungraded module', () => {
        const module = new Module('Test module', 5, undefined, 3, undefined, undefined);
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
        const module = new Module('Test module', 5, undefined, 3, true, undefined);
        const expectedObj = {
          name: 'Test module',
          credits: 5,
          weight: 3,
          notGraded: true,
        };
        expect(module.toObject()).toEqual(expectedObj);
      });
      test('default weight deleted', () => {
        const module = new Module('Test module', 5, undefined, 1, true, undefined);
        expect(module.toObject().weight).toBeUndefined();
      });
      test('graded module annotation deleted', () => {
        const module = new Module('Test module', 5, 2.3, 1, undefined, undefined);
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
        const expectedModule = new Module('Test module', 5, 2.3, 3, undefined, undefined);
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
