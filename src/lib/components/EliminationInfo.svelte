<script lang="ts">
  import { getI18n } from '#lib/i18n/index.ts';

  interface Props {
    /** The CSS class prefix, e.g. `curriculum` or `module-area`. */
    kind: string;
    eliminationLimit: number | undefined;
    eliminationCPLimit: number | undefined;
    eliminatedModuleCount: number;
    eliminatedCredits: number;
  }

  const {
    kind,
    eliminationLimit,
    eliminationCPLimit,
    eliminatedModuleCount,
    eliminatedCredits,
  }: Props = $props();

  const i18n = getI18n();
  const t = $derived(i18n.t);

  const noEliminationAllowed = $derived(eliminationLimit === 0 || eliminationCPLimit === 0);

  const invalidCP = $derived(
    !noEliminationAllowed &&
      eliminationCPLimit !== undefined &&
      !!eliminatedCredits &&
      eliminatedCredits > eliminationCPLimit,
  );

  const invalidCount = $derived(
    !noEliminationAllowed &&
      eliminationLimit !== undefined &&
      !!eliminatedModuleCount &&
      eliminatedModuleCount > eliminationLimit,
  );

  // The noun refers to the last number shown, e.g. "0/1 module" or "2 modules"
  const moduleNoun = $derived(t.elimination.modules(eliminationLimit || eliminatedModuleCount));
</script>

<!-- Like the credit limits, the elimination is only shown if it exceeds the limits -->
{#if noEliminationAllowed && eliminatedModuleCount > 0}
  <div class="{kind}-elimination elimination-container invalid-elimination">
    <span class="elimination-description">{t.elimination.noneAllowed}</span>
  </div>
{:else if invalidCP || invalidCount}
  <div class="{kind}-elimination elimination-container invalid-elimination">
    <span class="elimination-description">{t.elimination.label}</span>{#if invalidCP}<span
        class="elimination-cp-container"
        ><span class="elimination-cp">{eliminatedCredits}</span><span class="elimination-cp-limit"
          >{`/${eliminationCPLimit}`}</span
        ><span class="elimination-cp-description">{' CP'}</span></span
      >{/if}{#if invalidCP && invalidCount}<span class="elimination-seperator">{', '}</span
      >{/if}{#if invalidCount}<span class="elimination-count-container"
        ><span class="elimination-count">{eliminatedModuleCount}</span><span
          class="elimination-count-limit">{`/${eliminationLimit}`}</span
        ><span class="elimination-count-description">{` ${moduleNoun}`}</span></span
      >{/if}
  </div>
{/if}
