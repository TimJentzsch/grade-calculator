<script lang="ts">
  import { untrack } from 'svelte';
  import Module from '#lib/model/module.svelte.ts';
  import type ModuleArea from '#lib/model/module-area.svelte.ts';
  import AreaEditor from './AreaEditor.svelte';
  import AreaHeader from './AreaHeader.svelte';
  import ModuleView from './ModuleView.svelte';

  interface Props {
    moduleArea: ModuleArea;
    onRemove: () => void;
  }

  const { moduleArea, onRemove }: Props = $props();

  // Newly added (empty) module areas start in the editor.
  let editing = $state(untrack(() => moduleArea.isEmpty));

  function addModule() {
    moduleArea.addModule(new Module('', undefined, undefined, 1, false, false));
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
      <ModuleView {module} onRemove={() => moduleArea.modules.splice(index, 1)} />
    {/each}
  </div>
</div>
