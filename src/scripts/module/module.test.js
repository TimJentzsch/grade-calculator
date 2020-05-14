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
});
