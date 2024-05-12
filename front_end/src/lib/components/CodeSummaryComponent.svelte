<script>
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { Ratings } from '@skeletonlabs/skeleton';
	import { Store, Summary, Rating } from '../../routes/home/SummaryStore';
	import { summarizeCode, createReview } from '../../routes/api/summarizer.js';
	import { Summaries } from '../../routes/home/SummaryStore';

	/**
	 * @type {{ isAdmin: string ; username: string; token: string , userList:Array<string>}}
	 */
	export let data;
	// True when waiting for summaries
	let gettingSummaries = false;

	// Number of reviews to get
	let reviewCount = 1;

	//language dropdown
	let codeLanguage = 'javascript';

	// code input
	let code = '';
	
	// ID Of the Summaries
	let id = 0;

	/**
	 * @type {Summary[]}
	 */
	let listOfSummarizedCode = [];

	Store.subscribe((_summaries) => {
		listOfSummarizedCode = _summaries.getSummaries();
		id = _summaries.id;
		console.log('Store updated');
		console.log(JSON.stringify(listOfSummarizedCode));
	});

	/**
	 * @returns {Promise<void>}
	 */
	async function summarize() {
		console.log('Summarize');
		gettingSummaries = true;
		try {
			if (!code || !codeLanguage) {
				alert('Please enter code and select a language');
				gettingSummaries = false;
				return;
			}

			const username = data.username;
			const token = data.token;
			// @ts-ignore
			const summaries = await summarizeCode(username, token, code, codeLanguage, reviewCount);
			if (!summaries) {
				alert('Failed to summarize code.');
				gettingSummaries = false;
				return;
			}
			// Replace old summaries
			let newSummaries = new Summaries([], summaries.summariesID);
			console.log('Summaries: ------- ' + JSON.stringify(summaries));
			summaries.summaries.forEach((summary) => {
				newSummaries.addSummary(summary);
			});
			Store.set(newSummaries);
			gettingSummaries = false;
			return;
		} catch (e) {
			alert(e);
			gettingSummaries = false;
			return;
		}
	}
	async function sendReview() {
		const username = data.username;
		const token = data.token;
		let ratings = []
		for (let i = 0; i < listOfSummarizedCode.length; i++) {
			ratings.push(listOfSummarizedCode[i].rating)
		}
		createReview(username, token, id, ratings);
	}
</script>

<style>
	.bg-ourPageLighter {
		background-color: rgb(59 130 246 / 0.1)
	}
	.outline-ourPage {
		border: 2px solid;
		border-color: rgb(59 130 246 / 0.1);
		border-radius: 6px;
	}
</style>

<div class="flex-col justify-center p-4">
	<!-- input box area -->
	<div class="card w-full space-y-4 p-4">
		<form>
			<textarea class="textarea p-4" placeholder="Paste Code Here" name="code" bind:value={code} />
			<div class="flex justify-between ml-4 mr-4">
				<div class="flex justify-start w-1/6">
					<label for="review count" class="p mr-1">Review Count</label>
					<select class="select w-1/3 p-1" name="review count" bind:value={reviewCount}>
						<option value={1}>1</option>
						<option value={2}>2</option>
						<option value={3}>3</option>
						<option value={4}>4</option>
						<option value={5}>5</option>
						<option value={6}>6</option>
						<option value={7}>7</option>
						<option value={8}>8</option>
						<option value={9}>9</option>
						<option value={10}>10</option>
					</select>
				</div>

				<div class="flex justify-start w-1/2">
					<label for="codeLanguage" class="p mr-1">Language</label>
					<select class="select w-1/4 p-1" name="codeLanguage" bind:value={codeLanguage}>
						<option value={'Javascript'}> Javascript </option>
						<option value={'Typescript'}> Typescript </option>
						<option value={'Java'}> Java</option>
						<option value={'C#'}> C#</option>
						<option value={'C++'}> C++</option>
						<option value={'PHP'}> PHP</option>
						<option value={'Swift'}> Swift</option>
						<option value={'Ruby'}> Ruby</option>
					</select>
				</div>

				<button type="submit" class="variant-filled-secondary btn" on:click={() => summarize()}
					>Submit</button
				>
			</div>
		</form>
	</div>

	{#if gettingSummaries}<p class="text-error-500">Generating Summaries!</p>{/if}
	<!-- Show the summarizations -->
	{#if listOfSummarizedCode.length > 0}
		<div class="card w-full space-y-4 p-4">
			<Accordion>
				{#each listOfSummarizedCode as summary }
					<AccordionItem>
						<svelte:fragment slot="summary">{#if summary.rating.isFavorite}<b>{summary.apiName}</b>{/if} {#if !summary.rating.isFavorite}{summary.apiName}{/if}</svelte:fragment>
						<svelte:fragment slot="content">
							<div class="flex flex-col items-center">
								<p class="text-lg italic">{summary.summary}</p>
								<!-- Evaluate Dropdown -->
								<Accordion>
									<AccordionItem>
										<svelte:fragment slot="summary">Click To Evaluate</svelte:fragment>
										<svelte:fragment slot="content">
											<!-- Ratings for each summary -->
											<div class="ml-4 outline-ourPage">
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
												<span class="flex bg-ourPageLighter">
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
											<button
												class="variant-filled-secondary btn w-1/4"
												on:click={() => sendReview()}>Send Review</button
											>
											<button
												class="variant-filled-secondary btn w-1/4"
												on:click={() => summary.rating.isFavorite = !summary.rating.isFavorite}>Toggle Favorite
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
	{/if}
</div>
