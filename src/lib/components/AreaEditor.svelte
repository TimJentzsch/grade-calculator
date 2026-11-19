<script lang="ts">
  import { untrack } from 'svelte';
  import type Curriculum from '#lib/model/curriculum.svelte.ts';
  import type ModuleArea from '#lib/model/module-area.svelte.ts';
  import IconButton from './IconButton.svelte';

  interface Props {
    kind: 'curriculum' | 'module-area';
    area: Curriculum | ModuleArea;
    onSave: () => void;
    onDiscard: () => void;
  }

  const { kind, area, onSave, onDiscard }: Props = $props();

  // The editor works on a draft that is only written back to the model on save.
  const initial = untrack(() => ({
    name: area.name ?? '',
    countLimited: area.eliminationLimit !== undefined,
    count: area.eliminationLimit ?? 0,
    cpLimited: area.eliminationCPLimit !== undefined,
    cp: area.eliminationCPLimit ?? 0,
    creditsRequired: area.requiredCredits !== undefined,
    requiredCredits: area.requiredCredits ?? 0,
  }));

  let name = $state(initial.name);
  let countLimited = $state(initial.countLimited);
  let count: number | null = $state(initial.count);
  let cpLimited = $state(initial.cpLimited);
  let cp: number | null = $state(initial.cp);
  let creditsRequired = $state(initial.creditsRequired);
  let requiredCredits: number | null = $state(initial.requiredCredits);

  function save() {
    area.name = name;
    area.eliminationLimit = countLimited ? (count ?? 0) : undefined;
    area.eliminationCPLimit = cpLimited ? (cp ?? 0) : undefined;
    area.requiredCredits = creditsRequired ? (requiredCredits ?? 0) : undefined;
    onSave();
  }
</script>

<div class="{kind}-edit-header edit-header editor-row">
  <div class="editor-fields">
    <label class="label name-label"
      >Name: <input
        class="input name-input"
        name="name-input"
        type="text"
        size="40"
        placeholder={kind === 'curriculum' ? 'Curriculum name...' : 'Module area name...'}
        bind:value={name}
      /></label
    >
    <div class="elimination-input-container">
      Elimination: <label class="label elimination-count-label"
        >Limited count: <input
          class="checkbox elimination-count-checkbox"
          name="elimination-count-checkbox"
          type="checkbox"
          bind:checked={countLimited}
        /><input
          class="input elimination-count-input"
          name="elimination-count-input"
          type="number"
          step="1"
          min="0"
          placeholder="0"
          size="2"
          disabled={!countLimited}
          bind:value={count}
        /></label
      ><label class="label elimination-cp-label"
        >Limited credits: <input
          class="checkbox elimination-cp-checkbox"
          name="elimination-cp-checkbox"
          type="checkbox"
          bind:checked={cpLimited}
        /><input
          class="input elimination-cp-input"
          name="elimination-cp-input"
          type="number"
          step="1"
          min="0"
          placeholder="0"
          size="2"
          disabled={!cpLimited}
          bind:value={cp}
        /></label
      >
    </div>
    <label
      class="label required-credits-label"
      title="The credits that have to be reached. Missing credits count towards the possible grade range."
      >Required credits: <input
        class="checkbox required-credits-checkbox"
        name="required-credits-checkbox"
        type="checkbox"
        bind:checked={creditsRequired}
      /><input
        class="input required-credits-input"
        name="required-credits-input"
        type="number"
        step="1"
        min="0"
        placeholder="0"
        size="3"
        disabled={!creditsRequired}
        bind:value={requiredCredits}
      /></label
    >
  </div>
  <div class="editor-controls">
    <IconButton icon="check" variant="primary" label="Save the changes" onclick={save} /><IconButton
      icon="x"
      label="Discard the changes"
      onclick={onDiscard}
    />
  </div>
</div>
