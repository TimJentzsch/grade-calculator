<script lang="ts">
  import Module from '#lib/model/module.svelte.ts';
  import type ModuleArea from '#lib/model/module-area.svelte.ts';
  import AreaHeader from './AreaHeader.svelte';
  import ModuleDisplay from './ModuleDisplay.svelte';

  interface Props {
    moduleArea: ModuleArea;
  }

  const { moduleArea }: Props = $props();

  /** Modules added by the user, which start with editing the name. */
  const addedModules = new WeakSet<Module>();

  function addModule() {
    const module = new Module('', undefined, undefined, 1, false, false);
    addedModules.add(module);
    moduleArea.addModule(module);
  }
</script>

<div class="module-area-container">
  <!-- Only the modules of areas with open choice, e.g. electives, are chosen by the student -->
  <AreaHeader
    kind="module-area"
    area={moduleArea}
    onAdd={moduleArea.openChoice ? addModule : undefined}
  />
  <div class="module-area-module-container">
    {#each moduleArea.modules as module, index (module)}
      <ModuleDisplay
        {module}
        isNew={addedModules.has(module)}
        onRemove={() => moduleArea.modules.splice(index, 1)}
      />
    {/each}
  </div>
</div>
