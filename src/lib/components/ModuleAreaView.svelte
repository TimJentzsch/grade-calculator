<script lang="ts">
  import { untrack } from 'svelte';
  import Module from '#lib/model/module.svelte.ts';
  import type ModuleArea from '#lib/model/module-area.svelte.ts';
  import AreaEditor from './AreaEditor.svelte';
  import AreaHeader from './AreaHeader.svelte';
  import ModuleView from './ModuleView.svelte';

  interface Props {
    moduleArea: ModuleArea;
    /** Whether to open the editor right away, e.g. for a newly added module area. */
    startEditing?: boolean;
    onRemove: () => void;
  }

  const { moduleArea, startEditing = false, onRemove }: Props = $props();

  let editing = $state(untrack(() => startEditing));

  /** Modules added by the user, which start in the editor. */
  const addedModules = new WeakSet<Module>();

  function addModule() {
    const module = new Module('', undefined, undefined, 1, false, false);
    addedModules.add(module);
    moduleArea.addModule(module);
  }

  function discard() {
    if (moduleArea.isEmpty) {
      onRemove();
    } else {
      editing = false;
    }
  }
</script>

<div class="module-area-container">
  {#if editing}
    <AreaEditor
      kind="module-area"
      area={moduleArea}
      onSave={() => (editing = false)}
      onDiscard={discard}
    />
  {:else}
    <AreaHeader
      kind="module-area"
      area={moduleArea}
      onAdd={addModule}
      onEdit={() => (editing = true)}
      {onRemove}
    />
  {/if}
  <div class="module-area-module-container">
    {#each moduleArea.modules as module, index (module)}
      <ModuleView
        {module}
        startEditing={addedModules.has(module)}
        onRemove={() => moduleArea.modules.splice(index, 1)}
      />
    {/each}
  </div>
</div>
