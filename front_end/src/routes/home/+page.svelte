<script>
	import { TabGroup, Tab, TabAnchor } from '@skeletonlabs/skeleton';
	let tabNumber = 0;
</script>

<section class="card text-token w-full p-4">
	<TabGroup>
		<!-- Tabs -->
		<Tab bind:group={tabNumber} name="books" value={0}>Books</Tab>
		<Tab bind:group={tabNumber} name="movies" value={1}>Movies</Tab>
		<Tab bind:group={tabNumber} name="tv" value={2}>Television</Tab>
		<!-- Panel -->
		<svelte:fragment slot="panel"></svelte:fragment>
	</TabGroup>
</section>
