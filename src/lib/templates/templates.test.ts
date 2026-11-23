import { describe, expect, test } from 'vitest';
import Curriculum from '../model/curriculum.svelte';
import { computerScienceBsc, computerScienceMsc } from './index';

describe('templates', () => {
  test('the B.Sc. requires 180 CP', () => {
    const curriculum = Curriculum.fromObject(computerScienceBsc);
    expect(curriculum.minCredits).toBe(180);
    // The electives and the application subject are added by the user
    expect(curriculum.bestCase().credits).toBe(180);
  });

  test('the M.Sc. requires 120 CP', () => {
    const curriculum = Curriculum.fromObject(computerScienceMsc);
    expect(curriculum.minCredits).toBe(120);
    expect(curriculum.bestCase().credits).toBe(120);
  });

  test('the grade range of an empty template covers all grades', () => {
    const curriculum = Curriculum.fromObject(computerScienceMsc);
    expect(curriculum.bestCase().grade).toBeCloseTo(1.0);
    expect(curriculum.worstCase().grade).toBeCloseTo(4.0);
  });
});
