<script lang="ts">
  import { parseCredits } from '#lib/credits.ts';
  import { getI18n } from '#lib/i18n/index.ts';
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

  const i18n = getI18n();
  const t = $derived(i18n.t);

  /** The module name for the labels of the controls, if it has one. */
  const name = $derived(module.name || undefined);

  /** A new module is removed again if no name was entered. */
  function onNameDone() {
    if (isNew && module.isEmpty) {
      onRemove();
    }
  }
</script>

<div
  class={['module-display-container module-container row', { additional: module.additional }]}
  title={module.additional ? t.module.additionalTitle : undefined}
>
  <div class={['module-title row-title', { eliminated: module.isGraded && module.eliminated }]}>
    <EditableText
      bind:value={module.name}
      label={t.module.nameLabel}
      placeholder={t.module.unnamed}
      startEditing={isNew}
      onDone={onNameDone}
    />
  </div>
  <div class="row-details">
    <!-- A weight of 1 is only shown on hover, but can still be edited -->
    <span class={['weight-value', { 'default-weight': module.weight === 1 }]}
      ><span aria-hidden="true">&#xd7;&#xFE0E;</span><NumberInput
        class="inline-input weight-input"
        label={t.module.weightLabel(name)}
        hint={t.module.weightHint}
        parse={parseWeight}
        format={formatWeight}
        bind:value={module.weight}
      /></span
    >
    <div
      class={[
        'module-grade-container grade-container',
        { ungraded: !module.isGraded, 'no-elimination': module.additional },
      ]}
    >
      {#if module.isGraded}
        <!-- Without a grade, the module can't be part of the grade, so it stays eliminated -->
        <!-- Additional modules don't count towards the grade, so they can't be eliminated -->
        {#if !module.additional}
          <!-- Only shown on hover or while eliminated, see app.css -->
          <span class={['elimination-toggle', { active: module.eliminated }]}
            ><IconButton
              icon="ban"
              label={module.gradeUnknown
                ? t.module.staysEliminated(name)
                : t.module.eliminate(name)}
              pressed={!!module.eliminated}
              disabled={module.gradeUnknown}
              onclick={() => (module.eliminated = !module.eliminated)}
            /></span
          >
        {/if}
        <GradeInput
          class="inline-input"
          label={t.module.gradeLabel(name)}
          allowTBD
          placeholder={module.gradeUnknown ? 'B' : undefined}
          bind:value={module.grade}
        />
      {:else}
        <IconButton
          icon="circle-check"
          label={t.module.markPassed(name)}
          pressed={!!module.passed}
          onclick={() => (module.passed = !module.passed)}
        />
      {/if}
    </div>
    <div class="module-credits-container credits-container">
      <NumberInput
        class="inline-input credit-points-input module-credits-value"
        label={t.module.creditsLabel(name)}
        hint={t.module.creditsHint}
        parse={parseCredits}
        bind:value={module.credits}
      /><span class="module-credits-description" aria-hidden="true">CP</span>
    </div>
  </div>
  <div class="row-controls">
    <!-- Stays visible without hover for additional modules, see app.css -->
    <span class="additional-toggle"
      ><IconButton
        icon="sparkles"
        label={t.module.markAdditional(name)}
        pressed={!!module.additional}
        onclick={() => module.setAdditional(!module.additional)}
      /></span
    >
    <!-- Ungraded modules are the exception, so the toggle is only highlighted for them -->
    <IconButton
      icon="pass-fail"
      label={t.module.passFail(name)}
      pressed={!module.isGraded}
      onclick={() => module.setGraded(!module.isGraded)}
    />
    <IconButton icon="trash" variant="danger" label={t.module.remove(name)} onclick={onRemove} />
  </div>
</div>

<style>
  /* Additional modules don't count, so they are shown muted */
  .additional {
    color: var(--color-text-muted);
    font-style: italic;
  }

  /* Without the elimination toggle, the grade stays in its column */
  .no-elimination > :global(*) {
    grid-column: 2;
  }

  .additional-toggle,
  .elimination-toggle {
    display: inline-flex;
  }

  .additional :global(input) {
    color: inherit;
    font-style: inherit;
  }
</style>
