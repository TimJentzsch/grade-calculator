<script lang="ts">
  import { untrack } from 'svelte';
  import type Module from '#lib/model/module.svelte.ts';
  import ModuleDisplay from './ModuleDisplay.svelte';
  import ModuleEditor from './ModuleEditor.svelte';

  interface Props {
    module: Module;
    onRemove: () => void;
  }

  const { module, onRemove }: Props = $props();

  // Newly added (empty) modules start in the editor.
  let editing = $state(untrack(() => module.isEmpty));

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
