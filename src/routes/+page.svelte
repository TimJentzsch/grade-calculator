<script lang="ts">
  import Button from '#lib/components/Button.svelte';
  import CurriculumView from '#lib/components/CurriculumView.svelte';
  import runAutoElimination from '#lib/auto-elimination.ts';
  import Curriculum, { type CurriculumObject } from '#lib/model/curriculum.svelte.ts';
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

  /* The main action, aligned to the right if there is enough space */
  .elimination-group {
    margin-left: auto;
  }
</style>
