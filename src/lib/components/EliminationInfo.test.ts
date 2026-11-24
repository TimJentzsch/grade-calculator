import { render } from 'svelte/server';
import { describe, expect, test } from 'vitest';
import { i18nContext, type Locale } from '#lib/i18n/index.ts';
import EliminationInfo from './EliminationInfo.svelte';

type Props = Parameters<typeof EliminationInfo>[1];

/** The text content of the rendered component. */
function text(props: Omit<Props, 'kind'>, locale: Locale = 'en'): string {
  return render(EliminationInfo, {
    props: { kind: 'module-area', ...props },
    context: i18nContext(locale),
  })
    .body.replace(/<[^>]*>/g, '')
    .trim();
}

const noLimits = {
  eliminationLimit: undefined,
  eliminationCPLimit: undefined,
  eliminatedModuleCount: 0,
  eliminatedCredits: 0,
};

describe('EliminationInfo', () => {
  test('hides eliminations within the limits', () => {
    expect(text(noLimits)).toBe('');
    expect(text({ ...noLimits, eliminatedModuleCount: 2, eliminatedCredits: 14 })).toBe('');
    expect(
      text({ ...noLimits, eliminationLimit: 3, eliminationCPLimit: 30, eliminatedModuleCount: 3 }),
    ).toBe('');
    expect(text({ ...noLimits, eliminationLimit: 0 })).toBe('');
  });

  test('shows only the exceeded limits', () => {
    const exceeded = { ...noLimits, eliminationLimit: 1, eliminationCPLimit: 15 };
    expect(text({ ...exceeded, eliminatedModuleCount: 2, eliminatedCredits: 12 })).toBe(
      'Elimination: 2/1 module',
    );
    expect(text({ ...exceeded, eliminatedModuleCount: 1, eliminatedCredits: 20 })).toBe(
      'Elimination: 20/15 CP',
    );
    expect(
      text({ ...exceeded, eliminationLimit: 2, eliminatedModuleCount: 3, eliminatedCredits: 20 }),
    ).toBe('Elimination: 20/15 CP, 3/2 modules');
  });

  test('shows eliminations where none are allowed', () => {
    expect(text({ ...noLimits, eliminationLimit: 0, eliminatedModuleCount: 1 })).toBe(
      'No elimination allowed',
    );
  });

  test('is translated to German', () => {
    expect(
      text(
        { ...noLimits, eliminationLimit: 3, eliminatedModuleCount: 4, eliminatedCredits: 6 },
        'de',
      ),
    ).toBe('Streichung: 4/3 Module');
    expect(text({ ...noLimits, eliminationCPLimit: 0, eliminatedModuleCount: 1 }, 'de')).toBe(
      'Keine Streichung erlaubt',
    );
  });
});
