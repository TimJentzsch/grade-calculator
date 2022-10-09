<script lang="ts">
	import Card from '$lib/Card.svelte';
	import type { Curriculum } from '$types/curriculumStructure';
	import ModuleAreaView from './ModuleAreaView.svelte';

	/** The module area to display. */
	export let curriculum: Curriculum;
</script>

<Card>
	<div class="content">
		<div class="header">
			<h2>{curriculum.name}</h2>
		</div>
		<div class="moduleAreas">
			{#each curriculum.moduleAreas as moduleArea}
				<ModuleAreaView {moduleArea} />
			{/each}
		</div>
	</div>
</Card>

<style>
	.content {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.moduleAreas {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}
</style>
