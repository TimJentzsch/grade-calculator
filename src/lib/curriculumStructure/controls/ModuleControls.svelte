<script lang="ts">
	import type { Module } from '$types/curriculumStructure';

	/** The module to control. */
	export let module: Module;

	$: evaluation = module.evaluation;
</script>

{#if evaluation.type === 'grade'}
	<label>
		Eliminated:
		<input type="checkbox" bind:checked={evaluation.isEliminated} />
	</label>
	<label>
		Grade:
		<input type="number" step="0.1" min="1.0" max="4.0" bind:value={evaluation.grade} />
	</label>
{/if}
