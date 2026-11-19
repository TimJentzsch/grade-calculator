<script lang="ts">
  import type Module from '#lib/model/module.svelte.ts';
  import CreditsInput from './CreditsInput.svelte';
  import EditableText from './EditableText.svelte';
  import IconButton from './IconButton.svelte';
  import GradeInput from './GradeInput.svelte';

  interface Props {
    module: Module;
    onEdit: () => void;
    onRemove: () => void;
  }

  const { module, onEdit, onRemove }: Props = $props();

  /** The module name for the labels of the controls. */
  const name = $derived(module.name || 'this module');
</script>

<div class="module-display-container module-container row">
  <div class="module-title row-title" class:eliminated={module.isGraded && module.eliminated}>
    <EditableText bind:value={module.name} label="module name" placeholder="Unnamed module" />
  </div>
  <div class="row-details">
    {#if module.weight !== 1}
      <span class="module-weight-value weight-value" title="The weighting of this module"
        >&#xd7;&#xFE0E;{module.weight.toFixed(1)}</span
      >
    {/if}
    <div class="module-grade-container grade-container">
      {#if module.isGraded}
        <IconButton
          icon="ban"
          label="Eliminate {name}"
          pressed={!!module.eliminated}
          onclick={() => (module.eliminated = !module.eliminated)}
        />
        <GradeInput
          class="inline-input module-grade-selection"
          label="Grade of {name}"
          allowTBD
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
      <CreditsInput
        class="inline-input module-credits-value"
        label="Credit points of {name}"
        bind:value={module.credits}
      /><span class="module-credits-description" aria-hidden="true">{' CP'}</span>
    </div>
  </div>
  <div class="row-controls">
    <IconButton icon="pencil" label="Edit all properties of {name}" onclick={onEdit} />
    <IconButton icon="trash" variant="danger" label="Remove {name}" onclick={onRemove} />
  </div>
</div>
