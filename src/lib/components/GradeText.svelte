<script lang="ts">
  import { getI18n } from '#lib/i18n/index.ts';

  interface Props {
    /** The formatted grade, e.g. `1.59`, `B` or `TBD`. */
    text: string;
  }

  const { text }: Props = $props();

  const i18n = getI18n();
  const t = $derived(i18n.t);

  /**
   * For a grade with two decimal places, the part that counts (e.g. `1.5`)
   * and the second decimal place, which is cut off (e.g. `9`).
   */
  const parts = $derived(/^\d\.\d\d$/.test(text) ? [text.slice(0, 3), text.slice(3)] : undefined);
</script>

{#if parts}{parts[0]}<span class="truncated-digits">{parts[1]}</span>{:else if text === 'TBD'}{t
    .grade.tbd}{:else}{text}{/if}
