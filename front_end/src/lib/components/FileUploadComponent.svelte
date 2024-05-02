<script>
  import { FileDropzone } from '@skeletonlabs/skeleton';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { Ratings } from '@skeletonlabs/skeleton';
  let file;
  let showList = false;
	let listOfSummerizedCode = [
		{
			id: 0,
			apiName: 'Pair 1',
			summary: 'code ; summary',
			nScore: 1,
			uScore: 1,
			cScore: 1,
			evalText: ''
		},
		{
			id: 1,
			apiName: 'Pair 2',
			summary: 'code ; summary',
			nScore: 1,
			uScore: 1,
			cScore: 1,
			evalText: ''
		},
	];


  let uploadedFile = false;

  function onUpload(){
    // process file
    //send DB request
  }
	function sendReview(nScore, uScore, cScore, evalText) {
		//todo
		alert("Review: " + evalText + " Naturalness: " + nScore + " Usefulness: " + uScore + " Consistency: " + cScore);
	}

</script>


<div class="flex flex-col justify-center p-4">
<FileDropzone class="w-full p-4" name="files" bind:files={file} on:change={onUpload}  on:click={()=>showList = true}>
  <svelte:fragment slot="message">Upload File of Code Summarization Pairs</svelte:fragment>
</FileDropzone>
	{#if showList}
		<div class="card w-full space-y-4 p-4">
			<Accordion>
				{#each listOfSummerizedCode as summary}
					<AccordionItem>
						<svelte:fragment slot="summary">{summary.apiName}</svelte:fragment>
						<svelte:fragment slot="content">
							<div class="flex flex-col items-center">
								{summary.summary}
								<!-- Evaluate Dropdown -->
								<Accordion>
									<AccordionItem>
										<svelte:fragment slot="summary">Click To Evaluate</svelte:fragment>
										<svelte:fragment slot="content">
											<!-- Ratings for each summary -->
											<span>
												<p class="p">Naturalness? (1-5)</p>
												<Ratings
													bind:value={summary.nScore}
													max={5}
													interactive
													on:icon={(event) => (summary.nScore = event.detail.index)}
												>
													<svelte:fragment slot="empty">-</svelte:fragment>
													<svelte:fragment slot="full">x</svelte:fragment>
												</Ratings>
											</span>
											<span>
												<p class="p">Usefulness? (1-5)</p>
												<Ratings
													bind:value={summary.uScore}
													max={5}
													interactive
													on:icon={(event) => (summary.uScore = event.detail.index)}
												>
													<svelte:fragment slot="empty">-</svelte:fragment>
													<svelte:fragment slot="full">x</svelte:fragment>
												</Ratings>
											</span>
											<span>
												<p class="p">Consistent? (1-5)</p>
												<Ratings
													bind:value={summary.cScore}
													max={5}
													interactive
													on:icon={(event) => (summary.cScore = event.detail.index)}
												>
													<svelte:fragment slot="empty">-</svelte:fragment>
													<svelte:fragment slot="full">x</svelte:fragment>
												</Ratings>
											</span>
											<!-- User Text Review -->
											<textarea
												class="textarea p-4"
												placeholder="Please give a few lines of feedback"
												bind:value={summary.evalText}
											/>
                      <div class="flex justify-around">
											<button
												class="variant-filled-secondary btn w-1/4"
												on:click={() =>
													sendReview(
														summary.nScore,
														summary.uScore,
														summary.cScore,
														summary.evalText
													)}>Send Review</button
											>
											<button
												class="variant-filled-secondary btn w-1/4"
												on:click={() =>{ alert("Average Score")}
													}>Get Average</button
											>
                          </div>
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
