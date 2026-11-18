<script lang="ts">
  import CurriculumView from '#lib/components/CurriculumView.svelte';
  import getBestElimination from '#lib/elimination.ts';
  import Curriculum, { type CurriculumObject } from '#lib/model/curriculum.svelte.ts';
  import templates, { computerScienceBsc } from '#lib/templates/index.ts';

  let curriculum = $state(Curriculum.fromObject(computerScienceBsc));

  function loadConfig(config: CurriculumObject) {
    curriculum = Curriculum.fromObject(config);
  }

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

  async function autoElimination() {
    curriculum = await getBestElimination(curriculum);
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
      <div id="template-container">
        Curriculum templates:
        <button
          id="new-curriculum-button"
          class="template-button"
          title="Create a new empty curriculum"
          onclick={() => (curriculum = new Curriculum(undefined, []))}
        >
          Empty Curriculum
        </button>
        {#each templates as template (template.name)}<button
            class="template-button"
            title="Load the {template.name} curriculum"
            onclick={() => loadConfig(template)}>{template.name}</button
          >{/each}
      </div>
    </div>
    <div class="settings-container">
      <label>
        Load curriculum:
        <label class="upload-button" title="Upload a saved curriculum">
          Load...
          <input
            id="load-config"
            type="file"
            accept=".json"
            name="configurationInput"
            style="display: none"
            onchange={loadConfiguration}
          />
        </label>
      </label>
    </div>
    <div class="settings-container">
      <span>
        Save curriculum:
        <!-- eslint-disable svelte/no-navigation-without-resolve -- data: URL download, not a route -->
        <a
          id="save-config"
          class="save-button"
          href={saveHref}
          download={saveFileName}
          target="_blank"
          title="Download the curriculum configuration"
        >
          Save...
        </a>
        <!-- eslint-enable svelte/no-navigation-without-resolve -->
      </span>
    </div>
    <div class="settings-container">
      <label>
        Auto elimination:
        <button
          id="auto-elimination-button"
          class="template-button"
          title="Automatically eliminate modules for the best grade"
          onclick={autoElimination}
        >
          Eliminate...
        </button>
      </label>

      <span id="auto-elimination-loading-indicator"></span>
    </div>
  </div>
  <div id="content">
    {#key curriculum}
      <CurriculumView {curriculum} />
    {/key}
  </div>
</div>
