<script>
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	let userList = [{ username: 'test' }, { username: 'Hello World' }];

	function makeAdmin(username) {
		alert(username);
	}

	function addUser(username, password) {
		//todo
	}
</script>

<div class="flex w-full flex-col p-5" />
<Accordion>
	<AccordionItem>
		<svlete:fragment slot="summary">Add User?</svlete:fragment>
		<svelte:fragment slot="content">
			<!-- todo	   -->
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
