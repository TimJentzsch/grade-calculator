<script lang="ts">
  import { untrack } from 'svelte';
  import type Curriculum from '#lib/model/curriculum.svelte.ts';
  import ModuleArea from '#lib/model/module-area.svelte.ts';
  import AreaEditor from './AreaEditor.svelte';
  import AreaHeader from './AreaHeader.svelte';
  import ModuleAreaView from './ModuleAreaView.svelte';

  interface Props {
    curriculum: Curriculum;
    /** Whether to open the editor right away, e.g. for a new empty curriculum. */
    startEditing?: boolean;
  }

  const { curriculum, startEditing = false }: Props = $props();

  let editing = $state(untrack(() => startEditing));

  /** Module areas added by the user, which start in the editor. */
  const addedModuleAreas = new WeakSet<ModuleArea>();

  function addModuleArea() {
    const moduleArea = new ModuleArea('', []);
    addedModuleAreas.add(moduleArea);
    curriculum.moduleAreas.push(moduleArea);
  }
</script>

<div id="curriculum" class="curriculum-container">
  {#if editing}
    <AreaEditor
      kind="curriculum"
      area={curriculum}
      onSave={() => (editing = false)}
      onDiscard={() => (editing = false)}
    />
  {:else}
    <AreaHeader
      kind="curriculum"
      area={curriculum}
      onAdd={addModuleArea}
      onEdit={() => (editing = true)}
    />
  {/if}
  <div class="curriculum-module-area-container">
    {#each curriculum.moduleAreas as moduleArea, index (moduleArea)}
      <ModuleAreaView
        {moduleArea}
        startEditing={addedModuleAreas.has(moduleArea)}
        onRemove={() => curriculum.moduleAreas.splice(index, 1)}
      />
    {/each}
  </div>
</div>
