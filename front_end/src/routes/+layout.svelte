<script>
	import '../app.pcss';
  import { initializeStores, Modal } from '@skeletonlabs/skeleton';
  initializeStores();
</script>



<Modal />
<div class="flex justify-center bg-transparent p-2">
	<h1 class="h1">
		<span
			class="from-primary-500 to-secondary-300 bg-gradient-to-tr box-decoration-clone bg-clip-text text-transparent"
			>520 Final</span
		>
	</h1>
</div>
<slot></slot>
