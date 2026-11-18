<script lang="ts">
  import { untrack } from 'svelte';
  import type Curriculum from '#lib/model/curriculum.svelte.ts';
  import ModuleArea from '#lib/model/module-area.svelte.ts';
  import AreaEditor from './AreaEditor.svelte';
  import AreaHeader from './AreaHeader.svelte';
  import ModuleAreaView from './ModuleAreaView.svelte';

  interface Props {
    curriculum: Curriculum;
  }

  const { curriculum }: Props = $props();

  // A new, empty curriculum starts in the editor.
  let editing = $state(untrack(() => !curriculum.name && curriculum.moduleAreas.length === 0));

  function addModuleArea() {
    curriculum.addModuleArea(new ModuleArea('', []));
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
      <ModuleAreaView {moduleArea} onRemove={() => curriculum.moduleAreas.splice(index, 1)} />
    {/each}
  </div>
</div>
