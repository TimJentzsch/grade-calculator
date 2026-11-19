<script lang="ts">
  import { formatGrade } from '#lib/grade.ts';
  import type Curriculum from '#lib/model/curriculum.svelte.ts';
  import type ModuleArea from '#lib/model/module-area.svelte.ts';
  import IconButton from './IconButton.svelte';
  import EliminationInfo from './EliminationInfo.svelte';
  import GradeText from './GradeText.svelte';

  interface Props {
    kind: 'curriculum' | 'module-area';
    area: Curriculum | ModuleArea;
    onAdd: () => void;
    onEdit: () => void;
    /** Only module areas can be removed. */
    onRemove?: () => void;
  }

  const { kind, area, onAdd, onEdit, onRemove }: Props = $props();

  const label = $derived(kind === 'curriculum' ? 'curriculum' : 'module area');

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
    kind === 'curriculum'
      ? 'The final grade. Only the first decimal place counts, the gray digit is cut off.'
      : 'The average grade of this module area',
  );

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
        title="The grade before elimination">{gradeBeforeElimination}</span
      ><span class="{kind}-grade-value grade-value grade" title={gradeTitle}
        ><GradeText text={area.eliminationGradeText} /></span
      ><span
        class="{kind}-grade-limits grade-limits grade"
        title="The best/worst possible grade in this {label}">{gradeLimits}</span
      >
    </div>
    <div
      class="{kind}-credits-container credits-container"
      title="The total credit points of this {label}"
    >
      <span class="{kind}-credits-value">{area.credits}</span><span
        class="{kind}-credits-description">{' CP'}</span
      >
    </div>
  </div>
  <div class="row-controls">
    <IconButton
      icon="plus"
      label={kind === 'curriculum' ? 'Add a new module area' : 'Add a new module'}
      onclick={onAdd}
    /><IconButton
      icon="pencil"
      label="Edit this {label}"
      onclick={onEdit}
    />{#if onRemove}<IconButton
        icon="trash"
        variant="danger"
        label="Remove this {label}"
        onclick={onRemove}
      />{/if}
  </div>
</div>
