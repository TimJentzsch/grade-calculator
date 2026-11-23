<script lang="ts">
  import Button from '#lib/components/Button.svelte';
  import CurriculumView from '#lib/components/CurriculumView.svelte';
  import IconButton from '#lib/components/IconButton.svelte';
  import runAutoElimination from '#lib/auto-elimination.ts';
  import { formatGrade } from '#lib/grade.ts';
  import { getI18n, type Messages } from '#lib/i18n/index.ts';
  import { builtInCurricula, computerScienceBsc2018 } from '#lib/curricula/index.ts';
  import type { CurriculumDefinition } from '#lib/curricula/definition.ts';
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

  let curriculum: Curriculum = $state(
    buildCurriculum(computerScienceBsc2018, emptyStudy(computerScienceBsc2018)),
  );

  /** Whether the saved curriculum has been restored, so that changes can be saved. */
  let restored = $state(false);

  // The page is prerendered, so the saved curriculum is only available in the browser
  onMount(() => {
    const saved = loadSavedStudy(localStorage);
    const restoredCurriculum = saved && curriculumOf(saved);
    if (restoredCurriculum) {
      curriculum = restoredCurriculum;
    }
    restored = true;
  });

  // Save every change, so that nothing is lost when the page is closed
  $effect(() => {
    if (restored) {
      saveStudy(localStorage, toStudy(curriculum));
    }
  });

  /** Curricula created with "Empty Curriculum", which start in the editor. */
  const emptyCurricula = new WeakSet<Curriculum>();

  function newCurriculum() {
    const definition: CurriculumDefinition = { id: crypto.randomUUID(), name: '', moduleAreas: [] };
    const empty = buildCurriculum(definition, emptyStudy(definition));
    emptyCurricula.add(empty);
    curriculum = empty;
  }

  function loadStudy(study: StudyObject | undefined) {
    const loaded = study && curriculumOf(study);
    if (loaded) {
      curriculum = loaded;
    }
  }

  function loadDefinition(definition: CurriculumDefinition) {
    curriculum = buildCurriculum(definition, emptyStudy(definition));
  }

  let fileInput: HTMLInputElement | undefined = $state();

  function loadConfiguration(event: Event & { currentTarget: HTMLInputElement }) {
    const input = event.currentTarget;

    const reader = new FileReader();
    reader.onload = () => {
      loadStudy(parseStudy(JSON.parse(reader.result as string)));
    };
    if (input.files && input.files.length > 0) {
      console.info('Loading configuration...');
      reader.readAsText(input.files[0]);
    } else {
      console.warn('No input specified!');
    }
  }

  let notenspiegelInput: HTMLInputElement | undefined = $state();

  /** Whether a Notenspiegel is currently being imported. */
  let importing = $state(false);

  /**
   * The result of the last import, shown below the toolbar until dismissed.
   * The texts are created when shown, so that they follow the language.
   */
  let importNotice:
    | {
        kind: 'success' | 'warning' | 'error';
        message: (messages: Messages) => string;
        details: (messages: Messages) => string[];
      }
    | undefined = $state();

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

  async function onNotenspiegelSelected(event: Event & { currentTarget: HTMLInputElement }) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    // Allows selecting the same file again
    input.value = '';
    if (!file) {
      return;
    }

    importing = true;
    importNotice = undefined;
    try {
      const result = importNotenspiegel(await readNotenspiegel(file));
      loadStudy(result.study);
      importNotice =
        result.warnings.length > 0
          ? {
              kind: 'warning',
              message: (messages) => messages.import.warning,
              details: (messages) =>
                result.warnings.map((warning) => warningText(messages, warning)),
            }
          : { kind: 'success', message: (messages) => messages.import.success, details: () => [] };
    } catch (error) {
      importNotice = {
        kind: 'error',
        message: (messages) => messages.import.error,
        details: (messages) => [errorText(messages, error)],
      };
    } finally {
      importing = false;
    }
  }

  /** Whether the best elimination is currently being calculated. */
  let eliminating = $state(false);

  async function autoElimination() {
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
    `data:application/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(toStudy(curriculum), null, 2),
    )}`,
  );

  const saveFileName = $derived.by(() => {
    const curriculumName = (curriculum.name || t.toolbar.defaultFileName)
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[.?!;]/g, '');
    return `${curriculumName}.json`;
  });
</script>

<div id="body-container">
  <div class="toolbar">
    <div class="toolbar-group" role="group" aria-labelledby="templates-label">
      <span id="templates-label" class="toolbar-label">{t.toolbar.startFrom}</span>
      <div class="toolbar-buttons">
        <Button variant="secondary" title={t.toolbar.emptyCurriculumTitle} onclick={newCurriculum}
          >{t.toolbar.emptyCurriculum}</Button
        >
        {#each builtInCurricula as template (template.id)}
          <Button
            variant="secondary"
            title={t.toolbar.loadTemplateTitle(template.name ?? '')}
            onclick={() => loadDefinition(template)}>{template.name}</Button
          >
        {/each}
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
        <input
          bind:this={fileInput}
          type="file"
          accept=".json"
          name="configurationInput"
          hidden
          onchange={loadConfiguration}
        />
      </div>
    </div>
    <div class="toolbar-group" role="group" aria-labelledby="import-label">
      <span id="import-label" class="toolbar-label">RWTH Online</span>
      <div class="toolbar-buttons">
        <Button
          variant="secondary"
          title={t.toolbar.importTitle}
          onclick={() => notenspiegelInput?.click()}
          disabled={importing}
          >{importing ? t.toolbar.importing : t.toolbar.importNotenspiegel}</Button
        >
        <input
          bind:this={notenspiegelInput}
          type="file"
          accept=".pdf,application/pdf"
          name="notenspiegelInput"
          hidden
          onchange={onNotenspiegelSelected}
        />
      </div>
    </div>
    <div class="toolbar-group elimination-group" role="group" aria-labelledby="elimination-label">
      <span id="elimination-label" class="toolbar-label">{t.toolbar.elimination}</span>
      <div class="toolbar-buttons" aria-live="polite">
        <Button
          title={t.toolbar.autoEliminateTitle}
          onclick={autoElimination}
          disabled={eliminating}
          >{eliminating ? t.toolbar.calculating : t.toolbar.autoEliminate}</Button
        >
      </div>
    </div>
  </div>
  <div class="notice-region" aria-live="polite">
    {#if importNotice}
      <div
        class="notice {importNotice.kind}"
        role={importNotice.kind === 'error' ? 'alert' : 'status'}
      >
        <div class="notice-text">
          <p>{importNotice.message(t)}</p>
          {#if importNotice.details(t).length > 0}
            <ul>
              {#each importNotice.details(t) as detail (detail)}
                <li>{detail}</li>
              {/each}
            </ul>
          {/if}
        </div>
        <IconButton icon="x" label={t.import.dismiss} onclick={() => (importNotice = undefined)} />
      </div>
    {/if}
  </div>
  <div id="content">
    {#key curriculum}
      <CurriculumView {curriculum} startEditing={emptyCurricula.has(curriculum)} />
    {/key}
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

  .notice {
    display: flex;
    align-items: flex-start;
    gap: var(--space-md);
    margin: var(--space-md) 0;
    padding: var(--space-sm) var(--space-md);
    background-color: var(--color-surface);
    border-left: 4px solid var(--color-success);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-raised);
  }

  .notice.warning {
    border-left-color: var(--color-warning);
  }

  .notice.error {
    border-left-color: var(--color-danger);
  }

  .notice-text {
    flex: 1;
  }

  .notice p,
  .notice ul {
    margin: var(--space-xs) 0;
  }

  /* The main action, aligned to the right if there is enough space */
  .elimination-group {
    margin-left: auto;
  }
</style>
