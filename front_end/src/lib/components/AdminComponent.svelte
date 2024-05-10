<script>
	import { makeAdmin, createUser,getUsers } from '../../routes/api/admin.js';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
  import CreateAccountFields from './CreateAccountFields.svelte';


	/**
	 * @type {{ isAdmin: string ; username: string; token: string , userList:Array<string>}}
	 */
	export let data;
  export let form;




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
      <CreateAccountFields form = {form}/>
		</svelte:fragment>
	</AccordionItem>
	<AccordionItem>
		<svelte:fragment slot="summary">User List</svelte:fragment>
		<svelte:fragment slot="content">
			{#each data.userList as user}
				<Accordion>
					<AccordionItem>
						<svelte:fragment slot="summary" >{user}</svelte:fragment>
						<svelte:fragment slot="content"
							><button class="variant-filled btn" on:click={() => setAdmin(user)}
								>Make Admin?</button
							></svelte:fragment
						>
					</AccordionItem>
				</Accordion>
			{/each}
		</svelte:fragment>
	</AccordionItem>
</Accordion>
