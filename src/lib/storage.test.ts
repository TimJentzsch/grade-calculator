import { describe, expect, test, vi } from 'vitest';
import { STUDY_STORAGE_KEY, loadSavedStudy, saveStudy } from './storage.ts';
import type { StudyObject } from './study.ts';

/** A minimal in-memory implementation of the Storage interface. */
class MemoryStorage implements Storage {
  private items = new Map<string, string>();

  get length(): number {
    return this.items.size;
  }

  clear(): void {
    this.items.clear();
  }

  getItem(key: string): string | null {
    return this.items.get(key) ?? null;
  }

  key(index: number): string | null {
    return [...this.items.keys()][index] ?? null;
  }

  removeItem(key: string): void {
    this.items.delete(key);
  }

  setItem(key: string, value: string): void {
    this.items.set(key, value);
  }
}

const study: StudyObject = {
  version: 1,
  curriculum: { id: 'rwth-computer-science-bsc-2018' },
  results: { progra: { grade: 1.7 } },
  chosenModules: { electives: [{ name: 'Module', credits: 6, grade: 1.7 }] },
  regelstudienzeit: true,
};

const customStudy: StudyObject = {
  version: 1,
  curriculum: {
    custom: {
      id: 'custom',
      name: 'Custom',
      moduleAreas: [{ id: 'area', name: 'Area', modules: [{ id: 'm', name: 'M', credits: 6 }] }],
    },
  },
  results: { m: { grade: 2.0 } },
  chosenModules: {},
};

describe('storage', () => {
  test.each([
    ['built-in', study],
    ['custom', customStudy],
  ])('restores a saved study with a %s curriculum', (_, saved) => {
    const storage = new MemoryStorage();
    saveStudy(storage, saved);
    expect(loadSavedStudy(storage)).toEqual(saved);
  });

  test('removes the saved study', () => {
    const storage = new MemoryStorage();
    saveStudy(storage, study);
    saveStudy(storage, undefined);
    expect(loadSavedStudy(storage)).toBeUndefined();
  });

  test('returns undefined if nothing is saved', () => {
    expect(loadSavedStudy(new MemoryStorage())).toBeUndefined();
  });

  test.each([
    ['invalid JSON', '{'],
    ['a non-object', '42'],
    ['null', 'null'],
    ['an old curriculum', '{"name": "Test", "moduleAreas": []}'],
    ['an unknown version', JSON.stringify({ ...study, version: 2 })],
    ['an unknown curriculum', JSON.stringify({ ...study, curriculum: { id: 'unknown' } })],
    ['missing results', JSON.stringify({ ...study, results: undefined })],
    ['an invalid Regelstudienzeit', JSON.stringify({ ...study, regelstudienzeit: 'yes' })],
    [
      'a custom curriculum without areas',
      JSON.stringify({ ...customStudy, curriculum: { custom: { id: 'custom' } } }),
    ],
  ])('ignores %s', (_, value) => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const storage = new MemoryStorage();
    storage.setItem(STUDY_STORAGE_KEY, value);
    expect(loadSavedStudy(storage)).toBeUndefined();
  });

  test('ignores storage that cannot be read', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const storage = new MemoryStorage();
    vi.spyOn(storage, 'getItem').mockImplementation(() => {
      throw new Error('Access denied');
    });
    expect(loadSavedStudy(storage)).toBeUndefined();
  });

  test('ignores storage that cannot be written', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const storage = new MemoryStorage();
    vi.spyOn(storage, 'setItem').mockImplementation(() => {
      throw new Error('Quota exceeded');
    });
    expect(() => saveStudy(storage, study)).not.toThrow();
    expect(warn).toHaveBeenCalled();
  });
});
