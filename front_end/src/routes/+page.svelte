<script>
	import { browser } from '$app/environment';
	// ...Your other imports

	if (browser) {
		// to prevent error window is not defined, because it's SSR
		window.location.href = '/login';
	}
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
