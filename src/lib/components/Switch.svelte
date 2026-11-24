<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    children: Snippet;
    checked: boolean;
    /** The id of an element that describes the switch. */
    describedby?: string;
  }

  let { children, checked = $bindable(), describedby }: Props = $props();
</script>

<!-- A checkbox shown as an on/off switch -->
<label class="switch"
  ><input type="checkbox" role="switch" aria-describedby={describedby} bind:checked /><span
    class="track"
    aria-hidden="true"><span class="thumb"></span></span
  >{@render children()}</label
>

<style>
  .switch {
    display: inline-flex;
    align-items: center;
    gap: var(--space-sm);
    /* The same height as the buttons next to it */
    padding: var(--space-xs) 0;
    border: 1px solid transparent;
    color: var(--color-text);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    line-height: var(--line-height-tight);
    cursor: pointer;
    user-select: none;
  }

  /* The checkbox stays focusable and readable by screen readers, the track is shown instead */
  input {
    position: absolute;
    opacity: 0;
    width: 1px;
    height: 1px;
    margin: 0;
  }

  .track {
    position: relative;
    flex: none;
    width: 1.75em;
    height: 1em;
    border-radius: var(--radius-full);
    background-color: var(--color-border-strong);
    transition: background-color 0.15s;
  }

  .thumb {
    position: absolute;
    top: 0.125em;
    left: 0.125em;
    width: 0.75em;
    height: 0.75em;
    border-radius: var(--radius-full);
    background-color: var(--color-surface);
    transition: transform 0.15s;
  }

  input:checked + .track {
    background-color: var(--color-primary);
  }

  input:checked + .track .thumb {
    transform: translateX(0.75em);
  }

  input:focus-visible + .track {
    outline: 2px solid var(--color-focus-ring);
    outline-offset: 2px;
  }

  @media (hover: hover) {
    .switch:hover input:not(:checked) + .track {
      background-color: var(--color-text-muted);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .track,
    .thumb {
      transition: none;
    }
  }
</style>
