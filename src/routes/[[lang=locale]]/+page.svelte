<script lang="ts">
  import Button from '#lib/components/Button.svelte';
  import CurriculumView from '#lib/components/CurriculumView.svelte';
  import DefinitionEditor from '#lib/components/DefinitionEditor.svelte';
  import Notice from '#lib/components/Notice.svelte';
  import StartView from '#lib/components/StartView.svelte';
  import runAutoElimination from '#lib/auto-elimination.ts';
  import type { CurriculumDefinition } from '#lib/curricula/definition.ts';
  import { isBuiltIn } from '#lib/curricula/index.ts';
  import { formatGrade } from '#lib/grade.ts';
  import { getI18n, type Messages } from '#lib/i18n/index.ts';
  import type Curriculum from '#lib/model/curriculum.svelte.ts';
  import {
    importNotenspiegel,
    UnsupportedProgramError,
    type ImportWarning,
  } from '#lib/notenspiegel/import.ts';
  import readNotenspiegel, { NotenspiegelReadError } from '#lib/notenspiegel/read-notenspiegel.ts';
  import { loadSavedStudy, saveStudy } from '#lib/storage.ts';
  import {
    buildCurriculum,
    curriculumOf,
    emptyStudy,
    parseStudy,
    type StudyObject,
    toStudy,
  } from '#lib/study.ts';
  import { onMount } from 'svelte';

  const i18n = getI18n();
  const t = $derived(i18n.t);

  /** The curriculum with the entries of the user, or `undefined` before one is chosen. */
  let curriculum: Curriculum | undefined = $state();

  /** Whether the saved study has been restored, so that changes can be saved. */
  let restored = $state(false);

  // The page is prerendered, so the saved study is only available in the browser
  onMount(() => {
    const saved = loadSavedStudy(localStorage);
    curriculum = saved && curriculumOf(saved);
    restored = true;
  });

  // Save every change, so that nothing is lost when the page is closed
  $effect(() => {
    if (restored) {
      saveStudy(localStorage, curriculum && toStudy(curriculum));
    }
  });

  /** Whether the user entered anything that would be lost by replacing the study. */
  function hasEntries(): boolean {
    if (!curriculum) {
      return false;
    }
    const study = toStudy(curriculum);
    return Object.keys(study.results).length > 0 || Object.keys(study.chosenModules).length > 0;
  }

  /** Asks before entries of the user are replaced. */
  function confirmReplace(message: string): boolean {
    return !hasEntries() || confirm(message);
  }

  /**
   * A message shown below the toolbar until dismissed.
   * The texts are created when shown, so that they follow the language.
   */
  let notice:
    | {
        kind: 'success' | 'warning' | 'error';
        message: (messages: Messages) => string;
        details: (messages: Messages) => string[];
      }
    | undefined = $state();

  function chooseCurriculum(definition: CurriculumDefinition) {
    notice = undefined;
    curriculum = buildCurriculum(definition, emptyStudy(definition));
  }

  /** The curriculum definition currently edited, see `DefinitionEditor`. */
  let editing: { definition: CurriculumDefinition; isNew: boolean } | undefined = $state();

  function createCustom() {
    notice = undefined;
    editing = { definition: { id: crypto.randomUUID(), name: '', moduleAreas: [] }, isNew: true };
  }

  /**
   * Edits the curriculum. A built-in curriculum is copied, keeping the ids of its areas and
   * modules, so that the entries of the user are kept.
   */
  function editCurriculum() {
    const definition = curriculum?.definition;
    if (!definition) {
      return;
    }
    editing = isBuiltIn(definition)
      ? { definition: { ...structuredClone(definition), id: crypto.randomUUID() }, isNew: true }
      : { definition, isNew: false };
  }

  function saveDefinition(definition: CurriculumDefinition) {
    const study = curriculum ? toStudy(curriculum) : emptyStudy(definition);
    curriculum = buildCurriculum(definition, { ...study, curriculum: { custom: definition } });
    editing = undefined;
  }

  function startOver() {
    if (confirmReplace(t.toolbar.confirmStartOver)) {
      notice = undefined;
      curriculum = undefined;
    }
  }

  let fileInput: HTMLInputElement | undefined = $state();

  function showLoadError() {
    notice = {
      kind: 'error',
      message: (messages) => messages.toolbar.loadError,
      details: () => [],
    };
  }

  async function loadFile(event: Event & { currentTarget: HTMLInputElement }) {
    const file = event.currentTarget.files?.[0];
    // Allows selecting the same file again
    event.currentTarget.value = '';
    if (!file || !confirmReplace(t.toolbar.confirmReplace)) {
      return;
    }

    let study: StudyObject | undefined;
    try {
      study = parseStudy(JSON.parse(await file.text()));
    } catch (error) {
      console.warn('Failed to load the file:', error);
    }
    const loaded = study && curriculumOf(study);
    if (loaded) {
      notice = undefined;
      curriculum = loaded;
    } else {
      showLoadError();
    }
  }

  let notenspiegelInput: HTMLInputElement | undefined = $state();

  /** Whether a Notenspiegel is currently being imported. */
  let importing = $state(false);

  function warningText(messages: Messages, warning: ImportWarning): string {
    switch (warning.kind) {
      case 'unassigned':
        return messages.import.unassigned(warning.name, warning.credits);
      case 'elimination-limits':
        return messages.import.eliminationLimits;
      case 'grade-mismatch':
        return messages.import.gradeMismatch(
          formatGrade(warning.calculated),
          formatGrade(warning.official),
        );
    }
  }

  function errorText(messages: Messages, error: unknown): string {
    if (error instanceof UnsupportedProgramError) {
      return messages.import.unsupported(error.program, error.supported.join(', '));
    }
    if (error instanceof NotenspiegelReadError) {
      return messages.import.readErrors[error.reason];
    }
    console.error('Failed to import the Notenspiegel:', error);
    return messages.import.readErrors.failed;
  }

  async function importFile(file: File) {
    importing = true;
    notice = undefined;
    try {
      const result = importNotenspiegel(await readNotenspiegel(file));
      if (!confirmReplace(t.toolbar.confirmReplace)) {
        return;
      }
      curriculum = curriculumOf(result.study);
      notice =
        result.warnings.length > 0
          ? {
              kind: 'warning',
              message: (messages) => messages.import.warning,
              details: (messages) =>
                result.warnings.map((warning) => warningText(messages, warning)),
            }
          : { kind: 'success', message: (messages) => messages.import.success, details: () => [] };
    } catch (error) {
      notice = {
        kind: 'error',
        message: (messages) => messages.import.error,
        details: (messages) => [errorText(messages, error)],
      };
    } finally {
      importing = false;
    }
  }

  function onNotenspiegelSelected(event: Event & { currentTarget: HTMLInputElement }) {
    const file = event.currentTarget.files?.[0];
    // Allows selecting the same file again
    event.currentTarget.value = '';
    if (file) {
      void importFile(file);
    }
  }

  /** Whether the best elimination is currently being calculated. */
  let eliminating = $state(false);

  async function autoElimination() {
    if (!curriculum) {
      return;
    }
    eliminating = true;
    try {
      curriculum = await runAutoElimination(curriculum);
    } catch (error) {
      console.error('Failed to calculate the best elimination:', error);
    } finally {
      eliminating = false;
    }
  }

  const saveHref = $derived(
    curriculum &&
      `data:application/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(toStudy(curriculum), null, 2),
      )}`,
  );

  const saveFileName = $derived.by(() => {
    const name = (curriculum?.name || t.toolbar.defaultFileName)
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[.?!;()]/g, '');
    return `${name}.json`;
  });
</script>

<div id="body-container">
  <input
    bind:this={fileInput}
    type="file"
    accept=".json,application/json"
    name="studyInput"
    hidden
    onchange={loadFile}
  />
  <input
    bind:this={notenspiegelInput}
    type="file"
    accept=".pdf,application/pdf"
    name="notenspiegelInput"
    hidden
    onchange={onNotenspiegelSelected}
  />
  {#if curriculum && !editing}
    <div class="toolbar">
      <div class="toolbar-group" role="group" aria-labelledby="import-label">
        <span id="import-label" class="toolbar-label">RWTH Online</span>
        <div class="toolbar-buttons">
          <Button
            title={t.toolbar.importTitle}
            onclick={() => notenspiegelInput?.click()}
            disabled={importing}
            >{importing ? t.toolbar.importing : t.toolbar.importNotenspiegel}</Button
          >
        </div>
      </div>
      <div class="toolbar-group" role="group" aria-labelledby="file-label">
        <span id="file-label" class="toolbar-label">{t.toolbar.file}</span>
        <div class="toolbar-buttons">
          <Button variant="secondary" title={t.toolbar.loadTitle} onclick={() => fileInput?.click()}
            >{t.toolbar.load}</Button
          >
          <Button
            variant="secondary"
            href={saveHref}
            download={saveFileName}
            title={t.toolbar.saveTitle}>{t.toolbar.save}</Button
          >
        </div>
      </div>
      <div class="toolbar-group" role="group" aria-labelledby="curriculum-label">
        <span id="curriculum-label" class="toolbar-label">{t.toolbar.curriculum}</span>
        <div class="toolbar-buttons">
          {#if curriculum.definition && isBuiltIn(curriculum.definition)}
            <Button variant="secondary" title={t.toolbar.duplicateTitle} onclick={editCurriculum}
              >{t.toolbar.duplicate}</Button
            >
          {:else}
            <Button
              variant="secondary"
              title={t.toolbar.editCurriculumTitle}
              onclick={editCurriculum}>{t.toolbar.editCurriculum}</Button
            >
          {/if}
          <Button variant="secondary" title={t.toolbar.startOverTitle} onclick={startOver}
            >{t.toolbar.startOver}</Button
          >
        </div>
      </div>
      <div
        class="toolbar-group regelstudienzeit-group"
        role="group"
        aria-labelledby="regelstudienzeit-label"
      >
        <span id="regelstudienzeit-label" class="toolbar-label">{t.toolbar.regelstudienzeit}</span>
        <div class="toolbar-buttons" aria-live="polite">
          <label class="toggle"
            ><input
              type="checkbox"
              aria-describedby="regelstudienzeit-hint"
              bind:checked={curriculum.regelstudienzeit}
            />{t.toolbar.regelstudienzeitToggle}</label
          >
          <Button
            variant="secondary"
            title={t.toolbar.autoEliminateTitle}
            onclick={autoElimination}
            disabled={eliminating || !curriculum.regelstudienzeit}
            >{eliminating ? t.toolbar.calculating : t.toolbar.autoEliminate}</Button
          >
        </div>
        <p id="regelstudienzeit-hint" class="toolbar-hint">{t.toolbar.regelstudienzeitHint}</p>
      </div>
    </div>
  {/if}
  <div class="notice-region" aria-live="polite">
    {#if notice}
      <Notice
        kind={notice.kind}
        message={notice.message(t)}
        details={notice.details(t)}
        onDismiss={() => (notice = undefined)}
      />
    {/if}
  </div>
  <div id="content">
    {#if editing}
      <DefinitionEditor
        definition={editing.definition}
        isNew={editing.isNew}
        onSave={saveDefinition}
        onCancel={() => (editing = undefined)}
      />
    {:else if curriculum}
      {#key curriculum}
        <CurriculumView {curriculum} />
      {/key}
    {:else if restored}
      <StartView
        {importing}
        onImport={importFile}
        onChoose={chooseCurriculum}
        onCustom={createCustom}
        onLoad={() => fileInput?.click()}
      />
    {/if}
  </div>
</div>

<style>
  .toolbar {
    display: flex;
    flex-flow: row wrap;
    align-items: flex-end;
    gap: var(--space-md) var(--space-xl);
    margin: var(--space-md) 0;
    padding: var(--space-md);
    background-color: var(--color-surface);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-raised);
  }

  .toolbar-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .toolbar-label {
    color: var(--color-text-muted);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
  }

  .toolbar-buttons {
    display: flex;
    flex-flow: row wrap;
    gap: var(--space-sm);
  }

  /* Aligned to the right if there is enough space */
  .regelstudienzeit-group {
    margin-left: auto;
  }

  .toggle {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
  }

  .toolbar-hint {
    max-width: 36em;
    margin: 0;
    color: var(--color-text-muted);
    font-size: var(--font-size-sm);
  }
</style>
