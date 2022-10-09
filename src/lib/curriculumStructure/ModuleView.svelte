<script lang="ts">
	import Card from '$lib/Card.svelte';
	import type { Module } from '$types/curriculumStructure';
	import ModuleControls from './controls/ModuleControls.svelte';

	/** The module to display. */
	export let module: Module;
</script>

<Card>
	<div class="outer">
		<span class="name">{module.name}</span>
		<div class="controls">
			<ModuleControls {module} />
		</div>
	</div>
</Card>

<style>
	.outer {
		display: flex;
		justify-content: space-between;
	}
</style>
