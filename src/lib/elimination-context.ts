import { getContext, setContext } from 'svelte';

/** Whether grades can be eliminated, which requires the Regelstudienzeit. */
export interface EliminationContext {
  readonly enabled: boolean;
}

const key = Symbol('elimination');

/**
 * Provides whether grades can be eliminated to all child components.
 * @param isEnabled Returns whether elimination is enabled, so that it can change.
 */
export function setEliminationContext(isEnabled: () => boolean): EliminationContext {
  return setContext(key, {
    get enabled() {
      return isEnabled();
    },
  });
}

/** Whether grades can be eliminated. Enabled without a context, e.g. in component tests. */
export function getEliminationContext(): EliminationContext {
  return getContext<EliminationContext | undefined>(key) ?? { enabled: true };
}

/** The context that disables elimination, e.g. to render a component in a test. */
export function disabledEliminationContext(): Map<symbol, EliminationContext> {
  return new Map([[key, { enabled: false }]]);
}
