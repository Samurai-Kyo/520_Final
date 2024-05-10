<script>
	export let data;
  export let form;
	import { TabGroup, Tab, TabAnchor } from '@skeletonlabs/skeleton';
	import CodeSummaryComponent from '$lib/components/CodeSummaryComponent.svelte';
	import FileUploadComponent from '$lib/components/FileUploadComponent.svelte';
	import AdminComponent from '$lib/components/AdminComponent.svelte';
	let currentTab = 0;
	//Admin Flag
	let isAdmin = data.isAdmin;

</script>

<TabGroup justify="justify-center">
	<Tab bind:group={currentTab} name="Summarizer" value={0}>Summarizer</Tab>
	<Tab bind:group={currentTab} name="fileUploader" value={1}>Upload File</Tab>
	{#if isAdmin}
		<Tab bind:group={currentTab} name="fileUploader" value={2}>Admin</Tab>
	{/if}
	<svelte:fragment slot="panel">
		{#if currentTab === 0}
			<CodeSummaryComponent />
		{:else if currentTab === 1}
			<FileUploadComponent />
		{:else if currentTab === 2}
			<AdminComponent data={data} form={form}/>
		{/if}
	</svelte:fragment>
</TabGroup>
