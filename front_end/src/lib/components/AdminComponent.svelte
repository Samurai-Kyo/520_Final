<script>
	import {
		makeAdmin,
		// createUser,
		// getUsers,
		deleteUser,
		changePassword
	} from '../../routes/api/admin.js';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import CreateAccountFields from './CreateAccountFields.svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';

	const modalStore = getModalStore();

	/**
	 * @type {{ isAdmin: string ; username: string; token: string , userList:Array<string>}}
	 */
	export let data;
	export let form;

	/**
	 * @param {string} newUsername
	 */
	function changePass(newUsername) {
		new Promise((resolve) => {
			/**
			 * @type {import('@skeletonlabs/skeleton').ModalSettings}
			 */
			const passwordModal = {
				type: 'prompt',
				title: 'Change Password',
				body: 'Please Enter New Password Below',
				response: (r) => resolve(r)
			};
			modalStore.trigger(passwordModal);
		}).then((r) => changePassword(data.username, data.token, r, newUsername));
	}

	/**
	 * @param {string} newAdminName
	 */

	function setAdmin(newAdminName) {
		if (newAdminName === 'admin') {
			alert('You cannot change the admin status of the admin account');
			return;
		} else {
			makeAdmin(data.username, data.token, newAdminName);
		}
	}

	/**
	 * @param {string} toDelete
	 */
	function delUser(toDelete) {
		if (toDelete === 'admin') {
			alert('You cannot delete an admin account. Please contact the server admin if you need to delete an admin account');
			return;
		} else {
			deleteUser(data.username, data.token, toDelete);
			data.userList = data.userList.filter((value) => !(value === toDelete));
		}
	}

	// /**
	//  * @param {string} username
	//  * @param {string} password
	//  */
	// function addUser(username, password) {
	// 	createUser(data.username, data.token, username, password);
	// }
</script>

<div class="flex w-full flex-col p-5" />
<Accordion>
	<AccordionItem>
		<svelte:fragment slot="summary">Add User?</svelte:fragment>
		<svelte:fragment slot="content">
			<CreateAccountFields {form} />
		</svelte:fragment>
	</AccordionItem>
	<AccordionItem>
		<svelte:fragment slot="summary">User List</svelte:fragment>
		<svelte:fragment slot="content">
			{#each data.userList as user}
				<Accordion>
					<AccordionItem>
						<svelte:fragment slot="summary">{user}</svelte:fragment>
						<svelte:fragment slot="content"
							><button class="variant-filled btn" on:click={() => setAdmin(user)}
								>Make Admin?</button
							><button class="variant-filled-error btn" on:click={() => delUser(user)}
								>Delete User?</button
							><button class="variant-filled-warning btn" on:click={() => changePass(user)}
								>Change Password?</button
							></svelte:fragment
						>
					</AccordionItem>
				</Accordion>
			{/each}
		</svelte:fragment>
	</AccordionItem>
</Accordion>
