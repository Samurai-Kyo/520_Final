<script >
  export let form;
  import { getModalStore } from '@skeletonlabs/skeleton';const modalStore = getModalStore();
  const modal = {
	type: 'alert',
	// Data
	title: 'Change Password Request',
	body: 'Please Contact an Admin to Change Password',
};


</script>

<!-- create flex div -->
<div class="flex justify-center p-4">
	<!-- create card component  -->
	<div class="card w-1/2 space-y-4 p-4">
		<!-- form html -->
		<form method="post">
      	{#if form?.missing}<p class="text-error-500">Missing Username or Password!</p>{/if}
      	{#if form?.noAccount}<p class="text-error-500">Account Not Found!</p>{/if}
      	{#if form?.taken}<p class="text-warning-500">Username is Taken!</p>{/if}
      	{#if form?.success}<p class="text-success-500">Successfully registered!</p>{/if}
			<label class="label">
				<span>Username</span>
				<input class="input p-2" name='Username' value={form?.username ?? ''}>
			</label>
			<label class="label">
				<span>Password</span>
				<input class="input p-2" type="password" name='Password'/>
				<button type="button" class="btn btn-sm variant-filled-" on:click={()=>modalStore.trigger(modal)}>Forgot Password</button>
			</label>
			<div class="flex justify-around">
				<button formaction="?/login" type="submit" class="btn variant-filled-primary">Log In</button>
				<button formaction="?/register" type="submit" class="btn variant-filled-primary">Register</button>
			</div>
		</form>
	</div>
</div>
