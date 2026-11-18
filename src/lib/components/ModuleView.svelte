<script lang="ts">
  import { untrack } from 'svelte';
  import type Module from '#lib/model/module.svelte.ts';
  import ModuleDisplay from './ModuleDisplay.svelte';
  import ModuleEditor from './ModuleEditor.svelte';

  interface Props {
    module: Module;
    /** Whether to open the editor right away, e.g. for a newly added module. */
    startEditing?: boolean;
    onRemove: () => void;
  }

  const { module, startEditing = false, onRemove }: Props = $props();

  let editing = $state(untrack(() => startEditing));

  function discard() {
    if (module.isEmpty) {
      onRemove();
    } else {
      editing = false;
    }
  }
</script>

{#if editing}
  <ModuleEditor {module} onSave={() => (editing = false)} onDiscard={discard} />
{:else}
  <ModuleDisplay {module} onEdit={() => (editing = true)} {onRemove} />
{/if}
