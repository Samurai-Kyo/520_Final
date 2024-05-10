<script >
  export let form;
</script>

<!-- create flex div -->
<div class="flex justify-center p-4">
	<!-- create card component  -->
	<div class="card w-1/2 space-y-4 p-4">
		<!-- form html -->
		<form method="post">
      	{#if form?.success}<p class="text-success-500">Successfully created!</p>{/if}
			<label class="label">
				<span>Username</span>
				<input class="input p-2" name='Username' value={form?.username ?? ''}>
			</label>
			<label class="label">
				<span>Password</span>
				<input class="input p-2" type="password" name='Password'/>
			</label>
			<div class="flex justify-around">
				<button formaction="?/register" type="submit" class="btn variant-filled-primary">Create Account</button>
			</div>
		</form>
	</div>
</div>
