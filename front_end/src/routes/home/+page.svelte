<script>
	import { TabGroup, Tab, TabAnchor } from '@skeletonlabs/skeleton';
	import CodeSummComponent from '$lib/components/CodeSummComponent.svelte';
	import FileUploadComponent from '$lib/components/FileUploadComponent.svelte';
	import AdminComponent from '$lib/components/AdminComponent.svelte';
	let currentTab = 0;
	//TODO: server request to check if user is Admin
	//Admin Flag
	let isAdmin = true;
</script>

<TabGroup justify="justify-center">
	<Tab bind:group={currentTab} name="Summarizer" value={0}>Summarizer</Tab>
	<Tab bind:group={currentTab} name="fileUploader" value={1}>Upload File</Tab>
	{#if isAdmin}
		<Tab bind:group={currentTab} name="fileUploader" value={2}>Admin</Tab>
	{/if}
	<svelte:fragment slot="panel">
		{#if currentTab === 0}
			<CodeSummComponent />
		{:else if currentTab === 1}
			<FileUploadComponent />
		{:else if currentTab === 2}
			<AdminComponent />
		{/if}
	</svelte:fragment>
</TabGroup>
