<script>
	/**
	 * @type {{ isAdmin: string ; username: string; token: string , userList:Array<string>, firstTimeAdmin: string}}
	 */
	export let data;
	export let form;
	import { TabGroup, Tab, TabAnchor } from '@skeletonlabs/skeleton';
	import CodeSummaryComponent from '$lib/components/CodeSummaryComponent.svelte';
	import FileUploadComponent from '$lib/components/FileUploadComponent.svelte';
	import UserComponent from '$lib/components/UserComponent.svelte';
	import HistoryComponent from '$lib/components/HistoryComponent.svelte';
	import AdminComponent from '$lib/components/AdminComponent.svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	const modalStore = getModalStore();
	let currentTab = 0;
	//Admin Flag
	let isAdmin = data.isAdmin;
	// console.log(data.firstTimeAdmin);
	// console.log(typeof data.firstTimeAdmin);
	if (data.firstTimeAdmin === 'true') {
		currentTab = 2;

		/**
		 * @type {import('@skeletonlabs/skeleton').ModalSettings}
		 */
		const modal = {
			type: 'alert',
			// Data
			title: 'Default Admin Password Detected',
			body: 'Change Your Password!'
		};
		modalStore.trigger(modal);
	}
</script>

<TabGroup justify="justify-center">
	<Tab bind:group={currentTab} name="Summarizer" value={0}>Summarizer</Tab>
	<Tab bind:group={currentTab} name="fileUploader" value={1}>Upload File</Tab>
	<Tab bind:group={currentTab} name="userTab" value={3}>User</Tab>
	<Tab bind:group={currentTab} name="history" value={4}>History</Tab>
	{#if isAdmin}
		<Tab bind:group={currentTab} name="fileUploader" value={2}>Admin</Tab>
	{/if}
	<svelte:fragment slot="panel">
		{#if currentTab === 0}
			<CodeSummaryComponent {data} />
		{:else if currentTab === 1}
			<FileUploadComponent {data} />
		{:else if currentTab === 4}
			<HistoryComponent {data} />
		{:else if currentTab === 2}
			<AdminComponent {data} {form} />
		{:else if currentTab === 3}
			<UserComponent {data} />
		{/if}
	</svelte:fragment>
</TabGroup>
