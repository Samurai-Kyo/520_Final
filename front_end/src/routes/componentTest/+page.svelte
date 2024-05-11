<script>
	import CodeSummaryComponent from '$lib/components/CodeSummaryComponent.svelte';
	let data = {
		isAdmin: 'string',
		username: 'string',
		token: 'string',
		userList: ['']
	};
</script>

<CodeSummaryComponent {data} />
