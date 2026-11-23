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
  test('uses the singular for exactly one module', () => {
    expect(text({ ...noLimits, eliminatedModuleCount: 1, eliminatedCredits: 6 })).toBe(
      'Elimination: 6 CP, 1 module',
    );
  });

  test('uses the plural for other counts', () => {
    expect(text(noLimits)).toBe('Elimination: 0 CP, 0 modules');
    expect(text({ ...noLimits, eliminatedModuleCount: 2, eliminatedCredits: 14 })).toBe(
      'Elimination: 14 CP, 2 modules',
    );
  });

  test('matches the noun to the limit if there is one', () => {
    expect(text({ ...noLimits, eliminationLimit: 1 })).toBe('Elimination: 0 CP, 0/1 module');
    expect(
      text({ ...noLimits, eliminationLimit: 3, eliminationCPLimit: 30, eliminatedModuleCount: 1 }),
    ).toBe('Elimination: 0/30 CP, 1/3 modules');
  });

  test('is translated to German', () => {
    expect(text({ ...noLimits, eliminatedModuleCount: 1, eliminatedCredits: 6 }, 'de')).toBe(
      'Streichung: 6 CP, 1 Modul',
    );
    expect(text({ ...noLimits, eliminationLimit: 3 }, 'de')).toBe('Streichung: 0 CP, 0/3 Module');
    expect(text({ ...noLimits, eliminationLimit: 0 }, 'de')).toBe('Keine Streichung erlaubt');
  });

  test('shows when no elimination is allowed', () => {
    expect(text({ ...noLimits, eliminationLimit: 0 })).toBe('No elimination allowed');
  });
});
