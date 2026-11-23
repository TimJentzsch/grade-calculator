<script lang="ts">
  import { formatGrade } from '#lib/grade.ts';
  import { getI18n } from '#lib/i18n/index.ts';
  import type Curriculum from '#lib/model/curriculum.svelte.ts';
  import type ModuleArea from '#lib/model/module-area.svelte.ts';
  import IconButton from './IconButton.svelte';
  import EliminationInfo from './EliminationInfo.svelte';
  import GradeText from './GradeText.svelte';

  interface Props {
    kind: 'curriculum' | 'module-area';
    area: Curriculum | ModuleArea;
    /** Adds a module, only for areas whose modules are chosen by the student. */
    onAdd?: () => void;
  }

  const { kind, area, onAdd }: Props = $props();

  const i18n = getI18n();
  const t = $derived(i18n.t);

  /**
   * A limit of the possible grade range, e.g. `1.4`.
   * Only shows the first decimal place like the final grade, as the user can't change the range.
   */
  function formatLimit(limit: Curriculum | ModuleArea): string {
    const grade = limit.eliminationGrade;
    return grade === undefined ? limit.eliminationGradeText : formatGrade(grade);
  }

  const gradeLimits = $derived.by(() => {
    const bestGrade = formatLimit(area.bestCase());
    const worstGrade = formatLimit(area.worstCase());

    // Once the grade can't change anymore, the range isn't needed
    if (bestGrade === worstGrade) {
      return '';
    }
    return `(${bestGrade}-${worstGrade})`;
  });

  const gradeTitle = $derived(
    kind === 'curriculum' ? t.area.finalGradeTitle : t.area.areaGradeTitle,
  );

  const creditsTitle = $derived.by(() => {
    const title = t.area.creditsTitle(kind);
    if (area.belowMinCredits) {
      const min = area.minCredits as number;
      return title + t.area.belowMinCredits(min, min - area.credits);
    }
    if (area.aboveMaxCredits) {
      const max = area.maxCredits as number;
      return title + t.area.aboveMaxCredits(max, area.credits - max);
    }
    return title;
  });

  const gradeBeforeElimination = $derived(
    area.gradeText !== area.eliminationGradeText ? area.gradeText : '',
  );
</script>

<div
  class="header row"
  class:curriculum-header={kind === 'curriculum'}
  class:module-area-display-header={kind === 'module-area'}
>
  <div class="{kind}-title row-title">
    {#if kind === 'curriculum'}
      <h2 class="curriculum-name">{area.name ?? ''}</h2>
    {:else}
      <h3 class="module-area-name">{area.name ?? ''}</h3>
    {/if}
    <EliminationInfo
      {kind}
      eliminationLimit={area.eliminationLimit}
      eliminationCPLimit={area.eliminationCPLimit}
      eliminatedModuleCount={area.eliminatedModuleCount}
      eliminatedCredits={area.eliminatedCredits}
    />
  </div>
  <div class="row-details">
    <div class="{kind}-grade-container grade-container">
      <span
        class="{kind}-eliminated-grade-value grade eliminated"
        title={t.area.gradeBeforeEliminationTitle}
        >{#if gradeBeforeElimination}<GradeText text={gradeBeforeElimination} />{/if}</span
      ><span class="{kind}-grade-value grade-value grade" title={gradeTitle}
        ><GradeText text={area.eliminationGradeText} /></span
      ><span class="{kind}-grade-limits grade-limits grade" title={t.area.gradeLimitsTitle(kind)}
        >{gradeLimits}</span
      >
    </div>
    <div
      class={[
        'credits-container',
        `${kind}-credits-container`,
        { 'credits-warning': area.belowMinCredits || area.aboveMaxCredits },
      ]}
      title={creditsTitle}
    >
      <span class="{kind}-credits-value">{area.credits}</span><span
        class="{kind}-credits-description">{' CP'}</span
      >{#if area.belowMinCredits}<span class="credit-limit min-credits"
          >{` < ${area.minCredits} CP`}</span
        >{:else if area.aboveMaxCredits}<span class="credit-limit max-credits"
          >{` > ${area.maxCredits} CP`}</span
        >{/if}
    </div>
  </div>
  <div class="row-controls">
    {#if onAdd}<IconButton icon="plus" label={t.area.add(kind)} onclick={onAdd} />{/if}
  </div>
</div>

<style>
  /* The credits are below the minimum or above the maximum */
  .credits-warning {
    color: var(--color-warning);
  }
</style>
