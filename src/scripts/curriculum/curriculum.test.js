import Curriculum from './curriculum';
import ModuleArea from '../module_area/module_area';
import Module from '../module/module';

describe('Curriculum', () => {
  // --- Attributes ---
  describe('attributes', () => {
    // Name
    describe('name', () => {
      test('correct assignment', () => {
        const curriculum = new Curriculum('Test curriculum', [
          new ModuleArea('Test module area 1', [
            new Module('Test module 1', 8, undefined, undefined, true, true),
            new Module('Test module 2', 4, undefined, undefined, true, undefined),
          ]),
          new ModuleArea('Test module area 2', [
            new Module('Test module 3', 6, 2.3, undefined, undefined, undefined),
            new Module('Test module 4', 3, undefined, undefined, true, undefined),
          ]),
        ]);

        expect(curriculum.name).toEqual('Test curriculum');
      });
    });
    // Module areas
    describe('moduleAreas', () => {
      test('correct assignment', () => {
        const moduleAreas = [
          new ModuleArea('Test module area 1', [
            new Module('Test module 1', 8, undefined, undefined, true, true),
            new Module('Test module 2', 4, undefined, undefined, true, undefined),
          ]),
          new ModuleArea('Test module area 2', [
            new Module('Test module 3', 6, 2.3, undefined, undefined, undefined),
            new Module('Test module 4', 3, undefined, undefined, true, undefined),
          ]),
        ];
        const curriculum = new Curriculum('Test curriculum', moduleAreas);

        expect(curriculum.moduleAreas).toEqual(moduleAreas);
      });
    });
    // Partially completed module areas
    describe('partiallyCompletedModuleAreas', () => {
      test('correct filtering', () => {
        const curriculum = new Curriculum('Test curriculum', [
          new ModuleArea('Test module area 1', [
            new Module('Test module 1', 8, 2.3, undefined, undefined, undefined),
            new Module('Test module 2', 4, undefined, undefined, undefined, undefined),
          ]),
          new ModuleArea('Test module area 2', [
            new Module('Test module 3', 6, undefined, undefined, true, true),
            new Module('Test module 4', 3, undefined, undefined, true, undefined),
          ]),
          new ModuleArea('Test module area 3', [
            new Module('Test module 3', 6, undefined, undefined, undefined, undefined),
            new Module('Test module 4', 3, undefined, undefined, true, undefined),
          ]),
        ]);
        const partiallyCompletedModuleAreas = [
          new ModuleArea('Test module area 1', [
            new Module('Test module 1', 8, 2.3, undefined, undefined, undefined),
            new Module('Test module 2', 4, undefined, undefined, undefined, undefined),
          ]),
          new ModuleArea('Test module area 2', [
            new Module('Test module 3', 6, undefined, undefined, true, true),
            new Module('Test module 4', 3, undefined, undefined, true, undefined),
          ]),
        ];

        expect(curriculum.partiallyCompletedModuleAreas).toEqual(partiallyCompletedModuleAreas);
      });
    });
    // Completed module areas
    describe('completedModuleAreas', () => {
      test('correct filtering', () => {
        const curriculum = new Curriculum('Test curriculum', [
          new ModuleArea('Test module area 1', [
            new Module('Test module 1', 8, 2.3, undefined, undefined, undefined),
            new Module('Test module 2', 4, undefined, undefined, true, undefined),
          ]),
          new ModuleArea('Test module area 2', [
            new Module('Test module 3', 6, undefined, undefined, true, true),
            new Module('Test module 4', 3, undefined, undefined, true, true),
          ]),
          new ModuleArea('Test module area 3', [
            new Module('Test module 3', 6, undefined, undefined, undefined, undefined),
            new Module('Test module 4', 3, undefined, undefined, true, true),
          ]),
        ]);
        const completedModuleAreas = [
          new ModuleArea('Test module area 1', [
            new Module('Test module 1', 8, 2.3, undefined, undefined, undefined),
            new Module('Test module 2', 4, undefined, undefined, true, undefined),
          ]),
          new ModuleArea('Test module area 2', [
            new Module('Test module 3', 6, undefined, undefined, true, true),
            new Module('Test module 4', 3, undefined, undefined, true, true),
          ]),
        ];

        expect(curriculum.completedModuleAreas).toEqual(completedModuleAreas);
      });
    });
    // Graded module areas
    describe('gradedModuleAreas', () => {
      test('correct filtering', () => {
        const curriculum = new Curriculum('Test curriculum', [
          new ModuleArea('Test module area 1', [
            new Module('Test module 1', 8, 2.3, undefined, undefined, undefined),
            new Module('Test module 2', 4, undefined, undefined, true, undefined),
          ]),
          new ModuleArea('Test module area 2', [
            new Module('Test module 3', 6, undefined, undefined, true, true),
            new Module('Test module 4', 3, undefined, undefined, true, true),
          ]),
          new ModuleArea('Test module area 3', [
            new Module('Test module 3', 6, undefined, undefined, undefined, undefined),
            new Module('Test module 4', 3, undefined, undefined, undefined, undefined),
          ]),
        ]);
        const gradedModuleAreas = [
          new ModuleArea('Test module area 1', [
            new Module('Test module 1', 8, 2.3, undefined, undefined, undefined),
            new Module('Test module 2', 4, undefined, undefined, true, undefined),
          ]),
          new ModuleArea('Test module area 3', [
            new Module('Test module 3', 6, undefined, undefined, undefined, undefined),
            new Module('Test module 4', 3, undefined, undefined, undefined, undefined),
          ]),
        ];

        expect(curriculum.gradedModuleAreas).toEqual(gradedModuleAreas);
      });
    });
    // Partially completed graded module areas
    describe('partiallyCompletedGradedModuleAreas', () => {
      test('correct filtering', () => {
        const curriculum = new Curriculum('Test curriculum', [
          new ModuleArea('Test module area 1', [
            new Module('Test module 1', 8, 2.3, undefined, undefined, undefined),
            new Module('Test module 2', 4, undefined, undefined, true, undefined),
          ]),
          new ModuleArea('Test module area 2', [
            new Module('Test module 3', 6, undefined, undefined, true, true),
            new Module('Test module 4', 3, undefined, undefined, true, true),
          ]),
          new ModuleArea('Test module area 3', [
            new Module('Test module 3', 6, undefined, undefined, undefined, undefined),
            new Module('Test module 4', 3, undefined, undefined, undefined, undefined),
          ]),
        ]);
        const partiallyCompletedGradedModuleAreas = [
          new ModuleArea('Test module area 1', [
            new Module('Test module 1', 8, 2.3, undefined, undefined, undefined),
            new Module('Test module 2', 4, undefined, undefined, true, undefined),
          ]),
        ];

        expect(curriculum.partiallyCompletedGradedModuleAreas).toEqual(
          partiallyCompletedGradedModuleAreas,
        );
      });
    });
    // Completed graded module areas
    describe('completedGradedModuleAreas', () => {
      test('correct filtering', () => {
        const curriculum = new Curriculum('Test curriculum', [
          new ModuleArea('Test module area 1', [
            new Module('Test module 1', 8, 2.3, undefined, undefined, undefined),
            new Module('Test module 2', 4, undefined, undefined, true, undefined),
          ]),
          new ModuleArea('Test module area 2', [
            new Module('Test module 3', 6, undefined, undefined, true, true),
            new Module('Test module 4', 3, undefined, undefined, true, true),
          ]),
          new ModuleArea('Test module area 3', [
            new Module('Test module 5', 6, 4.0, undefined, undefined, undefined),
            new Module('Test module 6', 3, 3.7, undefined, undefined, undefined),
          ]),
          new ModuleArea('Test module area 4', [
            new Module('Test module 7', 6, undefined, undefined, undefined, undefined),
            new Module('Test module 8', 3, 1.0, undefined, undefined, undefined),
          ]),
        ]);
        const completedModuleAreas = [
          new ModuleArea('Test module area 1', [
            new Module('Test module 1', 8, 2.3, undefined, undefined, undefined),
            new Module('Test module 2', 4, undefined, undefined, true, undefined),
          ]),
          new ModuleArea('Test module area 2', [
            new Module('Test module 3', 6, undefined, undefined, true, true),
            new Module('Test module 4', 3, undefined, undefined, true, true),
          ]),
          new ModuleArea('Test module area 3', [
            new Module('Test module 5', 6, 4.0, undefined, undefined, undefined),
            new Module('Test module 6', 3, 3.7, undefined, undefined, undefined),
          ]),
        ];

        expect(curriculum.completedModuleAreas).toEqual(completedModuleAreas);
      });
    });
    // Ungraded module areas
    describe('ungradedModuleAreas', () => {
      test('correct filtering', () => {
        const curriculum = new Curriculum('Test curriculum', [
          new ModuleArea('Test module area 1', [
            new Module('Test module 1', 8, 2.3, undefined, true, undefined),
            new Module('Test module 2', 4, undefined, undefined, true, undefined),
          ]),
          new ModuleArea('Test module area 2', [
            new Module('Test module 3', 6, undefined, undefined, true, true),
            new Module('Test module 4', 3, undefined, undefined, true, true),
          ]),
          new ModuleArea('Test module area 3', [
            new Module('Test module 5', 6, undefined, undefined, undefined, undefined),
            new Module('Test module 6', 3, 3.7, undefined, undefined, undefined),
          ]),
        ]);
        const ungradedModuleAreas = [
          new ModuleArea('Test module area 1', [
            new Module('Test module 1', 8, 2.3, undefined, true, undefined),
            new Module('Test module 2', 4, undefined, undefined, true, undefined),
          ]),
          new ModuleArea('Test module area 2', [
            new Module('Test module 3', 6, undefined, undefined, true, true),
            new Module('Test module 4', 3, undefined, undefined, true, true),
          ]),
        ];

        expect(curriculum.ungradedModuleAreas).toEqual(ungradedModuleAreas);
      });
    });
    // Partially completed ungraded module areas
    describe('partiallyCompletetUngradedModuleAreas', () => {
      test('correct filtering', () => {
        const curriculum = new Curriculum('Test curriculum', [
          new ModuleArea('Test module area 1', [
            new Module('Test module 1', 8, 2.3, undefined, true, undefined),
            new Module('Test module 2', 4, undefined, undefined, true, undefined),
          ]),
          new ModuleArea('Test module area 2', [
            new Module('Test module 3', 6, undefined, undefined, true, true),
            new Module('Test module 4', 3, undefined, undefined, true, true),
          ]),
          new ModuleArea('Test module area 3', [
            new Module('Test module 5', 6, undefined, undefined, true, true),
            new Module('Test module 6', 3, undefined, undefined, true, undefined),
          ]),
        ]);
        const partiallyCompletetUngradedModuleAreas = [
          new ModuleArea('Test module area 2', [
            new Module('Test module 3', 6, undefined, undefined, true, true),
            new Module('Test module 4', 3, undefined, undefined, true, true),
          ]),
          new ModuleArea('Test module area 3', [
            new Module('Test module 5', 6, undefined, undefined, true, true),
            new Module('Test module 6', 3, undefined, undefined, true, undefined),
          ]),
        ];

        expect(curriculum.partiallyCompletetUngradedModuleAreas).toEqual(
          partiallyCompletetUngradedModuleAreas,
        );
      });
    });
    // Completed ungraded module areas
    describe('completedUngradedModuleAreas', () => {
      test('correct filtering', () => {
        const curriculum = new Curriculum('Test curriculum', [
          new ModuleArea('Test module area 1', [
            new Module('Test module 1', 8, 2.3, undefined, undefined, undefined),
            new Module('Test module 2', 4, undefined, undefined, true, undefined),
          ]),
          new ModuleArea('Test module area 2', [
            new Module('Test module 3', 6, undefined, undefined, true, true),
            new Module('Test module 4', 3, undefined, undefined, true, true),
          ]),
          new ModuleArea('Test module area 3', [
            new Module('Test module 5', 6, undefined, undefined, true, true),
            new Module('Test module 6', 3, undefined, undefined, true, undefined),
          ]),
        ]);
        const completedUngradedModuleAreas = [
          new ModuleArea('Test module area 2', [
            new Module('Test module 3', 6, undefined, undefined, true, true),
            new Module('Test module 4', 3, undefined, undefined, true, true),
          ]),
        ];

        expect(curriculum.completedUngradedModuleAreas).toEqual(completedUngradedModuleAreas);
      });
    });
    // Credits
    describe('credits', () => {
      test('for mixed curriculum', () => {
        const curriculum = new Curriculum('Test curriculum', [
          new ModuleArea('Test module area 1', [
            new Module('Test module 1', 8, 2.0, 1.5, undefined, undefined),
            new Module('Test module 2', 4, 2.7, undefined, undefined, undefined),
          ]),
          new ModuleArea('Test module area 2', [
            new Module('Test module 3', 6, 4.0, undefined, undefined, undefined),
            new Module('Test module 4', 3, undefined, undefined, true, true),
          ]),
          new ModuleArea('Test module area 3', [
            new Module('Test module 5', 6, undefined, undefined, true, true),
            new Module('Test module 6', 3, undefined, 3, true, undefined),
          ]),
        ]);

        expect(curriculum.credits).toBe(30);
      });
    });
    // Weighted credits
    describe('weightedCredits', () => {
      test('for mixed curriculum', () => {
        const curriculum = new Curriculum('Test curriculum', [
          new ModuleArea('Test module area 1', [
            new Module('Test module 1', 8, 2.0, 1.5, undefined, undefined),
            new Module('Test module 2', 4, 2.7, undefined, undefined, undefined),
          ]),
          new ModuleArea('Test module area 2', [
            new Module('Test module 3', 6, 4.0, undefined, undefined, true),
            new Module('Test module 4', 3, undefined, undefined, true, true),
          ]),
          new ModuleArea('Test module area 3', [
            new Module('Test module 5', 6, undefined, undefined, true, true),
            new Module('Test module 6', 3, undefined, 3, true, undefined),
          ]),
        ]);

        expect(curriculum.weightedCredits).toBe(22);
      });
      test('undefined for ungraded curriculum', () => {
        const curriculum = new Curriculum('Test curriculum', [
          new ModuleArea('Test module area 1', [
            new Module('Test module 1', 6, undefined, undefined, true, true),
            new Module('Test module 2', 3, undefined, undefined, true, true),
          ]),
          new ModuleArea('Test module area 2', [
            new Module('Test module 3', 6, undefined, undefined, true, true),
            new Module('Test module 4', 3, undefined, 3, true, undefined),
          ]),
        ]);

        expect(curriculum.weightedCredits).toBeUndefined();
      });
    });
    // Is graded
    describe('isGraded', () => {
      test('true for mixed curriculum', () => {
        const curriculum = new Curriculum('Test curriculum', [
          new ModuleArea('Test module area 1', [
            new Module('Test module 1', 8, 2.0, 1.5, undefined, undefined),
            new Module('Test module 2', 4, 2.7, undefined, undefined, undefined),
          ]),
          new ModuleArea('Test module area 2', [
            new Module('Test module 3', 6, 4.0, undefined, undefined, undefined),
            new Module('Test module 4', 3, undefined, undefined, true, true),
          ]),
          new ModuleArea('Test module area 3', [
            new Module('Test module 3', 6, undefined, undefined, true, true),
            new Module('Test module 4', 3, undefined, 3, true, undefined),
          ]),
        ]);

        expect(curriculum.isGraded).toBeTruthy();
      });
      test('true for only graded curriculum', () => {
        const curriculum = new Curriculum('Test curriculum', [
          new ModuleArea('Test module area 1', [
            new Module('Test module 1', 8, 2.0, 1.5, undefined, undefined),
            new Module('Test module 2', 4, 2.7, undefined, undefined, undefined),
          ]),
          new ModuleArea('Test module area 2', [
            new Module('Test module 3', 6, 4.0, undefined, undefined, undefined),
            new Module('Test module 4', 3, undefined, undefined, undefined, true),
          ]),
        ]);

        expect(curriculum.isGraded).toBeTruthy();
      });
      test('false for ungraded curriculum', () => {
        const curriculum = new Curriculum('Test curriculum', [
          new ModuleArea('Test module area 1', [
            new Module('Test module 1', 8, undefined, 3, true, true),
            new Module('Test module 2', 4, undefined, undefined, true, undefined),
          ]),
          new ModuleArea('Test module area 2', [
            new Module('Test module 3', 6, undefined, undefined, true, true),
            new Module('Test module 4', 3, undefined, undefined, true, true),
          ]),
        ]);

        expect(curriculum.isGraded).toBeFalsy();
      });
    });
    // Grade
    describe('grade', () => {
      test('for mixed curriculum', () => {
        const curriculum = new Curriculum('Test curriculum', [
          new ModuleArea('Test module area 1', [
            new Module('Test module 1', 8, 2.0, 1.5, undefined, undefined),
            new Module('Test module 2', 4, 2.7, undefined, undefined, undefined),
          ]),
          new ModuleArea('Test module area 2', [
            new Module('Test module 3', 6, 4.0, undefined, undefined, undefined),
            new Module('Test module 4', 3, undefined, undefined, true, true),
          ]),
          new ModuleArea('Test module area 3', [
            new Module('Test module 5', 6, undefined, undefined, true, true),
            new Module('Test module 6', 3, undefined, 3, true, undefined),
          ]),
        ]);

        expect(curriculum.grade).toBeCloseTo(2.67, 2);
      });
      test('undefined for ungraded curriculum', () => {
        const curriculum = new Curriculum('Test curriculum', [
          new ModuleArea('Test module area 3', [
            new Module('Test module 5', 6, undefined, undefined, true, true),
            new Module('Test module 6', 3, undefined, 3, true, undefined),
          ]),
        ]);

        expect(curriculum.grade).toBeUndefined();
      });
    });
    // Grade completed
    describe('gradeCompleted', () => {
      test('false for partially complete graded curriculum', () => {
        const curriculum = new Curriculum('Test curriculum', [
          new ModuleArea('Test module area 1', [
            new Module('Test module 1', 8, 2.0, 1.5, undefined, undefined),
            new Module('Test module 2', 4, 2.7, undefined, undefined, undefined),
          ]),
          new ModuleArea('Test module area 2', [
            new Module('Test module 3', 6, 4.0, undefined, undefined, undefined),
            new Module('Test module 4', 3, undefined, undefined, undefined, undefined),
          ]),
        ]);

        expect(curriculum.gradeCompleted).toBeFalsy();
      });
      test('true for completed graded curriculum', () => {
        const curriculum = new Curriculum('Test curriculum', [
          new ModuleArea('Test module area 1', [
            new Module('Test module 1', 8, 2.0, 1.5, undefined, undefined),
            new Module('Test module 2', 4, 2.7, undefined, undefined, undefined),
          ]),
          new ModuleArea('Test module area 2', [
            new Module('Test module 3', 6, 4.0, undefined, undefined, undefined),
            new Module('Test module 4', 3, 1.0, undefined, undefined, undefined),
          ]),
        ]);

        expect(curriculum.gradeCompleted).toBeTruthy();
      });
      test('false for incomplete ungraded curriculum', () => {
        const curriculum = new Curriculum('Test curriculum', [
          new ModuleArea('Test module area 1', [
            new Module('Test module 1', 8, undefined, 1.5, true, undefined),
            new Module('Test module 2', 4, undefined, undefined, true, undefined),
          ]),
          new ModuleArea('Test module area 2', [
            new Module('Test module 3', 6, undefined, undefined, true, undefined),
            new Module('Test module 4', 3, undefined, undefined, true, undefined),
          ]),
        ]);

        expect(curriculum.gradeCompleted).toBeFalsy();
      });
      test('true for completed ungraded module', () => {
        const curriculum = new Curriculum('Test curriculum', [
          new ModuleArea('Test module area 1', [
            new Module('Test module 1', 8, undefined, 1.5, true, true),
            new Module('Test module 2', 4, undefined, undefined, true, true),
          ]),
          new ModuleArea('Test module area 2', [
            new Module('Test module 3', 6, undefined, undefined, true, true),
            new Module('Test module 4', 3, undefined, undefined, true, true),
          ]),
        ]);

        expect(curriculum.gradeCompleted).toBeTruthy();
      });
    });
    // Grade partially completed
    describe('gradePartiallyCompleted', () => {
      test('false for incomplete graded curriculum', () => {
        const curriculum = new Curriculum('Test curriculum', [
          new ModuleArea('Test module area 1', [
            new Module('Test module 1', 8, undefined, 1.5, undefined, undefined),
            new Module('Test module 2', 4, undefined, undefined, undefined, undefined),
          ]),
          new ModuleArea('Test module area 2', [
            new Module('Test module 3', 6, undefined, undefined, undefined, undefined),
            new Module('Test module 4', 3, undefined, undefined, undefined, undefined),
          ]),
        ]);

        expect(curriculum.gradePartiallyCompleted).toBeFalsy();
      });
      test('true for partially completed graded curriculum', () => {
        const curriculum = new Curriculum('Test curriculum', [
          new ModuleArea('Test module area 1', [
            new Module('Test module 1', 8, undefined, 1.5, undefined, undefined),
            new Module('Test module 2', 4, undefined, undefined, undefined, undefined),
          ]),
          new ModuleArea('Test module area 2', [
            new Module('Test module 3', 6, 4.0, undefined, undefined, undefined),
            new Module('Test module 4', 3, undefined, undefined, undefined, undefined),
          ]),
        ]);

        expect(curriculum.gradePartiallyCompleted).toBeTruthy();
      });
      test('false for incomplete ungraded curriculum', () => {
        const curriculum = new Curriculum('Test curriculum', [
          new ModuleArea('Test module area 1', [
            new Module('Test module 1', 8, undefined, 1.5, true, undefined),
            new Module('Test module 2', 4, undefined, undefined, true, undefined),
          ]),
          new ModuleArea('Test module area 2', [
            new Module('Test module 3', 6, undefined, undefined, true, undefined),
            new Module('Test module 4', 3, undefined, undefined, true, undefined),
          ]),
        ]);

        expect(curriculum.gradePartiallyCompleted).toBeFalsy();
      });
      test('true for partially completed ungraded module', () => {
        const curriculum = new Curriculum('Test curriculum', [
          new ModuleArea('Test module area 1', [
            new Module('Test module 1', 8, undefined, 1.5, true, undefined),
            new Module('Test module 2', 4, undefined, undefined, true, undefined),
          ]),
          new ModuleArea('Test module area 2', [
            new Module('Test module 3', 6, undefined, undefined, true, undefined),
            new Module('Test module 4', 3, undefined, undefined, true, true),
          ]),
        ]);

        expect(curriculum.gradePartiallyCompleted).toBeTruthy();
      });
    });
    // Grade text
    describe('gradePartiallyCompleted', () => {
      test('TBD for incomplete graded curriculum', () => {
        const curriculum = new Curriculum('Test curriculum', [
          new ModuleArea('Test module area 1', [
            new Module('Test module 1', 8, undefined, 1.5, undefined, undefined),
            new Module('Test module 2', 4, undefined, undefined, undefined, undefined),
          ]),
          new ModuleArea('Test module area 2', [
            new Module('Test module 3', 6, undefined, undefined, undefined, undefined),
            new Module('Test module 4', 3, undefined, undefined, undefined, undefined),
          ]),
        ]);

        expect(curriculum.gradeText).toEqual('TBD');
      });
      test('grade for partially completed graded curriculum', () => {
        const curriculum = new Curriculum('Test curriculum', [
          new ModuleArea('Test module area 1', [
            new Module('Test module 1', 8, undefined, 1.5, undefined, undefined),
            new Module('Test module 2', 4, undefined, undefined, undefined, undefined),
          ]),
          new ModuleArea('Test module area 2', [
            new Module('Test module 3', 6, 4.0, undefined, undefined, undefined),
            new Module('Test module 4', 3, undefined, undefined, undefined, undefined),
          ]),
        ]);

        expect(curriculum.gradeText).toEqual('4.00');
      });
      test('TBD for incomplete ungraded curriculum', () => {
        const curriculum = new Curriculum('Test curriculum', [
          new ModuleArea('Test module area 1', [
            new Module('Test module 1', 8, undefined, 1.5, true, undefined),
            new Module('Test module 2', 4, undefined, undefined, true, undefined),
          ]),
          new ModuleArea('Test module area 2', [
            new Module('Test module 3', 6, undefined, undefined, true, undefined),
            new Module('Test module 4', 3, undefined, undefined, true, undefined),
          ]),
        ]);

        expect(curriculum.gradeText).toEqual('TBD');
      });
      test('B for partially completed ungraded module', () => {
        const curriculum = new Curriculum('Test curriculum', [
          new ModuleArea('Test module area 1', [
            new Module('Test module 1', 8, undefined, 1.5, true, undefined),
            new Module('Test module 2', 4, undefined, undefined, true, undefined),
          ]),
          new ModuleArea('Test module area 2', [
            new Module('Test module 3', 6, undefined, undefined, true, undefined),
            new Module('Test module 4', 3, undefined, undefined, true, true),
          ]),
        ]);

        expect(curriculum.gradeText).toEqual('B');
      });
    });
  });
});
