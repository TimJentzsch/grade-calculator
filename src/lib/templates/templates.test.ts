import { describe, expect, test } from 'vitest';
import Curriculum from '../model/curriculum.svelte';
import { computerScienceBsc, computerScienceMsc } from './index';

describe('templates', () => {
  test('the B.Sc. has 180 CP', () => {
    expect(Curriculum.fromObject(computerScienceBsc).credits).toBe(180);
  });

  test('the M.Sc. has 120 CP', () => {
    expect(Curriculum.fromObject(computerScienceMsc).credits).toBe(120);
  });

  test('the M.Sc. placeholders are separate modules', () => {
    const curriculum = Curriculum.fromObject(computerScienceMsc);
    curriculum.moduleAreas[0].modules[0].grade = 1.0;
    expect(curriculum.moduleAreas[0].modules[1].grade).toBeUndefined();
  });
});
