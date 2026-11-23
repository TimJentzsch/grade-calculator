import { parseStudy, type StudyObject } from './study.ts';

/** The local storage key under which the current study is saved. */
export const STUDY_STORAGE_KEY = 'grade-calculator.study';

/**
 * Loads the study saved in the given storage.
 * @returns The saved study, or `undefined` if none is saved or it cannot be read.
 */
export function loadSavedStudy(storage: Storage): StudyObject | undefined {
  try {
    const saved = storage.getItem(STUDY_STORAGE_KEY);
    if (saved === null) {
      return undefined;
    }
    return parseStudy(JSON.parse(saved));
  } catch (error) {
    console.warn('Failed to load the saved study:', error);
    return undefined;
  }
}

/**
 * Saves the study in the given storage, so that it can be restored on the next visit.
 * Without a study, the saved one is removed.
 * Failures (e.g. if the storage is full or disabled) are logged and otherwise ignored.
 */
export function saveStudy(storage: Storage, study: StudyObject | undefined): void {
  try {
    if (study) {
      storage.setItem(STUDY_STORAGE_KEY, JSON.stringify(study));
    } else {
      storage.removeItem(STUDY_STORAGE_KEY);
    }
  } catch (error) {
    console.warn('Failed to save the study:', error);
  }
}
