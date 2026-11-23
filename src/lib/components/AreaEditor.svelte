<script lang="ts">
  import { untrack } from 'svelte';
  import type Curriculum from '#lib/model/curriculum.svelte.ts';
  import type ModuleArea from '#lib/model/module-area.svelte.ts';
  import { getI18n } from '#lib/i18n/index.ts';
  import IconButton from './IconButton.svelte';

  interface Props {
    kind: 'curriculum' | 'module-area';
    area: Curriculum | ModuleArea;
    onSave: () => void;
    onDiscard: () => void;
  }

  const { kind, area, onSave, onDiscard }: Props = $props();

  const i18n = getI18n();
  const t = $derived(i18n.t);

  // The editor works on a draft that is only written back to the model on save.
  const initial = untrack(() => ({
    name: area.name ?? '',
    countLimited: area.eliminationLimit !== undefined,
    count: area.eliminationLimit ?? 0,
    cpLimited: area.eliminationCPLimit !== undefined,
    cp: area.eliminationCPLimit ?? 0,
    minLimited: area.minCredits !== undefined,
    minCredits: area.minCredits ?? 0,
    maxLimited: area.maxCredits !== undefined,
    maxCredits: area.maxCredits ?? 0,
  }));

  let name = $state(initial.name);
  let countLimited = $state(initial.countLimited);
  let count: number | null = $state(initial.count);
  let cpLimited = $state(initial.cpLimited);
  let cp: number | null = $state(initial.cp);
  let minLimited = $state(initial.minLimited);
  let minCredits: number | null = $state(initial.minCredits);
  let maxLimited = $state(initial.maxLimited);
  let maxCredits: number | null = $state(initial.maxCredits);

  function save() {
    area.name = name;
    area.eliminationLimit = countLimited ? (count ?? 0) : undefined;
    area.eliminationCPLimit = cpLimited ? (cp ?? 0) : undefined;
    area.minCredits = minLimited ? (minCredits ?? 0) : undefined;
    area.maxCredits = maxLimited ? (maxCredits ?? 0) : undefined;
    onSave();
  }
</script>

<div class="{kind}-edit-header edit-header editor-row">
  <div class="editor-fields">
    <label class="label name-label"
      >{t.editor.name}
      <input
        class="input name-input"
        name="name-input"
        type="text"
        size="40"
        placeholder={kind === 'curriculum'
          ? t.editor.curriculumPlaceholder
          : t.editor.moduleAreaPlaceholder}
        bind:value={name}
      /></label
    >
    <div class="elimination-input-container">
      {t.editor.elimination}
      <label class="label elimination-count-label"
        >{t.editor.limitedCount}
        <input
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
        >{t.editor.limitedCredits}
        <input
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
    <div class="credit-limits-container">
      {t.editor.credits}
      <label class="label min-credits-label" title={t.editor.minimumTitle}
        >{t.editor.minimum}
        <input
          class="checkbox min-credits-checkbox"
          name="min-credits-checkbox"
          type="checkbox"
          bind:checked={minLimited}
        /><input
          class="input min-credits-input"
          name="min-credits-input"
          type="number"
          step="1"
          min="0"
          placeholder="0"
          size="3"
          disabled={!minLimited}
          bind:value={minCredits}
        /></label
      ><label class="label max-credits-label" title={t.editor.maximumTitle}
        >{t.editor.maximum}
        <input
          class="checkbox max-credits-checkbox"
          name="max-credits-checkbox"
          type="checkbox"
          bind:checked={maxLimited}
        /><input
          class="input max-credits-input"
          name="max-credits-input"
          type="number"
          step="1"
          min="0"
          placeholder="0"
          size="3"
          disabled={!maxLimited}
          bind:value={maxCredits}
        /></label
      >
    </div>
  </div>
  <div class="editor-controls">
    <IconButton icon="check" variant="primary" label={t.editor.save} onclick={save} /><IconButton
      icon="x"
      label={t.editor.discard}
      onclick={onDiscard}
    />
  </div>
</div>
