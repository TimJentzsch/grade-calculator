<script lang="ts">
  import { untrack } from 'svelte';
  import { parseCredits } from '#lib/credits.ts';
  import type { AreaDefinition, CurriculumDefinition } from '#lib/curricula/definition.ts';
  import { getI18n } from '#lib/i18n/index.ts';
  import { formatWeight, parseWeight } from '#lib/weight.ts';
  import Button from './Button.svelte';
  import IconButton from './IconButton.svelte';
  import LimitsFields from './LimitsFields.svelte';
  import NumberInput from './NumberInput.svelte';

  interface Props {
    /** The definition to start from. It is not changed, the edited copy is passed to `onSave`. */
    definition: CurriculumDefinition;
    /** Whether a new curriculum is created, which only changes the title. */
    isNew?: boolean;
    onSave: (definition: CurriculumDefinition) => void;
    onCancel: () => void;
  }

  const { definition, isNew = false, onSave, onCancel }: Props = $props();

  const i18n = getI18n();
  const t = $derived(i18n.t);

  // The editor works on a copy that is only passed on when saving
  const draft: CurriculumDefinition = $state(
    untrack(() => structuredClone($state.snapshot(definition))),
  );

  function addArea() {
    draft.moduleAreas.push({ id: crypto.randomUUID(), name: '', modules: [] });
  }

  function addModule(area: AreaDefinition) {
    area.modules.push({ id: crypto.randomUUID(), name: '', credits: 0 });
  }

  function save() {
    onSave($state.snapshot(draft));
  }
</script>

<form
  class="definition-editor"
  aria-labelledby="definition-editor-title"
  onsubmit={(event) => {
    event.preventDefault();
    save();
  }}
>
  <h2 id="definition-editor-title">{isNew ? t.editor.newTitle : t.editor.editTitle}</h2>
  <p class="intro">{t.editor.intro}</p>

  <section class="curriculum-fields">
    <label class="name-field"
      >{t.editor.name}
      <input
        type="text"
        name="curriculum-name"
        placeholder={t.editor.curriculumPlaceholder}
        bind:value={draft.name}
      /></label
    >
    <LimitsFields limits={draft} />
  </section>

  <h3>{t.editor.moduleAreas}</h3>
  {#each draft.moduleAreas as area, areaIndex (area.id)}
    <section class="area" aria-label={area.name || t.editor.moduleAreaPlaceholder}>
      <div class="area-header">
        <input
          class="area-name"
          type="text"
          aria-label={t.editor.name}
          placeholder={t.editor.moduleAreaPlaceholder}
          bind:value={area.name}
        />
        <IconButton
          icon="trash"
          variant="danger"
          label={t.editor.removeArea(area.name || undefined)}
          onclick={() => draft.moduleAreas.splice(areaIndex, 1)}
        />
      </div>
      <LimitsFields limits={area} />
      <label class="open-choice" title={t.editor.openChoiceTitle}
        ><input
          type="checkbox"
          bind:checked={
            () => Boolean(area.openChoice), (checked) => (area.openChoice = checked || undefined)
          }
        />{t.editor.openChoice}</label
      >

      {#if area.modules.length > 0}
        <table class="modules">
          <thead>
            <tr>
              <th scope="col">{t.editor.moduleName}</th>
              <th scope="col">{t.editor.moduleCredits}</th>
              <th scope="col">{t.editor.moduleWeight}</th>
              <th scope="col">{t.editor.moduleGraded}</th>
              <th scope="col"
                ><span class="visually-hidden">{t.editor.removeModule(undefined)}</span></th
              >
            </tr>
          </thead>
          <tbody>
            {#each area.modules as module, moduleIndex (module.id)}
              <tr>
                <td
                  ><input
                    class="module-name"
                    type="text"
                    aria-label={t.editor.moduleName}
                    placeholder={t.editor.modulePlaceholder}
                    bind:value={module.name}
                  /></td
                >
                <td
                  ><NumberInput
                    label={t.editor.moduleCredits}
                    hint={t.module.creditsHint}
                    parse={parseCredits}
                    bind:value={module.credits}
                  /></td
                >
                <td
                  ><NumberInput
                    label={t.editor.moduleWeight}
                    hint={t.module.weightHint}
                    parse={parseWeight}
                    format={formatWeight}
                    bind:value={
                      () => module.weight ?? 1,
                      (weight) => (module.weight = weight === 1 ? undefined : weight)
                    }
                  /></td
                >
                <td class="graded"
                  ><input
                    type="checkbox"
                    aria-label={t.editor.moduleGraded}
                    bind:checked={
                      () => !module.notGraded, (graded) => (module.notGraded = !graded || undefined)
                    }
                  /></td
                >
                <td
                  ><IconButton
                    icon="trash"
                    variant="danger"
                    label={t.editor.removeModule(module.name || undefined)}
                    onclick={() => area.modules.splice(moduleIndex, 1)}
                  /></td
                >
              </tr>
            {/each}
          </tbody>
        </table>
      {:else}
        <p class="no-modules">{t.editor.noModules}</p>
      {/if}
      <div>
        <Button variant="secondary" onclick={() => addModule(area)}>{t.editor.addModule}</Button>
      </div>
    </section>
  {/each}
  <div>
    <Button variant="secondary" onclick={addArea}>{t.editor.addArea}</Button>
  </div>

  <div class="actions">
    <Button variant="secondary" onclick={onCancel}>{t.editor.cancel}</Button>
    <Button onclick={save}>{t.editor.save}</Button>
  </div>
</form>

<style>
  .definition-editor {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    margin: var(--space-md) 0;
    padding: var(--space-lg);
    background-color: var(--color-surface);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-raised);
  }

  h2,
  h3 {
    margin: 0;
    color: var(--color-heading);
  }

  h2 {
    font-size: var(--font-size-xl);
  }

  h3 {
    margin-top: var(--space-sm);
    font-size: var(--font-size-lg);
  }

  .intro {
    margin: 0;
    color: var(--color-text-muted);
  }

  .curriculum-fields,
  .area {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .name-field {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }

  .name-field input,
  .area-name {
    flex: 1;
    min-width: 0;
  }

  .area {
    padding: var(--space-md);
    background-color: var(--color-surface-raised);
    border-radius: var(--radius-md);
  }

  .area-header {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }

  .area-name {
    font-weight: var(--font-weight-semibold);
  }

  .open-choice {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
  }

  .modules {
    width: 100%;
    border-collapse: collapse;
  }

  .modules th {
    color: var(--color-text-muted);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    text-align: left;
  }

  .modules td {
    padding: var(--space-2xs) var(--space-xs) var(--space-2xs) 0;
  }

  .module-name {
    width: 100%;
  }

  .graded {
    text-align: center;
  }

  .no-modules {
    margin: 0;
    color: var(--color-text-muted);
    font-size: var(--font-size-sm);
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-sm);
  }
</style>
