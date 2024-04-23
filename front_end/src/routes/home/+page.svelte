<script>
  import { TabGroup, Tab, TabAnchor } from '@skeletonlabs/skeleton';
  import CodeSummComponent from '$lib/components/CodeSummComponent.svelte';
  import LoginFields from '$lib/components/LoginFields.svelte';
  
  let currentTab = 0;
</script>



<TabGroup justify="justify-center">
  <Tab bind:group={currentTab} name="Summarizer" value ={0}> Summarizer </Tab>
  <Tab bind:group={currentTab} name="fileUploader" value ={1}>Upload File</Tab>
	<svelte:fragment slot="panel">
		{#if currentTab === 0}
      <CodeSummComponent/>
		{:else if currentTab === 1}
      <LoginFields/>
		{/if}
	</svelte:fragment>


</TabGroup>













