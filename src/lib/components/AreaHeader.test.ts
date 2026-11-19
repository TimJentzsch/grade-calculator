import { render } from 'svelte/server';
import { describe, expect, test } from 'vitest';
import Curriculum from '#lib/model/curriculum.svelte.ts';
import ModuleArea from '#lib/model/module-area.svelte.ts';
import Module from '#lib/model/module.svelte.ts';
import AreaHeader from './AreaHeader.svelte';

function html(area: ModuleArea | Curriculum): string {
  const kind = area instanceof Curriculum ? 'curriculum' : 'module-area';
  return render(AreaHeader, {
    props: { kind, area, onAdd: () => {}, onEdit: () => {} },
  }).body;
}

describe('AreaHeader', () => {
  test('shows the credits', () => {
    const body = html(new ModuleArea('Area', [new Module('Module', 6, 2.0)]));
    expect(body).toMatch(/module-area-credits-value[^"]*">6</);
    expect(body).not.toContain('required-credits');
  });

  test('shows the required credits', () => {
    const area = new ModuleArea('Area', [new Module('Module', 6, 2.0)], undefined, undefined, 24);
    const body = html(area);
    expect(body).toMatch(/required-credits[^"]*">\/24</);
    expect(body).toContain('of 24 required');
  });

  test('includes the missing credits in the grade range', () => {
    const area = new ModuleArea('Area', [new Module('Module', 6, 2.0)], undefined, undefined, 12);
    // (2.0·6 + 1.0·6) / 12 = 1.5 and (2.0·6 + 4.0·6) / 12 = 3.0
    expect(html(area)).toContain('(1.5-3.0)');
  });

  test('highlights missing credits', () => {
    const area = new ModuleArea('Area', [new Module('Module', 6, 2.0)], undefined, undefined, 12);
    const body = html(area);
    expect(body).toContain('credits-missing');
    expect(body).toContain('6 CP are still missing.');
  });

  test('does not highlight reached credits', () => {
    const area = new ModuleArea('Area', [new Module('Module', 12, 2.0)], undefined, undefined, 12);
    expect(html(area)).not.toContain('credits-missing');
    expect(html(new ModuleArea('Area', []))).not.toContain('credits-missing');
  });

  test('highlights a curriculum whose areas are still missing credits', () => {
    const electives = new ModuleArea('Electives', [], undefined, undefined, 24);
    const curriculum = new Curriculum(
      'Curriculum',
      [new ModuleArea('Mandatory', [new Module('Module', 6, 2.0)]), electives],
      undefined,
      undefined,
      30,
    );
    const body = html(curriculum);
    expect(body).toContain('credits-missing');
    expect(body).toContain('24 CP are still missing.');
  });
});
