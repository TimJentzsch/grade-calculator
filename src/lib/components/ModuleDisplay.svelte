<script lang="ts">
  import { parseCredits } from '#lib/credits.ts';
  import type Module from '#lib/model/module.svelte.ts';
  import { formatWeight, parseWeight } from '#lib/weight.ts';
  import EditableText from './EditableText.svelte';
  import GradeInput from './GradeInput.svelte';
  import IconButton from './IconButton.svelte';
  import NumberInput from './NumberInput.svelte';

  interface Props {
    module: Module;
    /** Whether the module was just added, which starts editing its name. */
    isNew?: boolean;
    onRemove: () => void;
  }

  const { module, isNew = false, onRemove }: Props = $props();

  /** The module name for the labels of the controls. */
  const name = $derived(module.name || 'this module');

  /** A new module is removed again if no name was entered. */
  function onNameDone() {
    if (isNew && module.isEmpty) {
      onRemove();
    }
  }
</script>

<div
  class={['module-display-container module-container row', { additional: module.additional }]}
  title={module.additional
    ? 'An additional module (Zusatzleistung), which counts towards neither the credits nor the grade'
    : undefined}
>
  <div class={['module-title row-title', { eliminated: module.isGraded && module.eliminated }]}>
    <EditableText
      bind:value={module.name}
      label="module name"
      placeholder="Unnamed module"
      startEditing={isNew}
      onDone={onNameDone}
    />
  </div>
  <div class="row-details">
    <!-- A weight of 1 is only shown on hover, but can still be edited -->
    <span class={['weight-value', { 'default-weight': module.weight === 1 }]}
      ><span aria-hidden="true">&#xd7;&#xFE0E;</span><NumberInput
        class="inline-input weight-input"
        label="Weight of {name}"
        hint="Enter the weighting of this module, e.g. 2.0 to count it twice or 0.0 to not count it"
        parse={parseWeight}
        format={formatWeight}
        bind:value={module.weight}
      /></span
    >
    <div class={['module-grade-container grade-container', { ungraded: !module.isGraded }]}>
      {#if module.isGraded}
        <!-- Without a grade, the module can't be part of the grade, so it stays eliminated -->
        <!-- Additional modules don't count towards the grade, so they can't be eliminated -->
        <IconButton
          icon="ban"
          label={module.gradeUnknown
            ? `${name} stays eliminated, because its grade is unknown. Enter the grade to change this.`
            : module.additional
              ? `${name} can't be eliminated, because it is an additional module`
              : `Eliminate ${name}`}
          pressed={!!module.eliminated}
          disabled={module.gradeUnknown || !!module.additional}
          onclick={() => (module.eliminated = !module.eliminated)}
        />
        <GradeInput
          class="inline-input"
          label="Grade of {name}"
          allowTBD
          placeholder={module.gradeUnknown ? 'B' : undefined}
          bind:value={module.grade}
        />
      {:else}
        <IconButton
          icon="circle-check"
          label="Mark {name} as passed"
          pressed={!!module.passed}
          onclick={() => (module.passed = !module.passed)}
        />
      {/if}
    </div>
    <div class="module-credits-container credits-container">
      <NumberInput
        class="inline-input credit-points-input module-credits-value"
        label="Credit points of {name}"
        hint="Enter the credit points"
        parse={parseCredits}
        bind:value={module.credits}
      /><span class="module-credits-description" aria-hidden="true">CP</span>
    </div>
  </div>
  <div class="row-controls">
    <IconButton
      icon="circle-plus"
      label="Mark {name} as an additional module (Zusatzleistung), which doesn't count towards the credits or the grade"
      pressed={!!module.additional}
      onclick={() => module.setAdditional(!module.additional)}
    />
    <!-- Ungraded modules are the exception, so the toggle is only highlighted for them -->
    <IconButton
      icon="pass-fail"
      label="Only pass or fail {name}, without a grade"
      pressed={!module.isGraded}
      onclick={() => module.setGraded(!module.isGraded)}
    />
    <IconButton icon="trash" variant="danger" label="Remove {name}" onclick={onRemove} />
  </div>
</div>

<style>
  /* Additional modules don't count, so they are shown muted */
  .additional {
    color: var(--color-text-muted);
    font-style: italic;
  }

  .additional :global(input) {
    color: inherit;
    font-style: inherit;
  }
</style>
