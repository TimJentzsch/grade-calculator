<script lang="ts">
  import type Module from '#lib/model/module.svelte.ts';
  import IconButton from './IconButton.svelte';
  import GradeInput from './GradeInput.svelte';

  interface Props {
    module: Module;
    onEdit: () => void;
    onRemove: () => void;
  }

  const { module, onEdit, onRemove }: Props = $props();
</script>

<div class="module-display-container module-container row">
  <span class="module-title row-title" class:eliminated={module.isGraded && module.eliminated}
    >{module.name}</span
  >
  <div class="row-details">
    {#if module.weight !== 1}
      <span class="module-weight-value weight-value" title="The weighting of this module"
        >&#xd7;&#xFE0E;{module.weight.toFixed(1)}</span
      >
    {/if}
    <div class="module-grade-container grade-container">
      {#if module.isGraded}
        <label class="label is-eliminated-label module-is-eliminated-label"
          >Eliminated: <input
            class="checkbox is-eliminated-input"
            name="is-eliminated-input"
            type="checkbox"
            checked={!!module.eliminated}
            onchange={(event) => (module.eliminated = event.currentTarget.checked)}
          /></label
        ><GradeInput
          class="selection grade-selection module-grade-selection"
          allowTBD
          bind:value={module.grade}
        />
      {:else}
        <label class="label has-passed-label module-has-passed-label"
          >Passed: <input
            class="checkbox has-passed-input"
            name="has-passed-input"
            type="checkbox"
            checked={!!module.passed}
            onchange={(event) => (module.passed = event.currentTarget.checked)}
          /></label
        >
      {/if}
    </div>
    <div
      class="module-credits-container credits-container"
      title="The credit points of this module"
    >
      <span class="module-credits-value">{module.credits}</span><span
        class="module-credits-description">{' CP'}</span
      >
    </div>
  </div>
  <div class="row-controls">
    <IconButton icon="pencil" label="Edit this module" onclick={onEdit} /><IconButton
      icon="trash"
      variant="danger"
      label="Remove this module"
      onclick={onRemove}
    />
  </div>
</div>
