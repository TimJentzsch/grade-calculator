<script lang="ts" module>
  /** Stroke paths of each icon, drawn on a 24x24 grid. */
  const icons = {
    plus: ['M12 5v14', 'M5 12h14'],
    pencil: ['M15.5 4.5l4 4L9 19H5v-4z', 'M13 7l4 4'],
    trash: ['M4 7h16', 'M9 7V4.5h6V7', 'M6 7l1 13h10l1-13', 'M10 11v5', 'M14 11v5'],
    check: ['M5 12.5l4.5 4.5L19 7'],
    x: ['M6 6l12 12', 'M18 6L6 18'],
    ban: ['M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z', 'M5.6 5.6l12.8 12.8'],
    'circle-check': ['M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z', 'M8 12.5l2.5 2.5L16 9.5'],
  } satisfies Record<string, string[]>;

  export type IconName = keyof typeof icons;
</script>

<script lang="ts">
  interface Props {
    name: IconName;
  }

  const { name }: Props = $props();
</script>

<svg
  class="icon"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
>
  {#each icons[name] as d (d)}<path {d} />{/each}
</svg>

<style>
  .icon {
    display: block;
    width: 1.125em;
    height: 1.125em;
  }
</style>
