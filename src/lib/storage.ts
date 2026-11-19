import type { CurriculumObject } from './model/curriculum.svelte.ts';

/** The local storage key under which the current curriculum is saved. */
export const CURRICULUM_STORAGE_KEY = 'grade-calculator.curriculum';

/** Whether the value looks like a curriculum that can be loaded. */
function isCurriculumObject(value: unknown): value is CurriculumObject {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const { moduleAreas } = value as { moduleAreas?: unknown };
  return (
    Array.isArray(moduleAreas) &&
    moduleAreas.every(
      (area) =>
        typeof area === 'object' &&
        area !== null &&
        Array.isArray((area as { modules?: unknown }).modules),
    )
  );
}

/**
 * Loads the curriculum saved in the given storage.
 * @returns The saved curriculum, or `undefined` if none is saved or it cannot be read.
 */
export function loadSavedCurriculum(storage: Storage): CurriculumObject | undefined {
  try {
    const saved = storage.getItem(CURRICULUM_STORAGE_KEY);
    if (saved === null) {
      return undefined;
    }
    const value: unknown = JSON.parse(saved);
    return isCurriculumObject(value) ? value : undefined;
  } catch (error) {
    console.warn('Failed to load the saved curriculum:', error);
    return undefined;
  }
}

/**
 * Saves the curriculum in the given storage, so that it can be restored on the next visit.
 * Failures (e.g. if the storage is full or disabled) are logged and otherwise ignored.
 */
export function saveCurriculum(storage: Storage, curriculum: CurriculumObject): void {
  try {
    storage.setItem(CURRICULUM_STORAGE_KEY, JSON.stringify(curriculum));
  } catch (error) {
    console.warn('Failed to save the curriculum:', error);
  }
}
