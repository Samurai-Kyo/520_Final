<script>
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { Ratings } from '@skeletonlabs/skeleton';
	import { Store, Summary } from '../../routes/home/SummaryStore';
	import { createReview } from '../../routes/api/summarizer.js';

	/**
	 * @type {{ isAdmin: string ; username: string; token: string , userList:Array<string>}}
	 */
	export let data;

	/**
	 * @type {Summary[]}
	 */
	export let listOfSummarizedCode;

	// ID Of the Summaries
	let id = 0;

	Store.subscribe((_summaries) => {
		listOfSummarizedCode = _summaries.getSummaries();
		id = _summaries.id;
		console.log('Store updated');
		console.log(JSON.stringify(listOfSummarizedCode));
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
										<span class="flex">
											<p class="p w-1/3">Naturalness? (1-5)</p>
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
										<span class="bg-ourPageLighter flex">
											<p class="p w-1/3">Usefulness? (1-5)</p>
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
										<span class="flex">
											<p class="p w-1/3">Consistent? (1-5)</p>
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
									<button class="variant-filled-secondary btn w-1/4" on:click={() => sendReview()}
										>Send Review</button
									>
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
