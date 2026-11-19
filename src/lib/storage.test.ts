import { describe, expect, test, vi } from 'vitest';
import type { CurriculumObject } from './model/curriculum.svelte.ts';
import { CURRICULUM_STORAGE_KEY, loadSavedCurriculum, saveCurriculum } from './storage.ts';

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

const curriculum: CurriculumObject = {
  name: 'Test curriculum',
  moduleAreas: [{ name: 'Area', modules: [{ name: 'Module', credits: 6, grade: 1.7 }] }],
  eliminationLimit: 2,
};

describe('storage', () => {
  test('restores a saved curriculum', () => {
    const storage = new MemoryStorage();
    saveCurriculum(storage, curriculum);
    expect(loadSavedCurriculum(storage)).toEqual(curriculum);
  });

  test('returns undefined if nothing is saved', () => {
    expect(loadSavedCurriculum(new MemoryStorage())).toBeUndefined();
  });

  test.each([
    ['invalid JSON', '{'],
    ['a non-object', '42'],
    ['null', 'null'],
    ['missing module areas', '{"name": "Test"}'],
    ['module areas without modules', '{"moduleAreas": [{"name": "Area"}]}'],
  ])('ignores %s', (_, value) => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const storage = new MemoryStorage();
    storage.setItem(CURRICULUM_STORAGE_KEY, value);
    expect(loadSavedCurriculum(storage)).toBeUndefined();
  });

  test('ignores storage that cannot be read', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const storage = new MemoryStorage();
    vi.spyOn(storage, 'getItem').mockImplementation(() => {
      throw new Error('Access denied');
    });
    expect(loadSavedCurriculum(storage)).toBeUndefined();
  });

  test('ignores storage that cannot be written', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const storage = new MemoryStorage();
    vi.spyOn(storage, 'setItem').mockImplementation(() => {
      throw new Error('Quota exceeded');
    });
    expect(() => saveCurriculum(storage, curriculum)).not.toThrow();
    expect(warn).toHaveBeenCalled();
  });
});
