<script lang="ts">
  import type { Limits } from '#lib/curricula/definition.ts';
  import { getI18n } from '#lib/i18n/index.ts';

  interface Props {
    /** The limits to edit, changed in place. */
    limits: Limits;
  }

  const { limits }: Props = $props();

  const i18n = getI18n();
  const t = $derived(i18n.t);

  /** The last values, restored when a limit is switched on again. */
  const last: Record<keyof Limits, number> = {
    eliminationLimit: 0,
    eliminationCPLimit: 0,
    minCredits: 0,
    maxCredits: 0,
  };

  function setEnabled(key: keyof Limits, enabled: boolean) {
    limits[key] = enabled ? last[key] : undefined;
  }

  function setValue(key: keyof Limits, value: number | null) {
    last[key] = Math.max(0, value ?? 0);
    limits[key] = last[key];
  }
</script>

{#snippet limit(key: keyof Limits, label: string, title?: string)}
  <label class="limit" {title}
    ><input
      type="checkbox"
      bind:checked={() => limits[key] !== undefined, (enabled) => setEnabled(key, enabled)}
    />{label}<input
      type="number"
      step="1"
      min="0"
      aria-label={label}
      disabled={limits[key] === undefined}
      bind:value={() => limits[key] ?? last[key], (value) => setValue(key, value)}
    /></label
  >
{/snippet}

<div class="limits">
  <div class="limit-group" role="group" aria-label={t.editor.elimination}>
    <span class="limit-group-label">{t.editor.elimination}</span>
    {@render limit('eliminationLimit', t.editor.limitedCount)}
    {@render limit('eliminationCPLimit', t.editor.limitedCredits)}
  </div>
  <div class="limit-group" role="group" aria-label={t.editor.credits}>
    <span class="limit-group-label">{t.editor.credits}</span>
    {@render limit('minCredits', t.editor.minimum, t.editor.minimumTitle)}
    {@render limit('maxCredits', t.editor.maximum, t.editor.maximumTitle)}
  </div>
</div>

<style>
  .limits,
  .limit-group {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    gap: var(--space-sm) var(--space-md);
  }

  .limits {
    column-gap: var(--space-xl);
  }

  .limit-group-label {
    color: var(--color-text-muted);
    font-size: var(--font-size-sm);
  }

  .limit {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
  }

  .limit input[type='number'] {
    width: 5em;
  }
</style>
