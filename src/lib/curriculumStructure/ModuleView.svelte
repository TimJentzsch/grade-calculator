<script lang="ts">
	import Card from '$lib/Card.svelte';
	import type { Module } from '$types/curriculumStructure';

	/** The module to display. */
	export let module: Module;
</script>

<Card>
	<div class="outer">
		<span class="name">{module.name}</span>
		<div class="controls" />
	</div>
</Card>
