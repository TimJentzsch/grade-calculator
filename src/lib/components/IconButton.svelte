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
    /**
     * Makes the button a toggle, which is highlighted while pressed.
     * The label should describe the action and stay the same in both states.
     */
    pressed?: boolean;
    disabled?: boolean;
    onclick: () => void;
  }

  const { icon, label, variant = 'ghost', pressed, disabled = false, onclick }: Props = $props();
</script>

<button
  type="button"
  class="icon-button {variant}"
  title={label}
  aria-label={label}
  aria-pressed={pressed}
  {disabled}
  {onclick}><Icon name={icon} /></button
>

<style>
  .icon-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    font-size: var(--font-size-base);
    width: var(--icon-button-size);
    height: var(--icon-button-size);
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

  .primary,
  [aria-pressed='true'] {
    background-color: var(--color-primary);
    color: var(--color-on-primary);
  }

  .icon-button:disabled {
    cursor: default;
    opacity: 0.6;
  }

  /* Only on devices with a mouse, touch devices would keep the hover effect after tapping */
  @media (hover: hover) {
    .ghost:enabled:hover {
      background-color: var(--color-surface-hover);
      color: var(--color-primary);
    }

    .danger:enabled:hover {
      background-color: var(--color-surface-hover);
      color: var(--color-danger);
    }

    .primary:enabled:hover,
    [aria-pressed='true']:enabled:hover {
      background-color: var(--color-primary-hover);
      color: var(--color-on-primary);
    }
  }
</style>
