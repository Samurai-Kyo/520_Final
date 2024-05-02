<script>
 let username = ""; 
 let password = "";


 function createUser(){
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
    <input class="input p-2" type="password" bind:value={password}/>
    <button type="button" class="btn btn-sm variant-filled-secondary">Forgot Password</button>
  </label>
  <div class="flex justify-around">
  <a type="button" class="btn variant-filled-primary" href="/home">Login</a>
  <a type="button" class="btn variant-filled-secondary" href="/register">Register</a>
  </div>
</div>
</div>
