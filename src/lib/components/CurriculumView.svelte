<script lang="ts">
  import { setEliminationContext } from '#lib/elimination-context.ts';
  import type Curriculum from '#lib/model/curriculum.svelte.ts';
  import AreaHeader from './AreaHeader.svelte';
  import ModuleAreaView from './ModuleAreaView.svelte';

  interface Props {
    curriculum: Curriculum;
  }

  const { curriculum }: Props = $props();

  // Grades can only be eliminated within the Regelstudienzeit
  setEliminationContext(() => curriculum.regelstudienzeit);
</script>

<div id="curriculum" class="curriculum-container">
  <AreaHeader kind="curriculum" area={curriculum} />
  <div class="curriculum-module-area-container">
    {#each curriculum.moduleAreas as moduleArea (moduleArea)}
      <ModuleAreaView {moduleArea} />
    {/each}
  </div>
</div>
