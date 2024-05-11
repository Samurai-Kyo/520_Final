<script>
	export let data;
  export let form;
	import { TabGroup, Tab, TabAnchor } from '@skeletonlabs/skeleton';
	import CodeSummaryComponent from '$lib/components/CodeSummaryComponent.svelte';
	import FileUploadComponent from '$lib/components/FileUploadComponent.svelte';
	import AdminComponent from '$lib/components/AdminComponent.svelte';
  import { getModalStore } from '@skeletonlabs/skeleton';
  const modalStore = getModalStore();
	let currentTab = 0;
	//Admin Flag
	let isAdmin = data.isAdmin;
  console.log(data.firstTimeAdmin);
  console.log(typeof(data.firstTimeAdmin));
  if(data.firstTimeAdmin === "true"){
    currentTab=2;
    const modal= {
	  type: 'alert',
	  // Data
	  title: 'Default Admin Password Detected',
	  body: 'Change Your Password!',
    };
    modalStore.trigger(modal);
  }
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
