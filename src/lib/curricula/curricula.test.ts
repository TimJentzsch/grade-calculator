import { describe, expect, test } from 'vitest';
import { buildCurriculum, emptyStudy } from '../study';
import type { CurriculumDefinition } from './definition';
import {
  builtInCurricula,
  computerScienceBsc2018 as computerScienceBsc,
  computerScienceMsc2023 as computerScienceMsc,
  findCurriculum,
  isBuiltIn,
} from './index';

/** The curriculum without any results. */
function empty(definition: CurriculumDefinition) {
  return buildCurriculum(definition, emptyStudy(definition));
}

describe('built-in curricula', () => {
  test.each(builtInCurricula)('$name has unique ids', (definition) => {
    const areaIds = definition.moduleAreas.map((area) => area.id);
    const moduleIds = definition.moduleAreas.flatMap((area) => area.modules.map((m) => m.id));
    expect(new Set(areaIds).size).toBe(areaIds.length);
    expect(new Set(moduleIds).size).toBe(moduleIds.length);
  });

  test('are found by id', () => {
    expect(findCurriculum(computerScienceBsc.id)).toBe(computerScienceBsc);
    expect(findCurriculum('unknown')).toBeUndefined();
    expect(isBuiltIn(computerScienceMsc)).toBe(true);
    expect(isBuiltIn(structuredClone(computerScienceMsc))).toBe(false);
  });

  test("can't be changed", () => {
    expect(() => {
      (computerScienceBsc.moduleAreas[0].modules[0] as { credits: number }).credits = 1;
    }).toThrow();
  });

  test('the B.Sc. requires exactly 180 CP', () => {
    const curriculum = empty(computerScienceBsc);
    expect(curriculum.minCredits).toBe(180);
    expect(curriculum.maxCredits).toBe(180);
    // The electives and the application subject are added by the user
    expect(curriculum.bestCase().credits).toBe(180);
  });

  test('the B.Sc. electives and application subject have fixed credits', () => {
    const curriculum = empty(computerScienceBsc);
    const limits = curriculum.moduleAreas
      .filter((area) => area.minCredits !== undefined)
      .map((area) => [area.name, area.minCredits, area.maxCredits]);
    expect(limits).toEqual([
      ['Elective Modules', 24, 24],
      ['Application Subject', 22, 22],
    ]);
  });

  test('the M.Sc. requires exactly 120 CP', () => {
    const curriculum = empty(computerScienceMsc);
    expect(curriculum.minCredits).toBe(120);
    expect(curriculum.maxCredits).toBe(120);
    expect(curriculum.bestCase().credits).toBe(120);
  });

  test('the M.Sc. application area allows 10 to 18 CP', () => {
    const curriculum = empty(computerScienceMsc);
    const area = curriculum.moduleAreas.find(
      (moduleArea) => moduleArea.name === 'Application Area',
    );
    expect(area?.minCredits).toBe(10);
    expect(area?.maxCredits).toBe(18);
  });

  test('the grade range of an empty template covers all grades', () => {
    const curriculum = empty(computerScienceMsc);
    expect(curriculum.bestCase().grade).toBeCloseTo(1.0);
    expect(curriculum.worstCase().grade).toBeCloseTo(4.0);
  });
});
