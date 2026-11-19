<script lang="ts">
  import { untrack } from 'svelte';
  import type Module from '#lib/model/module.svelte.ts';
  import IconButton from './IconButton.svelte';
  import GradeInput from './GradeInput.svelte';

  interface Props {
    module: Module;
    onSave: () => void;
    onDiscard: () => void;
  }

  const { module, onSave, onDiscard }: Props = $props();

  // The editor works on a draft that is only written back to the model on save.
  const initial = untrack(() => ({
    name: module.name ?? '',
    credits: module.credits || null,
    isGraded: module.isGraded,
    completed: module.completed,
    grade: module.grade ?? 1.0,
    eliminated: !!module.eliminated,
    weight: module.weight ?? 1,
  }));

  let name = $state(initial.name);
  let credits: number | null = $state(initial.credits);
  let isGraded = $state(initial.isGraded);
  let completed = $state(initial.completed);
  let grade: number | undefined = $state(initial.grade);
  let eliminated = $state(initial.eliminated);
  let weight: number | null = $state(initial.weight);

  const gradeEnabled = $derived(isGraded && completed);

  function save() {
    module.name = name;
    module.credits = credits ?? 0;
    module.weight = weight ?? 1;
    module.isGraded = isGraded;

    if (completed) {
      if (isGraded) {
        module.grade = grade ?? 1.0;
        module.eliminated = eliminated;
        module.passed = undefined;
      } else {
        module.grade = undefined;
        module.eliminated = undefined;
        module.passed = true;
      }
    } else {
      module.passed = undefined;
      module.eliminated = undefined;
      module.grade = undefined;
    }

    onSave();
  }
</script>

<div class="module-edit-container module-container">
  <div class="input-container module-input-container">
    <label class="label name-label module-name-label"
      >Name: <input
        class="input name-input"
        name="name-input"
        type="text"
        size="40"
        placeholder="Module name..."
        bind:value={name}
      /></label
    >
    <label class="label credits-label module-credits-label"
      >Credits: <input
        class="input credits-input"
        name="credits-input"
        type="number"
        step="1"
        min="0"
        placeholder="CP"
        size="2"
        bind:value={credits}
      /></label
    >
    <label class="label is-graded-label module-is-graded-label"
      >Graded: <input
        class="checkbox is-graded-input"
        name="is-graded-input"
        type="checkbox"
        bind:checked={isGraded}
      /></label
    >
    <label class="label has-completed-label module-has-completed-label"
      >Completed: <input
        class="checkbox has-completed-input"
        name="has-completed-input"
        type="checkbox"
        bind:checked={completed}
      /></label
    >
    <label
      class="label grade-selection-label module-grade-selection-label"
      class:disabled={!gradeEnabled}
      >Grade: <GradeInput
        class="selection grade-selection"
        disabled={!gradeEnabled}
        bind:value={grade}
      /></label
    >
    <label
      class="label is-eliminated-label module-is-eliminated-label"
      class:disabled={!gradeEnabled}
      >Eliminated: <input
        class="checkbox is-eliminated-input"
        name="is-eliminated-input"
        type="checkbox"
        disabled={!gradeEnabled}
        bind:checked={eliminated}
      /></label
    >
    <label class="label weight-label module-weight-label"
      >Weight: <input
        class="input credits-input"
        name="credits-input"
        type="number"
        step="0.1"
        min="0"
        placeholder="CP"
        size="3"
        bind:value={weight}
      /></label
    >
  </div>
  <div class="controls-container">
    <IconButton icon="check" variant="primary" label="Save the changes" onclick={save} /><IconButton
      icon="x"
      label="Discard the changes"
      onclick={onDiscard}
    />
  </div>
</div>
