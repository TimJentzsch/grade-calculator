<script lang="ts">
  import { untrack } from 'svelte';
  import type Curriculum from '#lib/model/curriculum.svelte.ts';
  import type ModuleArea from '#lib/model/module-area.svelte.ts';
  import ControlButton from './ControlButton.svelte';

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
  }));

  let name = $state(initial.name);
  let countLimited = $state(initial.countLimited);
  let count: number | null = $state(initial.count);
  let cpLimited = $state(initial.cpLimited);
  let cp: number | null = $state(initial.cp);

  function save() {
    area.name = name;
    area.eliminationLimit = countLimited ? (count ?? 0) : undefined;
    area.eliminationCPLimit = cpLimited ? (cp ?? 0) : undefined;
    onSave();
  }
</script>

<div class="{kind}-edit-header edit-header">
  <div class="input-container">
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
      Elimination: <label class="elimination-count-label"
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
      ><label class="elimination-cp-label"
        >{' Limited credits: '}<input
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
  </div>
  <div class="controls-container">
    <ControlButton variant="save" title="Save the changes" onclick={save} /><ControlButton
      variant="discard"
      title="Discard the changes"
      onclick={onDiscard}
    />
  </div>
</div>
