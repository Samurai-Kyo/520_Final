<script>
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { fetchHistory } from '../../routes/api/history.js';

	/**
	 * @type {{ isAdmin: string ; username: string; token: string , userList:Array<string>}}
	 */
	export let data;
	export let userName = '';

	let gettingHistory = false;
	/**
	 * @type {any[]}
	 */
	let listOfSummarizes = [];

	async function getHistory() {
		// get the text content of the file;
		gettingHistory = true;
		listOfSummarizes = await fetchHistory(data.username, data.token, userName || data.username);
		console.log(listOfSummarizes);
		gettingHistory = false;
	}
	getHistory();
</script>

<style>
	.item-0 {
		border-radius: 5px
	}
	.item-1 {
		background-color: rgb(59 130 246 / 0.1);
		border-radius: 5px
	}
</style>

<button class="variant-filled-secondary btn" on:click={getHistory}>Refresh History</button>

<div class="flex-col justify-center p-4">
	{#if gettingHistory}<p class="text-error-500">Getting History!</p>{/if}
	<!-- Show the summarizations -->
	{#if listOfSummarizes.length > 0}
		<div class="card w-full space-y-4 p-4">
			<Accordion>
				{#each listOfSummarizes as summary, index}
				<div class="item-{index % 2}">
					<AccordionItem>
						<svelte:fragment slot="summary">{"Code Input: " + summary.code}</svelte:fragment>
						<svelte:fragment slot="content">
							<div class="flex flex-col items-center">
								<!-- Evaluate Dropdown -->
								<Accordion>
									{#each summary.completions.content as review}
										<AccordionItem>
											<svelte:fragment slot="summary">{#if review.favorite}<b>{review.model}</b>{/if} {#if !review.favorite}{review.model}{/if}</svelte:fragment>
											<svelte:fragment slot="content">
												<div class="card w-full space-y-4 p-4">
                                                    <textarea class="textarea p-4" value={review.text} />
													<!-- Each review for each summary -->
													<p class="p">Naturalness? (1-5) = {review.naturalRating}</p>
													<p class="p">Usefulness? (1-5) = {review.usefulRating}</p>
													<p class="p">Consistent? (1-5) = {review.consistentRating}</p>
													<!-- User Text Review -->
													<textarea class="textarea p-4" value={review.userNotes || "No notes written."} />
												</div>
											</svelte:fragment>
										</AccordionItem>
									{/each}
								</Accordion>
							</div>
						</svelte:fragment>
					</AccordionItem>
				</div>
				{/each}
			</Accordion>
		</div>
	{/if}
</div>
