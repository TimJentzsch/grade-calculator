import { findCurriculum, isBuiltIn } from './curricula/index.ts';
import type { CurriculumDefinition } from './curricula/definition.ts';
import Curriculum from './model/curriculum.svelte.ts';
import ModuleArea from './model/module-area.svelte.ts';
import Module, { type ModuleObject } from './model/module.svelte.ts';

/** What the user achieved in a module given by the curriculum. */
export interface ModuleResult {
  grade?: number;
  passed?: boolean;
  eliminated?: boolean;
}

/** A module chosen by the user in an area with open choice, e.g. an elective. */
export type ChosenModule = ModuleObject;

/**
 * Everything the user entered for a curriculum, as saved in the local storage and in files.
 * The curriculum itself is only referenced, unless it was created by the user.
 */
export interface StudyObject {
  version: 1;
  /** A built-in curriculum by its id, or a curriculum created by the user. */
  curriculum: { id: string } | { custom: CurriculumDefinition };
  /** The results of the modules given by the curriculum, by module id. */
  results: Record<string, ModuleResult>;
  /** The modules chosen by the user, by area id. */
  chosenModules: Record<string, ChosenModule[]>;
}

/** A study without any results for the given curriculum. */
export function emptyStudy(definition: CurriculumDefinition): StudyObject {
  return {
    version: 1,
    curriculum: isBuiltIn(definition) ? { id: definition.id } : { custom: definition },
    results: {},
    chosenModules: {},
  };
}

/**
 * The curriculum definition the study refers to.
 * @returns The definition, or `undefined` if there is no built-in curriculum with its id.
 */
export function studyDefinition(study: StudyObject): CurriculumDefinition | undefined {
  return 'custom' in study.curriculum
    ? study.curriculum.custom
    : findCurriculum(study.curriculum.id);
}

/**
 * Combines a curriculum definition with the results of the user to the model used for the
 * calculations. Results and chosen modules that don't fit the definition are left out.
 */
export function buildCurriculum(definition: CurriculumDefinition, study: StudyObject): Curriculum {
  const moduleAreas = definition.moduleAreas.map((areaDefinition) => {
    const fixed = areaDefinition.modules.map((moduleDefinition) => {
      const result = study.results[moduleDefinition.id] ?? {};
      const module = new Module(
        moduleDefinition.name,
        moduleDefinition.credits,
        result.grade,
        moduleDefinition.weight,
        moduleDefinition.notGraded,
        result.passed,
        result.eliminated,
      );
      module.definitionId = moduleDefinition.id;
      return module;
    });
    const chosen = areaDefinition.openChoice
      ? (study.chosenModules[areaDefinition.id] ?? []).map((module) => Module.fromObject(module))
      : [];

    const moduleArea = new ModuleArea(
      areaDefinition.name,
      [...fixed, ...chosen],
      areaDefinition.eliminationLimit,
      areaDefinition.eliminationCPLimit,
      areaDefinition.minCredits,
      areaDefinition.maxCredits,
    );
    moduleArea.id = areaDefinition.id;
    moduleArea.openChoice = Boolean(areaDefinition.openChoice);
    return moduleArea;
  });

  const curriculum = new Curriculum(
    definition.name,
    moduleAreas,
    definition.eliminationLimit,
    definition.eliminationCPLimit,
    definition.minCredits,
    definition.maxCredits,
  );
  curriculum.definition = definition;
  return curriculum;
}

/** The result of a module given by the curriculum, without empty values. */
function resultOf(module: Module): ModuleResult | undefined {
  const result: ModuleResult = {};
  if (module.isGraded && module.grade !== undefined) result.grade = module.grade;
  if (module.passed) result.passed = true;
  if (module.isGraded && module.eliminated) result.eliminated = true;
  return Object.keys(result).length > 0 ? result : undefined;
}

/**
 * Extracts what the user entered from a curriculum built with `buildCurriculum`.
 * @throws {Error} If the curriculum wasn't built from a definition.
 */
export function toStudy(curriculum: Curriculum): StudyObject {
  const definition = curriculum.definition;
  if (!definition) {
    throw new Error('The curriculum has no definition.');
  }
  const study = emptyStudy(definition);

  for (const moduleArea of curriculum.moduleAreas) {
    const chosen: ChosenModule[] = [];
    for (const module of moduleArea.modules) {
      if (module.definitionId === undefined) {
        chosen.push(module.toObject());
      } else {
        const result = resultOf(module);
        if (result) {
          study.results[module.definitionId] = result;
        }
      }
    }
    if (moduleArea.id !== undefined && chosen.length > 0) {
      study.chosenModules[moduleArea.id] = chosen;
    }
  }

  return study;
}

/**
 * Builds the curriculum of a study, see `buildCurriculum`.
 * @returns The curriculum, or `undefined` if the study refers to an unknown curriculum.
 */
export function curriculumOf(study: StudyObject): Curriculum | undefined {
  const definition = studyDefinition(study);
  return definition ? buildCurriculum(definition, study) : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Whether the value looks like a curriculum definition. */
function isDefinition(value: unknown): value is CurriculumDefinition {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    Array.isArray(value.moduleAreas) &&
    value.moduleAreas.every(
      (area) => isRecord(area) && typeof area.id === 'string' && Array.isArray(area.modules),
    )
  );
}

/**
 * Checks that a value, e.g. from a file, is a study that can be loaded.
 * @returns The study, or `undefined` if it isn't one or refers to an unknown curriculum.
 */
export function parseStudy(value: unknown): StudyObject | undefined {
  if (
    !isRecord(value) ||
    value.version !== 1 ||
    !isRecord(value.curriculum) ||
    !isRecord(value.results) ||
    !isRecord(value.chosenModules) ||
    !Object.values(value.chosenModules).every(Array.isArray)
  ) {
    return undefined;
  }
  const { curriculum } = value;
  const known =
    'custom' in curriculum
      ? isDefinition(curriculum.custom)
      : typeof curriculum.id === 'string' && findCurriculum(curriculum.id) !== undefined;
  return known ? (value as unknown as StudyObject) : undefined;
}
