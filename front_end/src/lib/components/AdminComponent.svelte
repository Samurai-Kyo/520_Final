<script>
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
  import AdminAddUser from './AdminAddUser.svelte';
	let userList = [{ username: 'Nick' }, { username: 'Keith' }];

	function makeAdmin(username) {
		alert(username + " is now Admin!");
	}


</script>

<div class="flex w-full flex-col p-5" />
<Accordion>
	<AccordionItem>
		<svlete:fragment slot="summary">Add User?</svlete:fragment>
		<svelte:fragment slot="content">
			<!-- todo	   -->
      <AdminAddUser/>
		</svelte:fragment>
	</AccordionItem>
	<AccordionItem>
		<svlete:fragment slot="summary">User List</svlete:fragment>
		<svelte:fragment slot="content">
			{#each userList as user}
				<Accordion>
					<AccordionItem>
						<svelte:fragment slot="summary">{user.username}</svelte:fragment>
						<svelte:fragment slot="content"
							><button class="variant-filled btn" on:click={() => makeAdmin(user.username)}
								>Make Admin?</button
							></svelte:fragment
						>
					</AccordionItem>
				</Accordion>
			{/each}
		</svelte:fragment>
	</AccordionItem>
</Accordion>
