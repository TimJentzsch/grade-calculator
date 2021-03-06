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
          new Module('Test module 1', 8, undefined, 2, true, true),
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
          new Module('Test module 1', 8, undefined, 2, true, true),
          new Module('Test module 2', 3, undefined, undefined, true, undefined),
        ]);

        expect(moduleArea.weightedGrade).toBeUndefined();
      });
    });
    // Grade partially completed
    describe('gradePartiallyCompleted', () => {
      test('for incomplete graded module area', () => {
        const moduleArea = new ModuleArea('Test module area', [
          new Module('Test module 1', 6, undefined, 1.5, undefined, undefined),
          new Module('Test module 2', 7, undefined, undefined, undefined, undefined),
          new Module('Test module 3', 4, undefined, undefined, undefined, undefined),
          new Module('Test module 4', 8, undefined, 2, true, true),
          new Module('Test module 5', 3, undefined, undefined, true, undefined),
        ]);

        expect(moduleArea.gradePartiallyCompleted).toBeFalsy();
      });
      test('for partially completed graded module area', () => {
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
      test('for completed graded module area', () => {
        const moduleArea = new ModuleArea('Test module area', [
          new Module('Test module 1', 6, 2.3, 1.5, undefined, undefined),
          new Module('Test module 2', 7, 4.0, undefined, undefined, undefined),
          new Module('Test module 3', 3, 1.7, undefined, undefined, undefined),
        ]);

        expect(moduleArea.gradePartiallyCompleted).toBeTruthy();
      });
      test('for incomplete ungraded module area', () => {
        const moduleArea = new ModuleArea('Test module area', [
          new Module('Test module 1', 8, undefined, 2, true, false),
          new Module('Test module 2', 3, undefined, undefined, true, undefined),
        ]);

        expect(moduleArea.gradePartiallyCompleted).toBeFalsy();
      });
      test('for partially completed ungraded module area', () => {
        const moduleArea = new ModuleArea('Test module area', [
          new Module('Test module 1', 8, undefined, 2, true, true),
          new Module('Test module 2', 3, undefined, undefined, true, undefined),
        ]);

        expect(moduleArea.gradePartiallyCompleted).toBeTruthy();
      });
      test('for completed ungraded module area', () => {
        const moduleArea = new ModuleArea('Test module area', [
          new Module('Test module 1', 8, undefined, 2, true, true),
          new Module('Test module 2', 3, undefined, undefined, true, true),
        ]);

        expect(moduleArea.gradePartiallyCompleted).toBeTruthy();
      });
    });
    // Grade completed
    describe('gradeCompleted', () => {
      test('for incomplete graded module area', () => {
        const moduleArea = new ModuleArea('Test module area', [
          new Module('Test module 1', 6, undefined, 1.5, undefined, undefined),
          new Module('Test module 2', 7, undefined, undefined, undefined, undefined),
          new Module('Test module 3', 4, undefined, undefined, undefined, undefined),
          new Module('Test module 4', 8, 2, undefined, true, true),
          new Module('Test module 5', 3, undefined, undefined, true, undefined),
        ]);

        expect(moduleArea.gradeCompleted).toBeFalsy();
      });
      test('for partially completed graded module area', () => {
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
      test('for completed graded module area', () => {
        const moduleArea = new ModuleArea('Test module area', [
          new Module('Test module 1', 6, 2.3, 1.5, undefined, undefined),
          new Module('Test module 2', 7, 4.0, undefined, undefined, undefined),
          new Module('Test module 3', 3, 1.7, undefined, undefined, undefined),
        ]);

        expect(moduleArea.gradeCompleted).toBeTruthy();
      });
      test('for incomplete ungraded module area', () => {
        const moduleArea = new ModuleArea('Test module area', [
          new Module('Test module 1', 8, undefined, 2, true, false),
          new Module('Test module 2', 3, undefined, undefined, true, undefined),
        ]);

        expect(moduleArea.gradeCompleted).toBeFalsy();
      });
      test('for partially completed ungraded module area', () => {
        const moduleArea = new ModuleArea('Test module area', [
          new Module('Test module 1', 8, undefined, 2, true, true),
          new Module('Test module 2', 3, undefined, undefined, true, undefined),
        ]);

        expect(moduleArea.gradeCompleted).toBeFalsy();
      });
      test('for completed ungraded module area', () => {
        const moduleArea = new ModuleArea('Test module area', [
          new Module('Test module 1', 8, undefined, 2, true, true),
          new Module('Test module 2', 3, undefined, undefined, true, true),
        ]);

        expect(moduleArea.gradeCompleted).toBeTruthy();
      });
    });
    // Grade text
    describe('gradeText', () => {
      test('for incomplete graded module area', () => {
        const moduleArea = new ModuleArea('Test module area', [
          new Module('Test module 1', 6, undefined, 1.5, undefined, undefined),
          new Module('Test module 2', 7, undefined, undefined, undefined, undefined),
          new Module('Test module 3', 4, undefined, undefined, undefined, undefined),
          new Module('Test module 4', 8, undefined, 2, true, true),
          new Module('Test module 5', 3, undefined, undefined, true, undefined),
        ]);

        expect(moduleArea.gradeText).toEqual('TBD');
      });
      test('for partially completed graded module area', () => {
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
      test('for completed graded module area', () => {
        const moduleArea = new ModuleArea('Test module area', [
          new Module('Test module 1', 6, 2.3, 1.5, undefined, undefined),
          new Module('Test module 2', 7, 4.0, undefined, undefined, undefined),
          new Module('Test module 3', 3, 1.7, undefined, undefined, undefined),
        ]);

        expect(moduleArea.gradeText).toEqual('2.83');
      });
      test('for incomplete ungraded module area', () => {
        const moduleArea = new ModuleArea('Test module area', [
          new Module('Test module 1', 8, undefined, 2, true, false),
          new Module('Test module 2', 3, undefined, undefined, true, undefined),
        ]);

        expect(moduleArea.gradeText).toEqual('TBD');
      });
      test('for partially completed ungraded module area', () => {
        const moduleArea = new ModuleArea('Test module area', [
          new Module('Test module 1', 8, undefined, 2, true, true),
          new Module('Test module 2', 3, undefined, undefined, true, undefined),
        ]);

        expect(moduleArea.gradeText).toEqual('B');
      });
      test('for completed ungraded module area', () => {
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
    // eliminatedModuleCount
    describe('eliminatedModuleCount', () => {
      test('for one eliminated module', () => {
        const moduleArea = new ModuleArea(
          '',
          [new Module('Test module 1', 8, 2, 1, false, true, true)],
          0,
          30,
        );

        expect(moduleArea.eliminatedModuleCount).toBe(1);
      });
    });
    // hasValidEliminationCount
    describe('hasValidEliminationCount', () => {
      test('for too many eliminated modules', () => {
        const moduleArea = new ModuleArea(
          '',
          [new Module('Test module 1', 8, 2, 1, false, true, true)],
          0,
          30,
        );

        expect(moduleArea.hasValidEliminationCount).toBeFalsy();
      });
    });
    // isValidElimination
    describe('isValidElimination', () => {
      test('for too many eliminated modules', () => {
        const moduleArea = new ModuleArea(
          '',
          [new Module('Test module 1', 8, 2, 1, false, true, true)],
          0,
          30,
        );

        expect(moduleArea.isValidElimination).toBeFalsy();
      });
      test('for too many eliminated credits', () => {
        const moduleArea = new ModuleArea(
          '',
          [new Module('Test module 1', 8, 2, 1, false, true, true)],
          5,
          6,
        );

        expect(moduleArea.isValidElimination).toBeFalsy();
      });
    });
  });
  // --- Functions ---
  describe('functions', () => {
    // Add module
    describe('addModule', () => {
      test('add on empty', () => {
        const moduleArea = new ModuleArea('Test module area', []);
        const module = new Module('Test module', 6, 2.3, undefined, undefined, undefined);
        moduleArea.addModule(module);
        expect(moduleArea.modules).toEqual([module]);
      });
      test('add additional', () => {
        const module1 = new Module('Test module', 6, undefined, undefined, true, undefined);
        const module2 = new Module('Test module', 6, 2.3, undefined, undefined, undefined);
        const moduleArea = new ModuleArea('Test module area', [module1]);
        moduleArea.addModule(module2);
        expect(moduleArea.modules).toEqual([module1, module2]);
      });
    });
  });
  // Clone
  describe('clone', () => {
    test('equality', () => {
      const moduleArea = new ModuleArea('Test module area', [
        new Module('Test module 1', 6, undefined, 1.5, undefined, undefined),
        new Module('Test module 2', 7, 2.3, undefined, undefined, undefined),
        new Module('Test module 3', 3, undefined, undefined, true, true),
      ]);
      expect(moduleArea.clone()).toEqual(moduleArea);
    });
    test('change resistence', () => {
      const testModule = new Module('Test module 1', 6, undefined, 1.5, undefined, true, true);
      const moduleArea = new ModuleArea('Test module area', [
        testModule,
        new Module('Test module 2', 7, 2.3, undefined, undefined, undefined),
        new Module('Test module 3', 3, undefined, undefined, true, true),
      ]);

      const clone = moduleArea.clone();
      testModule.eliminated = false;

      expect(clone.modules[0].eliminated).toBeTruthy();
    });
  });
  // Best case
  describe('bestCase', () => {
    test('fills incomplete graded modules with 1.0', () => {
      const moduleArea = new ModuleArea('Test module area', [
        new Module('Test module 1', 6, undefined, 1.5, undefined, undefined),
        new Module('Test module 2', 7, 2.3, undefined, undefined, undefined),
        new Module('Test module 3', 3, undefined, undefined, undefined, undefined),
      ]);
      const bestCase = new ModuleArea('Test module area', [
        new Module('Test module 1', 6, 1.0, 1.5, undefined, undefined),
        new Module('Test module 2', 7, 2.3, undefined, undefined, undefined),
        new Module('Test module 3', 3, 1.0, undefined, undefined, undefined),
      ]);
      expect(moduleArea.bestCase()).toEqual(bestCase);
    });
    test('fills incomplete ungraded modules with B', () => {
      const moduleArea = new ModuleArea('Test module area', [
        new Module('Test module 1', 6, undefined, 1.5, true, undefined),
        new Module('Test module 2', 7, undefined, undefined, true, true),
        new Module('Test module 3', 3, undefined, undefined, true, undefined),
      ]);
      const bestCase = new ModuleArea('Test module area', [
        new Module('Test module 1', 6, undefined, 1.5, true, true),
        new Module('Test module 2', 7, undefined, undefined, true, true),
        new Module('Test module 3', 3, undefined, undefined, true, true),
      ]);
      expect(moduleArea.bestCase()).toEqual(bestCase);
    });
    test('fills mixed modules with 1.0 / B', () => {
      const moduleArea = new ModuleArea('Test module area', [
        new Module('Test module 1', 6, undefined, 1.5, true, undefined),
        new Module('Test module 2', 7, undefined, undefined, true, true),
        new Module('Test module 3', 3, undefined, undefined, undefined, undefined),
      ]);
      const bestCase = new ModuleArea('Test module area', [
        new Module('Test module 1', 6, undefined, 1.5, true, true),
        new Module('Test module 2', 7, undefined, undefined, true, true),
        new Module('Test module 3', 3, 1.0, undefined, undefined, undefined),
      ]);
      expect(moduleArea.bestCase()).toEqual(bestCase);
    });
  });
  // Worst case
  describe('worstCase', () => {
    test('fills incomplete graded modules with 4.0', () => {
      const moduleArea = new ModuleArea('Test module area', [
        new Module('Test module 1', 6, undefined, 1.5, undefined, undefined),
        new Module('Test module 2', 7, 2.3, undefined, undefined, undefined),
        new Module('Test module 3', 3, undefined, undefined, undefined, undefined),
      ]);
      const worstCase = new ModuleArea('Test module area', [
        new Module('Test module 1', 6, 4.0, 1.5, undefined, undefined),
        new Module('Test module 2', 7, 2.3, undefined, undefined, undefined),
        new Module('Test module 3', 3, 4.0, undefined, undefined, undefined),
      ]);
      expect(moduleArea.worstCase()).toEqual(worstCase);
    });
    test('fills incomplete ungraded modules with B', () => {
      const moduleArea = new ModuleArea('Test module area', [
        new Module('Test module 1', 6, undefined, 1.5, true, undefined),
        new Module('Test module 2', 7, undefined, undefined, true, true),
        new Module('Test module 3', 3, undefined, undefined, true, undefined),
      ]);
      const worstCase = new ModuleArea('Test module area', [
        new Module('Test module 1', 6, undefined, 1.5, true, true),
        new Module('Test module 2', 7, undefined, undefined, true, true),
        new Module('Test module 3', 3, undefined, undefined, true, true),
      ]);
      expect(moduleArea.worstCase()).toEqual(worstCase);
    });
    test('fills mixed modules with 4.0 / B', () => {
      const moduleArea = new ModuleArea('Test module area', [
        new Module('Test module 1', 6, undefined, 1.5, true, undefined),
        new Module('Test module 2', 7, undefined, undefined, true, true),
        new Module('Test module 3', 3, undefined, undefined, undefined, undefined),
      ]);
      const worstCase = new ModuleArea('Test module area', [
        new Module('Test module 1', 6, undefined, 1.5, true, true),
        new Module('Test module 2', 7, undefined, undefined, true, true),
        new Module('Test module 3', 3, 4.0, undefined, undefined, undefined),
      ]);
      expect(moduleArea.worstCase()).toEqual(worstCase);
    });
  });
  // To object
  describe('toObject', () => {
    test('mixed moduleArea equality', () => {
      const moduleArea = new ModuleArea('Test module area', [
        new Module('Test module 1', 6, undefined, 1.5, undefined, undefined),
        new Module('Test module 2', 7, 2.3, undefined, undefined, undefined),
        new Module('Test module 3', 3, undefined, undefined, true, true),
      ]);
      const expectedObj = {
        name: 'Test module area',
        modules: [
          {
            name: 'Test module 1',
            credits: 6,
            weight: 1.5,
          },
          {
            name: 'Test module 2',
            credits: 7,
            grade: 2.3,
          },
          {
            name: 'Test module 3',
            credits: 3,
            notGraded: true,
            passed: true,
          },
        ],
      };
      expect(moduleArea.toObject()).toEqual(expectedObj);
    });
  });
  // From object
  describe('fromObject', () => {
    test('mixed moduleArea equality', () => {
      const obj = {
        name: 'Test module area',
        modules: [
          {
            name: 'Test module 1',
            credits: 6,
            weight: 1.5,
          },
          {
            name: 'Test module 2',
            credits: 7,
            grade: 2.3,
          },
          {
            name: 'Test module 3',
            credits: 3,
            notGraded: true,
            passed: true,
          },
        ],
      };
      const expectedModuleArea = new ModuleArea('Test module area', [
        new Module('Test module 1', 6, undefined, 1.5, undefined, undefined),
        new Module('Test module 2', 7, 2.3, undefined, undefined, undefined),
        new Module('Test module 3', 3, undefined, undefined, true, true),
      ]);
      expect(ModuleArea.fromObject(obj)).toEqual(expectedModuleArea);
    });
  });
});
