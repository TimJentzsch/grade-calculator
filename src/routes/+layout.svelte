<script lang="ts">
	import Header from '$lib/Header.svelte';
	import Footer from '$lib/Footer.svelte';
	// Global styling
	import '../colors.css';
	import '../app.css';
</script>

<header>
	<div class="inner">
		<Header />
	</div>
</header>

<main>
	<div class="inner">
		<slot />
	</div>
</main>

<footer>
	<div class="inner">
		<Footer />
	</div>
</footer>

<style>
	/* Header and footer styles */
	header {
		background-color: var(--surface-color);
	}

	header > div {
		display: flex;
		align-items: center;
	}

	footer {
		padding-top: 10px;
		padding-bottom: 10px;
	}

	/* Centered content */
	header,
	main,
	footer {
		width: 100%;
	}

	header > .inner,
	main > .inner,
	footer .inner {
		max-width: var(--max-width);
		padding: 5px;
		margin: auto;
	}

	main > .inner {
		height: 100%;
	}

	footer {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* Push footer to bottom */

	main {
		flex-grow: 1;
	}
</style>
