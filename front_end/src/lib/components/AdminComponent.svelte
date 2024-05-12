<script>
	import {
		makeAdmin,
		deleteUser,
		getAverageScores,
		changePassword
	} from '../../routes/api/admin.js';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import CreateAccountFields from './CreateAccountFields.svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import HistoryComponent from '$lib/components/HistoryComponent.svelte';
	const modalStore = getModalStore();

	/**
	 * @type {string[]}
	 */
	let userList = [];

	/**
	 * @type {{ isAdmin: string ; username: string; token: string , userList:Array<string>}}
	 */
	export let data;
	export let form;
	let summariesCalculated = false;
	let userName = '';
	$: historyObject = [];
	let loadedHistory = false;
	const average = {
		averageNaturalRating: 0,
		averageUsefulRating: 0,
		averageConsistentRating: 0
	};

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
			alert(
				'You cannot delete an admin account. Please contact the server admin if you need to delete an admin account'
			);
			return;
		} else {
			deleteUser(data.username, data.token, toDelete);
			data.userList = data.userList.filter((value) => !(value === toDelete));
		}
	}

	/**
	 * @param {string} username
	 */
	function toggleIfOnList(username) {
		if (userList.includes(username)) {
			userList = userList.filter((value) => !(value === username));
		} else {
			userList.push(username);
		}
	}

	async function getScoreAverage() {
		try {
			const scores = await getAverageScores(data.username, data.token, userList);
			average.averageNaturalRating = scores.averageNaturalRating;
			average.averageUsefulRating = scores.averageUsefulRating;
			average.averageConsistentRating = scores.averageConsistentRating;
			summariesCalculated = true;
			return;
		} catch (e) {
			alert('Error getting average scores: ' + e);
			return;
		}
	}

	async function getUserEvaluations() {
		loadedHistory = false;
		historyObject = [];
		loadedHistory = true;
		historyObject = [userName];
	}
</script>

<div class="flex w-full flex-col p-5" />
<Accordion>
	<AccordionItem>
		<svelte:fragment slot="summary">Add User</svelte:fragment>
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
	<AccordionItem>
		<svelte:fragment slot="summary">Average Evaluation Score</svelte:fragment>
		<svelte:fragment slot="content">
			{#each data.userList as user}
				<div>
					<input type="checkbox" autocomplete="off" on:click={() => toggleIfOnList(user)} />
					{user};
				</div>
			{/each}
			<button>
				<button class="variant-filled-secondary btn" on:click={() => getScoreAverage()}
					>Get Score Average</button
				>
			</button>
			{#if summariesCalculated}
				<div>
					<p class="p">Average Naturalness Rating: {average.averageNaturalRating}</p>
					<p class="p">Average Usefulness Rating: {average.averageUsefulRating}</p>
					<p class="p">Average Consistent Rating: {average.averageConsistentRating}</p>
				</div>
			{/if}
		</svelte:fragment>
	</AccordionItem>
	<AccordionItem>
		<svelte:fragment slot="summary">User Evaluations</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="width-full flex">
				<label for="userEvaluations" class="p">User</label>
			</div>
			<select class="select w-1/4 p-1" name="userEvaluations" bind:value={userName}>
				{#each data.userList as user}
					<option value={user}>{user}</option>
				{/each}
			</select>
				<HistoryComponent {data} {userName} />
		</svelte:fragment>
	</AccordionItem>
</Accordion>
