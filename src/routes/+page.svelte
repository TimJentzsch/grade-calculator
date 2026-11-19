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
  <div id="settings">
    <div class="settings-container">
      Curriculum templates:
      <Button title="Create a new empty curriculum" onclick={newCurriculum}>Empty Curriculum</Button
      >{#each templates as template (template.name)}<Button
          title="Load the {template.name} curriculum"
          onclick={() => loadConfig(template)}>{template.name}</Button
        >{/each}
    </div>
    <div class="settings-container">
      Load curriculum:
      <Button title="Upload a saved curriculum" onclick={() => fileInput?.click()}>Load...</Button>
      <input
        bind:this={fileInput}
        type="file"
        accept=".json"
        name="configurationInput"
        hidden
        onchange={loadConfiguration}
      />
    </div>
    <div class="settings-container">
      Save curriculum:
      <Button href={saveHref} download={saveFileName} title="Download the curriculum configuration"
        >Save...</Button
      >
    </div>
    <div class="settings-container">
      Auto elimination:
      <Button
        title="Automatically eliminate modules for the best grade"
        onclick={autoElimination}
        disabled={eliminating}>Eliminate...</Button
      >

      <span id="auto-elimination-loading-indicator">{eliminating ? 'Calculating…' : ''}</span>
    </div>
  </div>
  <div id="content">
    {#key curriculum}
      <CurriculumView {curriculum} startEditing={emptyCurricula.has(curriculum)} />
    {/key}
  </div>
</div>
