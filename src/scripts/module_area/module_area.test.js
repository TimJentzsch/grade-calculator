import ModuleArea from './module_area';
import Module from '../module/module';

describe('ModuleArea', () => {
  // --- Attributes ---
  describe('attributes', () => {
    // Name
    describe('name', () => {
      test('correct assignment', () => {
        const moduleArea = new ModuleArea('Test module area', [
          new Module('Test module 1', 6, 2.3, undefined, undefined, undefined),
          new Module('Test module 2', 4, undefined, undefined, undefined, undefined),
          new Module('Test module 3', 8, undefined, undefined, true, true),
          new Module('Test module 4', 3, undefined, undefined, true, undefined),
        ]);

        expect(moduleArea.name).toEqual('Test module area');
      });
    });
    // Modules
    describe('modules', () => {
      test('correct assignment', () => {
        const modules = [
          new Module('Test module 1', 6, 2.3, undefined, undefined, undefined),
          new Module('Test module 2', 4, undefined, undefined, undefined, undefined),
          new Module('Test module 3', 8, undefined, undefined, true, true),
          new Module('Test module 4', 3, undefined, undefined, true, undefined),
        ];
        const moduleArea = new ModuleArea('Test module area', modules);

        expect(moduleArea.modules).toEqual(modules);
      });
    });
    // Completed modules
    describe('completedModules', () => {
      test('correct filtering', () => {
        const moduleArea = new ModuleArea('Test module area', [
          new Module('Test module 1', 6, 2.3, undefined, undefined, undefined),
          new Module('Test module 2', 4, undefined, undefined, undefined, undefined),
          new Module('Test module 3', 8, undefined, undefined, true, true),
          new Module('Test module 4', 3, undefined, undefined, true, undefined),
        ]);
        const completedModules = [
          new Module('Test module 1', 6, 2.3, undefined, undefined, undefined),
          new Module('Test module 3', 8, undefined, undefined, true, true),
        ];

        expect(moduleArea.completedModules).toEqual(completedModules);
      });
    });
    // Graded modules
    describe('gradedModules', () => {
      test('correct filtering', () => {
        const moduleArea = new ModuleArea('Test module area', [
          new Module('Test module 1', 6, 2.3, undefined, undefined, undefined),
          new Module('Test module 2', 4, undefined, undefined, undefined, undefined),
          new Module('Test module 3', 8, undefined, undefined, true, true),
          new Module('Test module 4', 3, undefined, undefined, true, undefined),
        ]);
        const gradedModules = [
          new Module('Test module 1', 6, 2.3, undefined, undefined, undefined),
          new Module('Test module 2', 4, undefined, undefined, undefined, undefined),
        ];

        expect(moduleArea.gradedModules).toEqual(gradedModules);
      });
    });
    // Completed graded modules
    describe('completedGradedModules', () => {
      test('correct filtering', () => {
        const moduleArea = new ModuleArea('Test module area', [
          new Module('Test module 1', 6, 2.3, undefined, undefined, undefined),
          new Module('Test module 2', 4, undefined, undefined, undefined, undefined),
          new Module('Test module 3', 8, undefined, undefined, true, true),
          new Module('Test module 4', 3, undefined, undefined, true, undefined),
        ]);
        const completedGradedModules = [
          new Module('Test module 1', 6, 2.3, undefined, undefined, undefined),
        ];

        expect(moduleArea.completedGradedModules).toEqual(completedGradedModules);
      });
    });
    // Ungraded modules
    describe('ungradedModules', () => {
      test('correct filtering', () => {
        const moduleArea = new ModuleArea('Test module area', [
          new Module('Test module 1', 6, 2.3, undefined, undefined, undefined),
          new Module('Test module 2', 4, undefined, undefined, undefined, undefined),
          new Module('Test module 3', 8, undefined, undefined, true, true),
          new Module('Test module 4', 3, undefined, undefined, true, undefined),
        ]);
        const ungradedModules = [
          new Module('Test module 3', 8, undefined, undefined, true, true),
          new Module('Test module 4', 3, undefined, undefined, true, undefined),
        ];

        expect(moduleArea.ungradedModules).toEqual(ungradedModules);
      });
    });
    // Completed ungraded modules
    describe('completedUngradedModules', () => {
      test('correct filtering', () => {
        const moduleArea = new ModuleArea('Test module area', [
          new Module('Test module 1', 6, 2.3, undefined, undefined, undefined),
          new Module('Test module 2', 4, undefined, undefined, undefined, undefined),
          new Module('Test module 3', 8, undefined, undefined, true, true),
          new Module('Test module 4', 3, undefined, undefined, true, undefined),
        ]);
        const completedUngradedModules = [
          new Module('Test module 3', 8, undefined, undefined, true, true),
        ];

        expect(moduleArea.completedUngradedModules).toEqual(completedUngradedModules);
      });
    });
    // Credits
    describe('credits', () => {
      test('sum of all module credits', () => {
        const moduleArea = new ModuleArea('Test module area', [
          new Module('Test module 1', 6, 2.3, 1.5, undefined, undefined),
          new Module('Test module 2', 4, undefined, undefined, undefined, undefined),
          new Module('Test module 3', 8, undefined, 2, true, true),
          new Module('Test module 4', 3, undefined, undefined, true, undefined),
        ]);

        expect(moduleArea.credits).toBe(21);
      });
    });
    // Weighted credits
    describe('weighted credits', () => {
      test('weighted sum of all completed graded module credits', () => {
        const moduleArea = new ModuleArea('Test module area', [
          new Module('Test module 1', 6, 2.3, 1.5, undefined, undefined),
          new Module('Test module 2', 7, 4.0, undefined, undefined, undefined),
          new Module('Test module 3', 3, 1.7, undefined, undefined, undefined),
          new Module('Test module 4', 4, undefined, undefined, undefined, undefined),
          new Module('Test module 5', 8, undefined, 2, true, true),
          new Module('Test module 6', 3, undefined, undefined, true, undefined),
        ]);

        expect(moduleArea.weightedCredits).toBe(19);
      });
      test('undefined for ungraded module area', () => {
        const moduleArea = new ModuleArea('Test module area', [
          new Module('Test module 1', 8, undefined, 2, true, true),
          new Module('Test module 2', 3, undefined, undefined, true, undefined),
        ]);

        expect(moduleArea.weightedCredits).toBeUndefined();
      });
    });
    // Grade
    describe('grade', () => {
      test('weighted sum of all completed graded module grades', () => {
        const moduleArea = new ModuleArea('Test module area', [
          new Module('Test module 1', 6, 2.3, 1.5, undefined, undefined),
          new Module('Test module 2', 7, 4.0, undefined, undefined, undefined),
          new Module('Test module 3', 3, 1.7, undefined, undefined, undefined),
          new Module('Test module 4', 4, undefined, undefined, undefined, undefined),
          new Module('Test module 5', 8, undefined, 2, true, true),
          new Module('Test module 6', 3, undefined, undefined, true, undefined),
        ]);

        expect(moduleArea.grade).toBeCloseTo(2.83, 2);
      });
      test('undefined for ungraded module area', () => {
        const moduleArea = new ModuleArea('Test module area', [
          new Module('Test module 1', 8, 2, undefined, true, true),
          new Module('Test module 2', 3, undefined, undefined, true, undefined),
        ]);

        expect(moduleArea.grade).toBeUndefined();
      });
    });
    // Weighted grade
    describe('weightedGrade', () => {
      test('weighted sum of all completed graded module weighted grades', () => {
        const moduleArea = new ModuleArea('Test module area', [
          new Module('Test module 1', 6, 2, 1.5, undefined, undefined),
          new Module('Test module 2', 7, 4.0, undefined, undefined, undefined),
          new Module('Test module 3', 3, 1.7, undefined, undefined, undefined),
          new Module('Test module 4', 4, undefined, undefined, undefined, undefined),
          new Module('Test module 5', 8, undefined, 2, true, true),
          new Module('Test module 6', 3, undefined, undefined, true, undefined),
        ]);

        expect(moduleArea.weightedGrade).toBe(51.1);
      });
      test('undefined for ungraded module area', () => {
        const moduleArea = new ModuleArea('Test module area', [
          new Module('Test module 1', 8, 2, undefined, true, true),
          new Module('Test module 2', 3, undefined, undefined, true, undefined),
        ]);

        expect(moduleArea.weightedGrade).toBeUndefined();
      });
    });
    // Grade partially completed
    describe('gradePartiallyCompleted', () => {
      test('for incomplete graded module', () => {
        const moduleArea = new ModuleArea('Test module area', [
          new Module('Test module 1', 6, undefined, 1.5, undefined, undefined),
          new Module('Test module 2', 7, undefined, undefined, undefined, undefined),
          new Module('Test module 3', 4, undefined, undefined, undefined, undefined),
          new Module('Test module 4', 8, undefined, 2, true, true),
          new Module('Test module 5', 3, undefined, undefined, true, undefined),
        ]);

        expect(moduleArea.gradePartiallyCompleted).toBeFalsy();
      });
      test('for partially completed graded module', () => {
        const moduleArea = new ModuleArea('Test module area', [
          new Module('Test module 1', 6, 2.3, 1.5, undefined, undefined),
          new Module('Test module 2', 7, 4.0, undefined, undefined, undefined),
          new Module('Test module 3', 3, 1.7, undefined, undefined, undefined),
          new Module('Test module 4', 4, undefined, undefined, undefined, undefined),
          new Module('Test module 5', 8, undefined, 2, true, true),
          new Module('Test module 6', 3, undefined, undefined, true, undefined),
        ]);

        expect(moduleArea.gradePartiallyCompleted).toBeTruthy();
      });
      test('for completed graded module', () => {
        const moduleArea = new ModuleArea('Test module area', [
          new Module('Test module 1', 6, 2.3, 1.5, undefined, undefined),
          new Module('Test module 2', 7, 4.0, undefined, undefined, undefined),
          new Module('Test module 3', 3, 1.7, undefined, undefined, undefined),
        ]);

        expect(moduleArea.gradePartiallyCompleted).toBeTruthy();
      });
      test('for incomplete ungraded module', () => {
        const moduleArea = new ModuleArea('Test module area', [
          new Module('Test module 1', 8, undefined, 2, true, false),
          new Module('Test module 2', 3, undefined, undefined, true, undefined),
        ]);

        expect(moduleArea.gradePartiallyCompleted).toBeFalsy();
      });
      test('for partially completed ungraded module', () => {
        const moduleArea = new ModuleArea('Test module area', [
          new Module('Test module 1', 8, undefined, 2, true, true),
          new Module('Test module 2', 3, undefined, undefined, true, undefined),
        ]);

        expect(moduleArea.gradePartiallyCompleted).toBeTruthy();
      });
      test('for completed ungraded module', () => {
        const moduleArea = new ModuleArea('Test module area', [
          new Module('Test module 1', 8, 2, undefined, true, true),
          new Module('Test module 2', 3, undefined, undefined, true, true),
        ]);

        expect(moduleArea.gradePartiallyCompleted).toBeTruthy();
      });
    });
    // Grade completed
    describe('gradeCompleted', () => {
      test('for incomplete graded module', () => {
        const moduleArea = new ModuleArea('Test module area', [
          new Module('Test module 1', 6, undefined, 1.5, undefined, undefined),
          new Module('Test module 2', 7, undefined, undefined, undefined, undefined),
          new Module('Test module 3', 4, undefined, undefined, undefined, undefined),
          new Module('Test module 4', 8, 2, undefined, true, true),
          new Module('Test module 5', 3, undefined, undefined, true, undefined),
        ]);

        expect(moduleArea.gradeCompleted).toBeFalsy();
      });
      test('for partially completed graded module', () => {
        const moduleArea = new ModuleArea('Test module area', [
          new Module('Test module 1', 6, 2.3, 1.5, undefined, undefined),
          new Module('Test module 2', 7, 4.0, undefined, undefined, undefined),
          new Module('Test module 3', 3, 1.7, undefined, undefined, undefined),
          new Module('Test module 4', 4, undefined, undefined, undefined, undefined),
          new Module('Test module 5', 8, 2, undefined, true, true),
          new Module('Test module 6', 3, undefined, undefined, true, undefined),
        ]);

        expect(moduleArea.gradeCompleted).toBeFalsy();
      });
      test('for completed graded module', () => {
        const moduleArea = new ModuleArea('Test module area', [
          new Module('Test module 1', 6, 2.3, 1.5, undefined, undefined),
          new Module('Test module 2', 7, 4.0, undefined, undefined, undefined),
          new Module('Test module 3', 3, 1.7, undefined, undefined, undefined),
        ]);

        expect(moduleArea.gradeCompleted).toBeTruthy();
      });
      test('for incomplete ungraded module', () => {
        const moduleArea = new ModuleArea('Test module area', [
          new Module('Test module 1', 8, undefined, 2, true, false),
          new Module('Test module 2', 3, undefined, undefined, true, undefined),
        ]);

        expect(moduleArea.gradeCompleted).toBeFalsy();
      });
      test('for partially completed ungraded module', () => {
        const moduleArea = new ModuleArea('Test module area', [
          new Module('Test module 1', 8, undefined, 2, true, true),
          new Module('Test module 2', 3, undefined, undefined, true, undefined),
        ]);

        expect(moduleArea.gradeCompleted).toBeFalsy();
      });
      test('for completed ungraded module', () => {
        const moduleArea = new ModuleArea('Test module area', [
          new Module('Test module 1', 8, undefined, 2, true, true),
          new Module('Test module 2', 3, undefined, undefined, true, true),
        ]);

        expect(moduleArea.gradeCompleted).toBeTruthy();
      });
    });
    // Grade text
    describe('gradeText', () => {
      test('for incomplete graded module', () => {
        const moduleArea = new ModuleArea('Test module area', [
          new Module('Test module 1', 6, undefined, 1.5, undefined, undefined),
          new Module('Test module 2', 7, undefined, undefined, undefined, undefined),
          new Module('Test module 3', 4, undefined, undefined, undefined, undefined),
          new Module('Test module 4', 8, undefined, 2, true, true),
          new Module('Test module 5', 3, undefined, undefined, true, undefined),
        ]);

        expect(moduleArea.gradeText).toEqual('TBD');
      });
      test('for partially completed graded module', () => {
        const moduleArea = new ModuleArea('Test module area', [
          new Module('Test module 1', 6, 2.3, 1.5, undefined, undefined),
          new Module('Test module 2', 7, 4.0, undefined, undefined, undefined),
          new Module('Test module 3', 3, 1.7, undefined, undefined, undefined),
          new Module('Test module 4', 4, undefined, undefined, undefined, undefined),
          new Module('Test module 5', 8, undefined, 2, true, true),
          new Module('Test module 6', 3, undefined, undefined, true, undefined),
        ]);

        expect(moduleArea.gradeText).toEqual('2.83');
      });
      test('for completed graded module', () => {
        const moduleArea = new ModuleArea('Test module area', [
          new Module('Test module 1', 6, 2.3, 1.5, undefined, undefined),
          new Module('Test module 2', 7, 4.0, undefined, undefined, undefined),
          new Module('Test module 3', 3, 1.7, undefined, undefined, undefined),
        ]);

        expect(moduleArea.gradeText).toEqual('2.83');
      });
      test('for incomplete ungraded module', () => {
        const moduleArea = new ModuleArea('Test module area', [
          new Module('Test module 1', 8, undefined, 2, true, false),
          new Module('Test module 2', 3, undefined, undefined, true, undefined),
        ]);

        expect(moduleArea.gradeText).toEqual('TBD');
      });
      test('for partially completed ungraded module', () => {
        const moduleArea = new ModuleArea('Test module area', [
          new Module('Test module 1', 8, undefined, 2, true, true),
          new Module('Test module 2', 3, undefined, undefined, true, undefined),
        ]);

        expect(moduleArea.gradeText).toEqual('B');
      });
      test('for completed ungraded module', () => {
        const moduleArea = new ModuleArea('Test module area', [
          new Module('Test module 1', 8, undefined, 2, true, true),
          new Module('Test module 2', 3, undefined, undefined, true, true),
        ]);

        expect(moduleArea.gradeText).toEqual('B');
      });
    });
    // isEmpty
    describe('isEmpty', () => {
      test('for non-empty module area with name', () => {
        const moduleArea = new ModuleArea('Test module area', []);

        expect(moduleArea.isEmpty).toBeFalsy();
      });
      test('for non-empty module area with module', () => {
        const moduleArea = new ModuleArea('', [
          new Module('Test module 1', 8, undefined, 2, true, undefined),
        ]);

        expect(moduleArea.isEmpty).toBeFalsy();
      });
      test('for empty module area', () => {
        const moduleArea = new ModuleArea('', []);

        expect(moduleArea.isEmpty).toBeTruthy();
      });
    });
  });
});
