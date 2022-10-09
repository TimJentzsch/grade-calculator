<script lang="ts">
	import Card from '$lib/Card.svelte';
	import type { ModuleArea } from '$types/curriculumStructure';
	import { moduleAreaEliminationCounts } from '$utils/eliminationCounts';
	import EliminationInfo from './EliminationInfo.svelte';
	import ModuleView from './ModuleView.svelte';

	/** The module area to display. */
	export let moduleArea: ModuleArea;

	$: eliminationCounts = moduleAreaEliminationCounts(moduleArea);
</script>

<Card>
	<div class="content">
		<div class="header">
			<div class="info">
				<h3>{moduleArea.name}</h3>
				<div class="elimination">
					<EliminationInfo
						cpCount={eliminationCounts.cpCount}
						moduleCount={eliminationCounts.moduleCount}
						settings={moduleArea.eliminationSettings}
					/>
				</div>
			</div>
			<div class="controls" />
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
