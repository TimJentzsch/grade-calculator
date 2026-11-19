<script lang="ts">
  import Icon, { type IconName } from './Icon.svelte';

  interface Props {
    icon: IconName;
    /** Describes the action, shown as tooltip and read by screen readers. */
    label: string;
    /**
     * - `ghost`: a subtle button for secondary actions
     * - `primary`: a filled button for the main action, e.g. saving
     * - `danger`: a subtle button for destructive actions, e.g. removing
     */
    variant?: 'ghost' | 'primary' | 'danger';
    onclick: () => void;
  }

  const { icon, label, variant = 'ghost', onclick }: Props = $props();
</script>

<button type="button" class="icon-button {variant}" title={label} aria-label={label} {onclick}
  ><Icon name={icon} /></button
>

<style>
  .icon-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    /* The icon and button size scale with the font size */
    font-size: var(--font-size-base);
    width: 1.75em;
    height: 1.75em;
    margin: 0 var(--space-2xs);
    padding: 0;
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
  }

  .ghost,
  .danger {
    background-color: transparent;
    color: var(--color-text-muted);
  }

  .ghost:hover {
    background-color: var(--color-surface-hover);
    color: var(--color-primary);
  }

  .danger:hover {
    background-color: var(--color-surface-hover);
    color: var(--color-danger);
  }

  .primary {
    background-color: var(--color-primary);
    color: var(--color-on-primary);
  }

  .primary:hover {
    background-color: var(--color-primary-hover);
  }
</style>
