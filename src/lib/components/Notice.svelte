<script lang="ts">
  import { getI18n } from '#lib/i18n/index.ts';
  import IconButton from './IconButton.svelte';

  interface Props {
    kind: 'success' | 'warning' | 'error';
    message: string;
    details?: string[];
    onDismiss: () => void;
  }

  const { kind, message, details = [], onDismiss }: Props = $props();

  const i18n = getI18n();
  const t = $derived(i18n.t);
</script>

<div class="notice {kind}" role={kind === 'error' ? 'alert' : 'status'}>
  <div class="notice-text">
    <p>{message}</p>
    {#if details.length > 0}
      <ul>
        {#each details as detail (detail)}
          <li>{detail}</li>
        {/each}
      </ul>
    {/if}
  </div>
  <IconButton icon="x" label={t.import.dismiss} onclick={onDismiss} />
</div>

<style>
  .notice {
    display: flex;
    align-items: flex-start;
    gap: var(--space-md);
    margin: var(--space-md) 0;
    padding: var(--space-sm) var(--space-md);
    background-color: var(--color-surface);
    border-left: 4px solid var(--color-success);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-raised);
  }

  .notice.warning {
    border-left-color: var(--color-warning);
  }

  .notice.error {
    border-left-color: var(--color-danger);
  }

  .notice-text {
    flex: 1;
  }

  .notice p,
  .notice ul {
    margin: var(--space-xs) 0;
  }
</style>
