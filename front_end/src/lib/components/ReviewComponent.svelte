<script>
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { Ratings } from '@skeletonlabs/skeleton';
	import { Store, Summary } from '../../routes/home/SummaryStore';
	import { createReview } from '../../routes/api/summarizer.js';
	import { uploadSummarization } from '../../routes/api/uploadFile';

	/**
	 * @type {{ isAdmin: string ; username: string; token: string , userList:Array<string>}}
	 */
	export let data;

	/**
	 * @type {Summary[]}
	 */
	export let listOfSummarizedCode = [];

	/**
	 * @type {boolean}
	 */
	export let override = false;

	export let originalCode = '';


	// ID Of the Summaries
	let id = 0;
   
	Store.subscribe((_summaries) => {
		if(!override) {
		listOfSummarizedCode = _summaries.getSummaries();
		id = _summaries.id;
		console.log('Store updated');
		console.log(JSON.stringify(listOfSummarizedCode));
		}
	});

	async function sendReview() {
		const username = data.username;
		const token = data.token;
		let ratings = [];
		for (let i = 0; i < listOfSummarizedCode.length; i++) {
			ratings.push(listOfSummarizedCode[i].rating);
		}
		createReview(username, token, id, ratings);
	}
	
	async function upload() {
		const username = data.username;
		const token = data.token;
		let completions = [];
		for (let i = 0; i < listOfSummarizedCode.length; i++) {
			completions.push({"model": listOfSummarizedCode[i].apiName, "text": listOfSummarizedCode[i].summary});
		}
		let reviews = [];
		for (let i = 0; i < listOfSummarizedCode.length; i++) {
			reviews.push({"naturalRating": listOfSummarizedCode[i].rating.nScore, "usefulRating": listOfSummarizedCode[i].rating.uScore, "consistentRating": listOfSummarizedCode[i].rating.cScore, "favorite": listOfSummarizedCode[i].rating.isFavorite, "userNotes": listOfSummarizedCode[i].rating.evalText});
		}
		uploadSummarization(username, token,{"code": originalCode, "completions": completions, "ratings": reviews} );
	}


	console.log(listOfSummarizedCode.length);
</script>

<div class="flex-col justify-center p-4">
	<Accordion>
		{#each listOfSummarizedCode as summary}
			<AccordionItem>
				<svelte:fragment slot="summary"
					>{#if summary.rating.isFavorite}<b>{summary.apiName}</b>{/if}
					{#if !summary.rating.isFavorite}{summary.apiName}{/if}</svelte:fragment
				>
				<svelte:fragment slot="content">
					<div class="flex flex-col items-center">
						<p class="text-lg italic">{summary.summary}</p>
						<!-- Evaluate Dropdown -->
						<Accordion>
							<AccordionItem>
								<svelte:fragment slot="summary">Click To Evaluate</svelte:fragment>
								<svelte:fragment slot="content">
									<!-- Ratings for each summary -->
									<div class="outline-ourPage ml-4">
										<span class="flex pt-3 pb-3">
											<p class="p w-1/3 pl-2">Naturalness? (1-5)</p>
											<Ratings
												bind:value={summary.rating.nScore}
												max={5}
												interactive
												on:icon={(event) => (summary.rating.nScore = event.detail.index)}
											>
												<svelte:fragment slot="empty">○</svelte:fragment>
												<svelte:fragment slot="full">●</svelte:fragment>
											</Ratings>
										</span>
										<span class="bg-ourPageLighter flex pt-3 pb-3">
											<p class="p w-1/3 pl-2">Usefulness? (1-5)</p>
											<Ratings
												bind:value={summary.rating.uScore}
												max={5}
												interactive
												on:icon={(event) => (summary.rating.uScore = event.detail.index)}
											>
												<svelte:fragment slot="empty">○</svelte:fragment>
												<svelte:fragment slot="full">●</svelte:fragment>
											</Ratings>
										</span>
										<span class="flex pt-3 pb-3">
											<p class="p w-1/3 pl-2">Consistent? (1-5)</p>
											<Ratings
												bind:value={summary.rating.cScore}
												max={5}
												interactive
												on:icon={(event) => (summary.rating.cScore = event.detail.index)}
											>
												<svelte:fragment slot="empty">○</svelte:fragment>
												<svelte:fragment slot="full">●</svelte:fragment>
											</Ratings>
										</span>
									</div>
									<!-- User Text Review -->
									<textarea
										class="textarea p-4"
										placeholder="Please give a few lines of feedback"
										bind:value={summary.rating.evalText}
									/>
									{#if !override}
									<button class="variant-filled-secondary btn w-1/4" on:click={() => sendReview()}
										>Send Review</button
									>
									{/if}
									<button
										class="variant-filled-secondary btn w-1/4"
										on:click={() => (summary.rating.isFavorite = !summary.rating.isFavorite)}
										>Toggle Favorite
									</button>
								</svelte:fragment>
							</AccordionItem>
						</Accordion>
					</div>
				</svelte:fragment>
			</AccordionItem>
		{/each}
	</Accordion>
	{#if override}
	<div class="font-semibold outline-ourPage ml-8">
		<p class="pl-2">
			Average Naturalness: {listOfSummarizedCode.reduce((/** @type {any} */ acc, /** @type {{ rating: { nScore: any; }; }} */ val) => acc + val.rating.nScore, 0) / listOfSummarizedCode.length}
		</p>
		<p class="bg-ourPageLighter pl-2">
			Average Usefulness: {listOfSummarizedCode.reduce((/** @type {any} */ acc, /** @type {{ rating: { uScore: any; }; }} */ val) => acc + val.rating.uScore, 0) / listOfSummarizedCode.length}
		</p>
		<p class="pl-2">
			Average Consistency: {listOfSummarizedCode.reduce((/** @type {any} */ acc, /** @type {{ rating: { cScore: any; }; }} */ val) => acc + val.rating.cScore, 0) / listOfSummarizedCode.length}
		</p>
	</div>
	<div class="pt-3 ml-8">
		<button class="variant-filled-secondary btn w-1/4" on:click={() => upload()}>Upload Code and Summaries</button>
	</div>
	{/if}
</div>

<style>
	.bg-ourPageLighter {
		background-color: rgb(59 130 246 / 0.1);
	}
	.outline-ourPage {
		border: 2px solid;
		border-color: rgb(59 130 246 / 0.1);
		border-radius: 6px;
	}
</style>
