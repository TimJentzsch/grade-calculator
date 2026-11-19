<script lang="ts">
  import { untrack } from 'svelte';
  import Icon from './Icon.svelte';

  interface Props {
    value: string | undefined;
    /** What is edited, e.g. "module name". Used for screen readers. */
    label: string;
    /** Shown if the value is empty. */
    placeholder?: string;
    /** Whether to start in the edit mode, e.g. for a newly added item. */
    startEditing?: boolean;
    /** Called when the edit mode is left, after the value has been saved. */
    onDone?: () => void;
    class?: string;
  }

  let {
    value = $bindable(),
    label,
    placeholder = '',
    startEditing: initiallyEditing = false,
    onDone,
    class: className,
  }: Props = $props();

  let editing = $state(untrack(() => initiallyEditing));
  let draft = $state(untrack(() => (initiallyEditing ? (value ?? '') : '')));
  /** Whether the text should get the focus once the input is gone. */
  let restoreFocus = false;

  function startEditing() {
    draft = value ?? '';
    editing = true;
  }

  /**
   * Leaves the edit mode.
   * Focus only returns to the text when editing was ended with the keyboard,
   * so that clicking somewhere else doesn't move the focus back.
   */
  function stopEditing(save: boolean, refocus: boolean) {
    if (!editing) {
      return;
    }
    if (save && draft.trim() !== '') {
      value = draft.trim();
    }
    restoreFocus = refocus;
    editing = false;
    onDone?.();
  }

  function focusInput(input: HTMLInputElement) {
    input.focus();
    input.select();
  }

  function focusText(button: HTMLButtonElement) {
    if (restoreFocus) {
      restoreFocus = false;
      button.focus();
    }
  }

  function onkeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      stopEditing(true, true);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      stopEditing(false, true);
    }
  }
</script>

{#if editing}
  <input
    {@attach focusInput}
    class={['editable-text-input', className]}
    type="text"
    aria-label={label}
    bind:value={draft}
    {onkeydown}
    onblur={() => stopEditing(true, false)}
  />
{:else}
  <button
    {@attach focusText}
    type="button"
    class={['editable-text', className, { empty: !value }]}
    onclick={startEditing}
    >{value || placeholder}<span class="visually-hidden">, edit {label}</span><span
      class="edit-hint"><Icon name="pencil" /></span
    ></button
  >
{/if}

<style>
  .editable-text,
  .editable-text-input {
    /* Looks like the surrounding text */
    font: inherit;
    color: inherit;
    /* Not inherited by default, e.g. needed to cross out eliminated modules */
    text-decoration: inherit;
    text-align: left;
    /* Fills the available space, so the whole area can be clicked */
    box-sizing: border-box;
    width: calc(100% + 2 * var(--space-xs));
    margin: calc(-1 * var(--space-2xs)) calc(-1 * var(--space-xs));
    padding: var(--space-2xs) var(--space-xs);
    border: 1px solid transparent;
    border-radius: var(--radius-sm);
  }

  .editable-text {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
    background: none;
    cursor: text;
    overflow-wrap: anywhere;
  }

  .editable-text:hover {
    background-color: var(--color-surface-hover);
  }

  .empty {
    color: var(--color-text-muted);
  }

  /* A pencil icon, shown on hover or focus to indicate that the text can be edited */
  .edit-hint {
    flex-shrink: 0;
    color: var(--color-text-muted);
    font-size: var(--font-size-sm);
    opacity: 0;
  }

  .editable-text:hover .edit-hint,
  .editable-text:focus-visible .edit-hint {
    opacity: 1;
  }

  .editable-text-input {
    background-color: var(--color-input-background);
    border-color: var(--color-border-strong);
  }
</style>
