import { render } from 'svelte/server';
import { describe, expect, test } from 'vitest';
import { disabledEliminationContext } from '#lib/elimination-context.ts';
import { i18nContext } from '#lib/i18n/index.ts';
import Curriculum from '#lib/model/curriculum.svelte.ts';
import ModuleArea from '#lib/model/module-area.svelte.ts';
import Module from '#lib/model/module.svelte.ts';
import AreaHeader from './AreaHeader.svelte';

function html(area: ModuleArea | Curriculum, eliminationEnabled = true): string {
  const kind = area instanceof Curriculum ? 'curriculum' : 'module-area';
  const context = new Map<symbol, unknown>([
    ...i18nContext('en'),
    ...(eliminationEnabled ? [] : disabledEliminationContext()),
  ]);
  return render(AreaHeader, { props: { kind, area }, context }).body;
}

describe('AreaHeader', () => {
  test('ignores the elimination outside the Regelstudienzeit', () => {
    const area = new ModuleArea('Area', [new Module('A', 6, 1.0), new Module('B', 6, 3.0, 1)]);
    area.modules[1].eliminated = true;
    expect(html(area)).toContain('Elimination');
    expect(html(area)).toMatch(/grade-value[^>]*>(<[^>]*>)*1\.0</);
    const body = html(area, false);
    expect(body).not.toContain('Elimination');
    expect(body).not.toContain('elimination-container');
    expect(body).toMatch(/grade-value[^>]*>(<[^>]*>)*2\.0</);
  });

  test('shows the credits', () => {
    const body = html(new ModuleArea('Area', [new Module('Module', 6, 2.0)]));
    expect(body).toMatch(/module-area-credits-value[^"]*">6</);
    expect(body).not.toContain('credit-limit');
  });

  test('shows the minimum credits if they are not reached', () => {
    const area = new ModuleArea('Area', [new Module('Module', 6, 2.0)], undefined, undefined, 24);
    const body = html(area);
    expect(body).toMatch(/min-credits[^"]*">\s*&lt; 24 CP</);
    expect(body).toContain('of at least 24 required');
  });

  test('hides credit limits that are kept', () => {
    const area = new ModuleArea(
      'Area',
      [new Module('Module', 12, 2.0)],
      undefined,
      undefined,
      6,
      12,
    );
    const body = html(area);
    expect(body).not.toContain('credit-limit');
    expect(body).not.toContain('credits-warning');
  });

  test('highlights credits above the maximum', () => {
    const area = new ModuleArea(
      'Area',
      [new Module('A', 6, 2.0), new Module('B', 8, 2.0)],
      undefined,
      undefined,
      undefined,
      10,
    );
    const body = html(area);
    expect(body).toContain('credits-warning');
    expect(body).toMatch(/max-credits[^"]*">\s*(&gt;|>) 10 CP</);
    expect(body).toContain('Mark modules with 4 CP as additional modules.');
  });

  test('includes the missing credits in the grade range', () => {
    const area = new ModuleArea('Area', [new Module('Module', 6, 2.0)], undefined, undefined, 12);
    // (2.0·6 + 1.0·6) / 12 = 1.5 and (2.0·6 + 4.0·6) / 12 = 3.0
    expect(html(area)).toContain('(1.5-3.0)');
  });

  test('highlights missing credits', () => {
    const area = new ModuleArea('Area', [new Module('Module', 6, 2.0)], undefined, undefined, 12);
    const body = html(area);
    expect(body).toContain('credits-warning');
    expect(body).toContain('6 CP are still missing.');
  });

  test('does not highlight reached credits', () => {
    const area = new ModuleArea('Area', [new Module('Module', 12, 2.0)], undefined, undefined, 12);
    expect(html(area)).not.toContain('credits-warning');
    expect(html(new ModuleArea('Area', []))).not.toContain('credits-warning');
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
    expect(body).toContain('credits-warning');
    expect(body).toContain('24 CP are still missing.');
  });
});
