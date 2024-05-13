<script>
	import { FileDropzone } from '@skeletonlabs/skeleton';
	import { uploadSummarization } from '../../routes/api/uploadFile.js';
	import ReviewComponent from './ReviewComponent.svelte';
	import { Rating, Summaries, Summary } from '../../routes/home/SummaryStore';
	/**
	 * @type {{ isAdmin: string ; username: string; token: string , userList:Array<string>}}
	 */
	export let data;

	/**
	 * @type {FileList}
	 */
	let file;
	let exampleCode = {
		content: [
		{
			code: 'your code here',
			completions: [
				{ model: 'model name', text: 'completion text' },
				{ model: 'model name', text: 'completion text' }
			]
		}
		]
	};
	let uploadedFile = false;
	/**
	 * @type {any[]}
	 */
	let uploadedPairs = [];

	async function onUpload() {
		// get the text content of the file;
		let text = await file[0].text();
		try {
			/**
			 * @type {{code: string, completions: {model: string, text: string}[]}[]}
			 */
			let json = JSON.parse(text).contents;
			if (
				json[0].code &&
				json[0].completions
			) {
				for (let i = 0; i < json.length; i++) {
					uploadedPairs.push({code: json[i].code, summaries: extractSummaries(json[i].completions)});
				}
				uploadedFile = true;
				// @ts-ignore
				document.querySelector('pre').innerHTML = "";
			} else {
				alert('invalid json format');
			}
		} catch (e) {
			alert('json parse failed: ' + e);
		}
	}

	/**
	 * @param {{model: string, text: string}[]} content
	 */
function extractSummaries(content) {
	/**
	 * @type {Summary[]}
	 */
	let summaries = [];
	for (let i = 0; i < content.length; i++) {
		let summary = new Summary(content[i].text, content[i].model);
		summaries.push(summary);
	}
	return summaries;
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
	<p class="text-error-500">Uploaded File with {uploadedPairs.length} pairs!</p>
	{#each uploadedPairs as pair}
		<div class="card w-full space-y-4 p-4">
			{pair.code}
			<ReviewComponent {data} listOfSummarizedCode = {pair.summaries} override={true} originalCode={pair.code}/>
		</div>
		<br>
	{/each}
{/if}
