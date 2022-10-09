<script lang="ts">
	import Card from '$lib/Card.svelte';
	import type { Curriculum } from '$types/curriculumStructure';
	import { curriculumEliminationCounts } from '$utils/eliminationCounts';
	import EliminationInfo from './EliminationInfo.svelte';
	import ModuleAreaView from './ModuleAreaView.svelte';

	/** The module area to display. */
	export let curriculum: Curriculum;

	$: eliminationCounts = curriculumEliminationCounts(curriculum);
</script>

<Card>
	<div class="content">
		<div class="header">
			<div class="info">
				<h3>{curriculum.name}</h3>
				<div class="elimination">
					<EliminationInfo
						cpCount={eliminationCounts.cpCount}
						moduleCount={eliminationCounts.moduleCount}
						settings={curriculum.eliminationSettings}
					/>
				</div>
			</div>
			<div class="controls" />
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
