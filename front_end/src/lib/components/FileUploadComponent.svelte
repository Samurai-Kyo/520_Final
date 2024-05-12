<script>
	import { FileDropzone } from '@skeletonlabs/skeleton';
	import { uploadSummarization } from '../../routes/api/uploadFile.js';

	/**
	 * @type {{ isAdmin: string ; username: string; token: string , userList:Array<string>}}
	 */
	export let data;

	/**
	 * @type {FileList}
	 */
	let file;
	let exampleCode = {
		code: 'your code here',
		completions: [
			{ model: 'model name', text: 'completion text' },
			{ model: 'model name', text: 'completion text' }
		],
		ratings: [
			{ naturalRating: 0, usefulRating: 0, consistentRating: 0 },
			{ naturalRating: 0, usefulRating: 0, consistentRating: 0 }
		]
	};
	let uploadedFile = false;

	async function onUpload() {
		// get the text content of the file;
		let text = await file[0].text();
		try {
			/**
			 * @type {{code: string, completions: {model: string, text: string}[], ratings: {naturalRating: number, usefulRating: number, consistentRating: number}[]}}
			 */
			let json = JSON.parse(text);
			if (
				json.code &&
				json.completions &&
				json.ratings &&
				(await uploadSummarization(data.username, data.token, json))
			) {
				uploadedFile = true;
			} else {
				alert('invalid json format');
			}
		} catch (e) {
			alert('json parse failed: ' + e);
		}
	}
</script>

<div>
	<h1 class="text-3xl font-bold">Upload File</h1>
	<p class="text-lg">Upload a file containing code summarization pairs</p>
	<pre>{JSON.stringify(exampleCode, null, 2)}</pre>
</div>
<div class="flex flex-col justify-center p-4">
	<FileDropzone class="w-full p-4" name="files" bind:files={file} on:change={onUpload}>
		<svelte:fragment slot="message">Upload File of Code Summarization Pairs</svelte:fragment>
	</FileDropzone>
</div>
{#if uploadedFile === true}
	<p class="text-error-500">Uploaded File!</p>
{/if}
