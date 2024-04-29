<script>
 let username = ""; 
 let password = "";


 function onLogIn(){
   alert("Username: " + username + " Password: " + password)
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
    <input class="input p-2" type="text" bind:value={password}/>
    <button type="button" class="btn btn-sm variant-filled-">Forgot Password</button>
  </label>
  <div class="flex justify-around">
  <button on:click={onLogIn} type="button" class="btn variant-filled-primary ">Log In</button>
  <a type="button" class="btn variant-filled-secondary" href="/register">Register</a>
  </div>
</div>
</div>
