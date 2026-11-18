<script lang="ts">
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
</script>

<div class="{kind}-elimination elimination-container">
  {#if noEliminationAllowed}
    <span class="elimination-description" class:invalid-elimination={eliminatedModuleCount > 0}
      >No elimination allowed</span
    >
  {:else}
    <span class="elimination-description">{'Elimination: '}</span><span
      class="elimination-cp-container"
      class:invalid-elimination={invalidCP}
      ><span class="elimination-cp">{eliminatedCredits}</span><span class="elimination-cp-limit"
        >{eliminationCPLimit ? `/${eliminationCPLimit}` : ''}</span
      ><span class="elimination-cp-description">{' CP'}</span></span
    ><span class="elimination-seperator">{', '}</span><span
      class="elimination-count-container"
      class:invalid-elimination={invalidCount}
      ><span class="elimination-count">{eliminatedModuleCount}</span><span
        class="elimination-count-limit">{eliminationLimit ? `/${eliminationLimit}` : ''}</span
      ><span class="elimination-count-description">{' modules'}</span></span
    >
  {/if}
</div>
