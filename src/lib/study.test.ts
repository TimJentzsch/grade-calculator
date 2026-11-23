import { describe, expect, test } from 'vitest';
import type { CurriculumDefinition } from './curricula/definition';
import { computerScienceBsc2018 } from './curricula/index';
import {
  buildCurriculum,
  curriculumOf,
  emptyStudy,
  type StudyObject,
  studyDefinition,
  toStudy,
} from './study';

const custom: CurriculumDefinition = {
  id: 'custom',
  name: 'Custom',
  eliminationLimit: 1,
  moduleAreas: [
    {
      id: 'basics',
      name: 'Basics',
      eliminationCPLimit: 10,
      modules: [
        { id: 'a', name: 'A', credits: 5 },
        { id: 'b', name: 'B', credits: 10, weight: 2 },
        { id: 'c', name: 'C', credits: 3, notGraded: true },
      ],
    },
    { id: 'electives', name: 'Electives', minCredits: 10, openChoice: true, modules: [] },
  ],
};

const study: StudyObject = {
  version: 1,
  curriculum: { custom },
  results: {
    a: { grade: 1.3 },
    b: { passed: true, eliminated: true },
    c: { passed: true },
  },
  chosenModules: {
    electives: [
      { name: 'X', credits: 6, grade: 2.0 },
      { name: 'Y', credits: 6, grade: 1.0, additional: true },
    ],
  },
};

describe('emptyStudy', () => {
  test('references built-in curricula by id', () => {
    expect(emptyStudy(computerScienceBsc2018).curriculum).toEqual({
      id: computerScienceBsc2018.id,
    });
  });

  test('contains custom curricula', () => {
    expect(emptyStudy(custom).curriculum).toEqual({ custom });
  });
});

describe('studyDefinition', () => {
  test('finds the built-in curriculum', () => {
    expect(studyDefinition(emptyStudy(computerScienceBsc2018))).toBe(computerScienceBsc2018);
  });

  test('is undefined for unknown curricula', () => {
    expect(curriculumOf({ ...study, curriculum: { id: 'unknown' } })).toBeUndefined();
  });
});

describe('buildCurriculum', () => {
  const curriculum = buildCurriculum(custom, study);

  test('takes the structure from the definition', () => {
    expect(curriculum.name).toBe('Custom');
    expect(curriculum.eliminationLimit).toBe(1);
    expect(curriculum.moduleAreas.map((area) => [area.id, area.openChoice])).toEqual([
      ['basics', false],
      ['electives', true],
    ]);
    expect(curriculum.moduleAreas[0].eliminationCPLimit).toBe(10);
    expect(curriculum.moduleAreas[1].minCredits).toBe(10);
  });

  test('applies the results to the fixed modules', () => {
    const [a, b, c] = curriculum.moduleAreas[0].modules;
    expect(a.definitionId).toBe('a');
    expect(a.grade).toBe(1.3);
    expect(b.weight).toBe(2);
    expect(b.gradeUnknown).toBe(true);
    expect(c.isGraded).toBe(false);
    expect(c.passed).toBe(true);
  });

  test('adds the chosen modules', () => {
    const modules = curriculum.moduleAreas[1].modules;
    expect(modules.map((module) => [module.name, module.definitionId, module.additional])).toEqual([
      ['X', undefined, undefined],
      ['Y', undefined, true],
    ]);
  });

  test('leaves out chosen modules of areas without open choice', () => {
    const built = buildCurriculum(custom, {
      ...study,
      chosenModules: { basics: [{ name: 'Z', credits: 5 }] },
    });
    expect(built.moduleAreas[0].modules.map((module) => module.name)).toEqual(['A', 'B', 'C']);
  });

  test('keeps the definition in copies', () => {
    expect(curriculum.clone().definition).toBe(custom);
    expect(curriculum.bestCase().moduleAreas[1].openChoice).toBe(true);
    expect(curriculum.clone().modules[0].definitionId).toBe('a');
  });
});

describe('toStudy', () => {
  test('round-trips a study', () => {
    expect(toStudy(buildCurriculum(custom, study))).toEqual(study);
  });

  test('takes changes of the user', () => {
    const curriculum = buildCurriculum(custom, study);
    curriculum.moduleAreas[0].modules[0].grade = 2.7;
    curriculum.moduleAreas[1].modules.pop();
    const changed = toStudy(curriculum);
    expect(changed.results.a).toEqual({ grade: 2.7 });
    expect(changed.chosenModules.electives).toEqual([{ name: 'X', credits: 6, grade: 2.0 }]);
  });

  test('leaves out modules without results', () => {
    const changed = toStudy(
      buildCurriculum(computerScienceBsc2018, emptyStudy(computerScienceBsc2018)),
    );
    expect(changed).toEqual(emptyStudy(computerScienceBsc2018));
  });

  test('requires a definition', () => {
    const curriculum = buildCurriculum(custom, study);
    curriculum.definition = undefined;
    expect(() => toStudy(curriculum)).toThrow();
  });
});
