<script>
//langauge 
import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
import { Ratings } from '@skeletonlabs/skeleton';

//langauge dropdown
let selectedLanguage = 'javascript';

// code input 
let code = "";
// show accordian 
let showList = false;


// fill to populate accordian 
//nScore = naturalnessScore, uScore = usefulnessScore, cScore = consistencyScore
let listOfSummerizedCode=[
  {id:0,apiName:"ChatGPT 3.5", summary:"Add API Summary Here", nScore:1,uScore:1,cScore:1,evalText:""},
  {id:1,apiName:"ChatGPT 4", summary:"Add API Summary Here", nScore:1,uScore:1,cScore:1,evalText:""},
  {id:2,apiName:"Claude Opus", summary:"Add API Summary Here", nScore:1,uScore:1,cScore:1,evalText:""},
  {id:3,apiName:"Claude Haiku", summary:"Add API Summary Here", nScore:1,uScore:1,cScore:1,evalText:""}
];






  
function summarizeCode(){
  //todo
  showList = true;
  alert(code + selectedLanguage);
}


function sendReview(nScore,uScore,cScore,evalText){
  //todo
  alert(evalText)
}


</script>




<div class="flex-col justify-center p-4">

<!-- input box area -->
<div class="card p-4 w-full space-y-4 ">
  <textarea class='textarea p-4 ' placeholder="Paste Code Here"  bind:value={code}/>
<div class="flex justify-evenly">
  <select class="select w-1/4 p-1" bind:value={selectedLanguage}>
        <option value={'javascript'}> Javascript </option>
        <option value={'typescript'}> Typesript </option>
        <option value={'cpp'}> C++</option>
  </select>
	<button class="btn variant-filled-secondary" on:click={summarizeCode}>Submit</button>
</div>
</div>

<!-- Show the summerizations -->
{#if showList}
  
<div class="card p-4 w-full space-y-4 ">
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
                  <Ratings bind:value={summary.nScore} max={5} interactive on:icon={(event)=>summary.nScore = event.detail.index}>
	                  <svelte:fragment slot="empty">-</svelte:fragment>
	                  <svelte:fragment slot="full">x</svelte:fragment>
                  </Ratings>
              </span>
              <span>
                  <p class="p">Usefulness? (1-5)</p>
                  <Ratings bind:value={summary.uScore} max={5} interactive on:icon={(event)=>summary.uScore = event.detail.index}>
	                  <svelte:fragment slot="empty">-</svelte:fragment>
	                  <svelte:fragment slot="full">x</svelte:fragment>
                  </Ratings>
              </span>
              <span>
                  <p class="p">Consistent? (1-5)</p>
                  <Ratings bind:value={summary.cScore} max={5} interactive on:icon={(event) => summary.cScore = event.detail.index}>
	                  <svelte:fragment slot="empty">-</svelte:fragment>
	                  <svelte:fragment slot="full">x</svelte:fragment>
                  </Ratings>
              </span>
              <!-- User Text Review -->
              <textarea class='textarea p-4 ' placeholder="Please give a few lines of feedback"  bind:value={summary.evalText}/>
	            <button class="btn variant-filled-secondary w-1/4" on:click={()=>sendReview(summary.nScore,summary.uScore,summary.cScore,summary.evalText)}>Send Review</button>
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
