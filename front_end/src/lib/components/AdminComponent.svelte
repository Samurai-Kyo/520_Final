<script>
	import { makeAdmin, createUser } from '../../routes/api/admin.js';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	let userList = [{ username: 'test' }, { username: 'Hello World' }];
	/**
	 * @type {{ isAdmin: string ; username: string; token: string }}
	 */
	export let data;

	/**
	 * @param {string} newAdminName
	 */
	function setAdmin(newAdminName) {
		makeAdmin(data.username, data.token, newAdminName);
	}

	/**
	 * @param {string} username
	 * @param {string} password
	 */
	function addUser(username, password) {
		createUser(data.username, data.token, username, password);
	}
</script>

<div class="flex w-full flex-col p-5" />
<Accordion>
	<AccordionItem>
		<svelte:fragment slot="summary">Add User?</svelte:fragment>
		<svelte:fragment slot="content">
			<!-- todo	   -->
		</svelte:fragment>
	</AccordionItem>
	<AccordionItem>
		<svelte:fragment slot="summary">User List</svelte:fragment>
		<svelte:fragment slot="content">
			{#each userList as user}
				<Accordion>
					<AccordionItem>
						<svelte:fragment slot="summary">{user.username}</svelte:fragment>
						<svelte:fragment slot="content"
							><button class="variant-filled btn" on:click={() => setAdmin(user.username)}
								>Make Admin?</button
							></svelte:fragment
						>
					</AccordionItem>
				</Accordion>
			{/each}
		</svelte:fragment>
	</AccordionItem>
</Accordion>
