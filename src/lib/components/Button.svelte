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
  }

  const { children, title, onclick, disabled = false, href, download }: Props = $props();
</script>

{#if href !== undefined}
  <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- Used for downloads, not routes -->
  <a class="button" {href} {download} {title}>{@render children()}</a>
{:else}
  <button type="button" class="button" {title} {onclick} {disabled}>{@render children()}</button>
{/if}

<style>
  .button {
    display: inline-block;
    vertical-align: middle;
    margin: var(--space-2xs);
    padding: var(--space-xs) var(--space-sm);
    border: none;
    border-radius: var(--radius-sm);
    background-color: var(--color-primary);
    color: var(--color-on-primary);
    box-shadow: var(--shadow-raised);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    line-height: var(--line-height-tight);
    text-decoration: none;
    cursor: pointer;
  }

  .button:hover {
    background-color: var(--color-primary-hover);
    box-shadow: var(--shadow-hover);
  }

  .button:disabled {
    cursor: default;
    background-color: var(--color-surface-hover);
    color: var(--color-text-disabled);
    box-shadow: none;
  }
</style>
