<script>
	import { FileDropzone } from '@skeletonlabs/skeleton';
	import { Summary } from '../../routes/home/SummaryStore';
	import ReviewComponent from './ReviewComponent.svelte';
	import { Summaries } from '../../routes/home/SummaryStore';

	/**
	 * @type {{ isAdmin: string ; username: string; token: string , userList:Array<string>}}
	 */
	export let data;

	/**
	 * @type {Summaries[]}
	 */
	let listOfListOfSummarizedCode;

	/**
	 * @type {Summary[]	}
	 */
	let listOfSummarizedCode;

	/**
	 * @type {FileList}
	 */
	let file;
	let exampleCode = [
		{
			code: 'your code here',
			summaries: [
				{
					apiName: 'model name',
					summary: 'completion text'
				},
				{
					apiName: 'model name',
					summary: 'completion text'
				}
			]
		},
		{
			code: 'your code here',
			summaries: [
				{
					apiName: 'model name',
					summary: 'completion text'
				},
				{
					apiName: 'model name',
					summary: 'completion text'
				}
			]
		}
	];
	let uploadedFile = false;

	function toggle() {
		uploadedFile = !uploadedFile;
	}

	function createSummaries() {
		let newSummaries = new Summaries();
		listOfListOfSummarizedCode.forEach((summaries) => {
			// console.log(summaries);
			for (let i = 0; i < summaries.summaries.length; i++) {
				let summary = summaries.summaries[i];
				newSummaries.addSummary({ summary: summary.summary, model: summary.apiName });
			}
		});
		listOfSummarizedCode = newSummaries.getSummaries();
		console.log(listOfSummarizedCode);
	}

	async function onUpload() {
		// get the text content of the file;
		let text = await file[0].text();
		try {
			/**
			 * @type {Summaries[] }
			 */
			let json = await JSON.parse(text);
			if (json.length > 0) {
				listOfListOfSummarizedCode = json;
				// console.log(listOfListOfSummarizedCode);
				createSummaries();
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
	{#if uploadedFile === false}
		<pre>{JSON.stringify(exampleCode, null, 2)}</pre>
	{/if}
</div>
<div class="flex flex-col justify-center p-4">
	<FileDropzone class="w-full p-4" name="files" bind:files={file} on:change={onUpload}>
		<svelte:fragment slot="message">Upload File of Code Summarization Pairs</svelte:fragment>
	</FileDropzone>
</div>
<button class="variant-filled-secondary btn w-1/4" on:click={() => toggle()}>Send Review</button>
{#if uploadedFile}
	<p class="text-error-500">Uploaded File!</p>
	<ReviewComponent {data} {listOfSummarizedCode} />
{/if}
