<script>
  import { FileDropzone } from '@skeletonlabs/skeleton';

  let file;

  let uploadedFile = false;

  function onUpload(){
    // process file
    //send DB request

  }

</script>


<div class="flex flex-col justify-center p-4">
<FileDropzone class="w-full p-4" name="files" bind:files={file} on:change={onUpload} >
  <svelte:fragment slot="message">Upload File of Code Summarization Pairs</svelte:fragment>
</FileDropzone>
</div>
