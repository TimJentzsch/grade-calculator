<script lang="ts">
	import Card from '$lib/Card.svelte';
	import type { ModuleArea } from '$types/curriculumStructure';
	import ModuleView from './ModuleView.svelte';

	/** The module area to display. */
	export let moduleArea: ModuleArea;
</script>

<Card>
	<div class="content">
		<div class="header">
			<h3>{moduleArea.name}</h3>
		</div>
		<div class="modules">
			{#each moduleArea.modules as module}
				<ModuleView {module} />
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

	.modules {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}
</style>
