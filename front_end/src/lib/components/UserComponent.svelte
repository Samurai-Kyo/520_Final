<script>
	import { changePassword } from '../../routes/api/admin.js';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { getModalStore } from '@skeletonlabs/skeleton';

	const modalStore = getModalStore();

	/**
	 * @type {{ isAdmin: string ; username: string; token: string , userList:Array<string>}}
	 */
	export let data;

	/**
	 */
	function changePass() {
		new Promise((resolve) => {
			/**
			 * @type {import('@skeletonlabs/skeleton').ModalSettings}
			 */
			const passwordModal = {
				type: 'prompt',
				title: 'Change Password',
				body: 'Please Enter New Password Below',
				/**
				 * @param {string} newPassword 
				 **/
				response: (newPassword) => resolve(newPassword)
			};
			modalStore.trigger(passwordModal);
		}).then((newPassword) => changePassword(data.username, data.token, newPassword, data.username));
	}
</script>

<div class="flex w-full flex-col p-5" />
	<div class="flex place-content-center">
		<button class="variant-filled-warning btn" on:click={() => changePass()}>
			Change Password?
		</button>
	</div>
