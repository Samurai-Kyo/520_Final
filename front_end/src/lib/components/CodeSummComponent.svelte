<script>
//langauge 
import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';

 let selectedLanguage = 'javascript';
let code = "";
let showList = false;
let listOfSummerizedCode=[
  {id:0,apiName:"ChatGPT 3.5", summary:"hello"},
  {id:1,apiName:"ChatGPT 4", summary:""},
  {id:2,apiName:"Claude Opus", summary:""},
  {id:3,apiName:"Claude Haiku", summary:""}
]
let summerizedCode = [];

  
function summarizeCode(){
  //todo;
  showList = true;
  alert(code + selectedLanguage);
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
	      <button class="btn variant-filled-secondary w-1/4" on:click={summarizeCode}>Endorse</button>
    </div>
    </svelte:fragment>
  </AccordionItem>
  {/each}
  </Accordion>
</div>
{/if}
</div>
