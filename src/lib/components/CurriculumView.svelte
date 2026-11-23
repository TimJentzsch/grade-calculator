<script lang="ts">
  import type Curriculum from '#lib/model/curriculum.svelte.ts';
  import AreaHeader from './AreaHeader.svelte';
  import ModuleAreaView from './ModuleAreaView.svelte';

  interface Props {
    curriculum: Curriculum;
  }

  const { curriculum }: Props = $props();
</script>

<div id="curriculum" class="curriculum-container">
  <AreaHeader kind="curriculum" area={curriculum} />
  <div class="curriculum-module-area-container">
    {#each curriculum.moduleAreas as moduleArea (moduleArea)}
      <ModuleAreaView {moduleArea} />
    {/each}
  </div>
</div>
