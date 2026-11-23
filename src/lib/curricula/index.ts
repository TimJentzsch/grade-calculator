import computerScienceBsc2018 from './computer-science-bsc-2018.ts';
import computerScienceMsc2023 from './computer-science-msc-2023.ts';
import type { CurriculumDefinition } from './definition.ts';

function deepFreeze<T>(value: T): T {
  if (typeof value === 'object' && value !== null) {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
}

/** The curricula provided by the app. They can't be changed by the user. */
export const builtInCurricula: readonly CurriculumDefinition[] = deepFreeze([
  computerScienceBsc2018,
  computerScienceMsc2023,
]);

/** Finds a built-in curriculum by its id. */
export function findCurriculum(id: string): CurriculumDefinition | undefined {
  return builtInCurricula.find((curriculum) => curriculum.id === id);
}

/** Whether the curriculum is provided by the app, i.e. it can't be changed. */
export function isBuiltIn(curriculum: CurriculumDefinition): boolean {
  return builtInCurricula.includes(curriculum);
}

export { computerScienceBsc2018, computerScienceMsc2023 };
