import test from 'ava'

let adminToken;

test.serial("ava is setup", t => {
  t.pass();
})


//login tests
test.serial('/login admin login', async t => {

  const response = await fetch(`http://localhost:3000/login`, {
    method: 'GET',
    headers: {
      username: "admin",
      password: "admin"
    }
  });

  const data = await response.json();
  adminToken = data.token;
  t.not(data.token, undefined);
  t.is(data.firstTimeAdmin, true);
})

//login tests
test.serial('/login token correctly invalidates', async t => {

  const response = await fetch(`http://localhost:3000/login`, {
    method: 'GET',
    headers: {
      username: "admin",
      password: "admin"
    }
  });

  const data = await response.json();
  const oldToken = adminToken;
  adminToken = data.token;
  t.not(adminToken, oldToken);
})




test.serial('/login No Account', async t => {

  const response = await fetch(`http://localhost:3000/login`, {
    method: 'GET',
    headers: {
      username: "admin1231231231231231",
      password: "admin"
    }
  });

  t.is(response.status, 401);
})

test.serial('/login Wrong Password', async t => {

  const response = await fetch(`http://localhost:3000/login`, {
    method: 'GET',
    headers: {
      username: "admin",
      password: "admin123123123123123123123"
    }
  });

  t.is(response.status, 401);
})



test.serial('/creatAccount succesfull account creation', async t => {
  const response = await fetch('http://localhost:3000/createAccount/', {
    method: 'GET',
    headers: {
      newUserName: "testuser",
      newPassword: "testuser",
      token: "",
      newAdmin: 'false'
    }
  });

  t.is(response.ok, true);

})



test.serial('/createAccount login with new Account ', async t => {

  const response = await fetch(`http://localhost:3000/login`, {
    method: 'GET',
    headers: {
      username: "testuser",
      password: "testuser"
    }
  });

  const data = await response.json();
  t.not(data.token, undefined);
  t.is(data.firstTimeAdmin, false);
})


test.serial('/creatAccount username already exists', async t => {
  const response = await fetch('http://localhost:3000/createAccount/', {
    method: 'GET',
    headers: {
      newUserName: "admin",
      newPassword: "admin",
      token: "",
      newAdmin: 'false'
    }
  });

  t.is(response.status, 400);

})



test.serial('/deleteUser delete testUser', async t => {

  const response = await fetch(`http://localhost:3000/deleteUser`, {
    method: 'GET',
    headers: {
      username: "admin",
      token: adminToken,
      toDelete: "testuser"
    }
  });

  t.is(response.ok, true);


})


test.serial('/checkAdmin admin account succesfully validates', async t => {

  const response = await fetch(`http://localhost:3000/checkAdmin`, {
    method: 'GET',
    headers: {
      username: "admin",
      token: adminToken
    }
  });
  const data = await response.json();
  t.is(data.isAdmin, true);

})

test.serial('/checkAdmin account fails to validate', async t => {

  const response = await fetch(`http://localhost:3000/checkAdmin`, {
    method: 'GET',
    headers: {
      username: "testuser",
      token: adminToken
    }
  });
  const data = await response.json();
  t.is(data.isAdmin, false);

})







