<script lang="ts">
	import type { EliminationSettings } from '$types/curriculumStructure';

	/** The number of eliminated modules. */
	export let moduleCount: number;

	/** The number of eliminated CP. */
	export let cpCount: number;

	/** The settings for elimination. */
	export let settings: EliminationSettings;

	let countExceeded = settings.maxCount !== undefined && moduleCount > settings.maxCount;
	let cpExceeded = settings.maxCp !== undefined && cpCount > settings.maxCp;
	let hasExceeded = countExceeded || cpExceeded;
</script>

<span>
	{#if settings.maxCount === 0 || settings.maxCp === 0}
		No elimination allowed
	{:else}
		Elimination:

		{#if settings.maxCp === undefined}
			{cpCount}
		{:else}
			<span class:exceeded={cpExceeded}>
				{cpCount}/{settings.maxCp}
			</span>
		{/if}
		CP,

		{#if settings.maxCount === undefined}
			{moduleCount}
		{:else}
			<span class:exceeded={countExceeded}>
				{moduleCount}/{settings.maxCount}
			</span>
		{/if}
		modules
	{/if}
	{#if hasExceeded}
		(<span class="exceeded">exceeded</span>)
	{/if}
</span>

<style>
	.exceeded {
		color: var(--failure-color);
	}
</style>
