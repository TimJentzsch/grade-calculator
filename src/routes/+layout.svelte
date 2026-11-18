<script lang="ts">
  import type { Snippet } from 'svelte';
  import { asset } from '$app/paths';
  import '../app.css';

  const { children }: { children: Snippet } = $props();
</script>

<header>
  <div id="header-content">
    <h1>Grade Calculator</h1>
    <a
      href="https://github.com/TimJentzsch/grade-calculator"
      title="Check out the project on GitHub"
    >
      <img width="35" height="35" src={asset('github-icon.png')} alt="GitHub icon" />
    </a>
  </div>
</header>

{@render children()}
