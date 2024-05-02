<script>
 let username = ""; 
 let password = "";


 function onLogIn(){
   alert("Username: " + username + " Password: " + password + " Added !")
 }

</script>
<!-- create flex div -->
<div class="flex justify-center p-4">
<!-- create card compnenet  -->
<div class="card p-4 w-1/2 space-y-4 ">
<!-- form html -->
  <label class="label ">
    <span>Username</span>
    <input class="input p-2" type="text" bind:value={username}/>
  </label>
  <label class="label ">
    <span>Password</span>
    <input class="input p-2" type="password" bind:value={password}/>
  </label>
  <div class="flex justify-around">
  <a type="button" class="btn variant-filled-primary" on:click={onLogIn}>Add</a>
  </div>
</div>
</div>
