<script lang="ts">
  import Button from '#lib/components/Button.svelte';
  import CurriculumView from '#lib/components/CurriculumView.svelte';
  import IconButton from '#lib/components/IconButton.svelte';
  import runAutoElimination from '#lib/auto-elimination.ts';
  import Curriculum, { type CurriculumObject } from '#lib/model/curriculum.svelte.ts';
  import { importNotenspiegel } from '#lib/notenspiegel/import.ts';
  import readNotenspiegel from '#lib/notenspiegel/read-notenspiegel.ts';
  import templates, { computerScienceBsc } from '#lib/templates/index.ts';

  let curriculum = $state(Curriculum.fromObject(computerScienceBsc));

  /** Curricula created with "Empty Curriculum", which start in the editor. */
  const emptyCurricula = new WeakSet<Curriculum>();

  function newCurriculum() {
    const empty = new Curriculum(undefined, []);
    emptyCurricula.add(empty);
    curriculum = empty;
  }

  function loadConfig(config: CurriculumObject) {
    curriculum = Curriculum.fromObject(config);
  }

  let fileInput: HTMLInputElement | undefined = $state();

  function loadConfiguration(event: Event & { currentTarget: HTMLInputElement }) {
    const input = event.currentTarget;

    const reader = new FileReader();
    reader.onload = () => {
      loadConfig(JSON.parse(reader.result as string));
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

  /** The result of the last import, shown below the toolbar until dismissed. */
  let importNotice:
    { kind: 'success' | 'warning' | 'error'; message: string; details: string[] } | undefined =
    $state();

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
      loadConfig(result.curriculum);
      importNotice =
        result.warnings.length > 0
          ? {
              kind: 'warning',
              message: 'The Notenspiegel was imported, but please check the following:',
              details: result.warnings,
            }
          : { kind: 'success', message: 'The Notenspiegel was imported.', details: [] };
    } catch (error) {
      importNotice = {
        kind: 'error',
        message: 'The Notenspiegel could not be imported.',
        details: [error instanceof Error ? error.message : String(error)],
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
      JSON.stringify(curriculum.toObject(), null, 2),
    )}`,
  );

  const saveFileName = $derived.by(() => {
    const curriculumName = (curriculum.name || 'curriculum')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[.?!;]/g, '');
    return `${curriculumName}.json`;
  });
</script>

<div id="body-container">
  <div class="toolbar">
    <div class="toolbar-group" role="group" aria-labelledby="templates-label">
      <span id="templates-label" class="toolbar-label">Start from</span>
      <div class="toolbar-buttons">
        <Button variant="secondary" title="Create a new empty curriculum" onclick={newCurriculum}
          >Empty curriculum</Button
        >
        {#each templates as template (template.name)}
          <Button
            variant="secondary"
            title="Load the {template.name} curriculum"
            onclick={() => loadConfig(template)}>{template.name}</Button
          >
        {/each}
      </div>
    </div>
    <div class="toolbar-group" role="group" aria-labelledby="file-label">
      <span id="file-label" class="toolbar-label">File</span>
      <div class="toolbar-buttons">
        <Button
          variant="secondary"
          title="Load a saved curriculum from a file"
          onclick={() => fileInput?.click()}>Load…</Button
        >
        <Button
          variant="secondary"
          href={saveHref}
          download={saveFileName}
          title="Save the curriculum to a file">Save…</Button
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
          title="Import your grades from a Notenspiegel PDF exported from RWTH Online. The file stays in your browser."
          onclick={() => notenspiegelInput?.click()}
          disabled={importing}>{importing ? 'Importing…' : 'Import Notenspiegel…'}</Button
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
      <span id="elimination-label" class="toolbar-label">Elimination</span>
      <div class="toolbar-buttons" aria-live="polite">
        <Button
          title="Automatically eliminate modules for the best grade"
          onclick={autoElimination}
          disabled={eliminating}>{eliminating ? 'Calculating…' : 'Auto-eliminate'}</Button
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
          <p>{importNotice.message}</p>
          {#if importNotice.details.length > 0}
            <ul>
              {#each importNotice.details as detail (detail)}
                <li>{detail}</li>
              {/each}
            </ul>
          {/if}
        </div>
        <IconButton icon="x" label="Dismiss" onclick={() => (importNotice = undefined)} />
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
