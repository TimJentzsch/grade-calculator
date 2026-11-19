<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    children: Snippet;
    /** Describes the action in more detail, shown as tooltip. */
    title?: string;
    onclick?: () => void;
    disabled?: boolean;
    /** Renders the button as a link, e.g. to download a file. */
    href?: string;
    /** The file name to download the link target as. */
    download?: string;
    /**
     * - `primary`: a filled button for the main action
     * - `secondary`: a subtle button for other actions
     */
    variant?: 'primary' | 'secondary';
  }

  const {
    children,
    title,
    onclick,
    disabled = false,
    href,
    download,
    variant = 'primary',
  }: Props = $props();
</script>

{#if href !== undefined}
  <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- Used for downloads, not routes -->
  <a class="button {variant}" {href} {download} {title}>{@render children()}</a>
{:else}
  <button type="button" class="button {variant}" {title} {onclick} {disabled}
    >{@render children()}</button
  >
{/if}

<style>
  .button {
    display: inline-block;
    vertical-align: middle;
    padding: var(--space-xs) var(--space-sm);
    border: 1px solid transparent;
    border-radius: var(--radius-sm);
    box-shadow: var(--shadow-raised);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    line-height: var(--line-height-tight);
    text-decoration: none;
    cursor: pointer;
  }

  .button:hover {
    box-shadow: var(--shadow-hover);
  }

  .primary {
    background-color: var(--color-primary);
    color: var(--color-on-primary);
  }

  .primary:hover {
    background-color: var(--color-primary-hover);
  }

  .secondary {
    background-color: var(--color-surface-raised);
    border-color: var(--color-border);
    color: var(--color-text);
  }

  .secondary:hover {
    background-color: var(--color-surface-hover);
  }

  .button:disabled,
  .button:disabled:hover {
    cursor: default;
    background-color: var(--color-surface-hover);
    color: var(--color-text-disabled);
    box-shadow: none;
  }
</style>
