import test from 'ava'

let adminToken;
let testUserToken;

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

test.serial('/login token correctly invalidates previous token', async t => {

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

test.serial('/login no username', async t => {

  const response = await fetch(`http://localhost:3000/login`, {
    method: 'GET',
    headers: {
      username: "",
      password: "admin123123123123123123123"
    }
  });

  t.is(response.status, 401);
})
test.serial('/login no password', async t => {

  const response = await fetch(`http://localhost:3000/login`, {
    method: 'GET',
    headers: {
      username: "admin",
      password: ""
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


test.serial('/createAccount username already exists', async t => {
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

test.serial('/createAccount no username', async t => {
  const response = await fetch('http://localhost:3000/createAccount/', {
    method: 'GET',
    headers: {
      newUserName: "",
      newPassword: "admin",
      token: "",
      newAdmin: 'false'
    }
  });

  t.is(response.status, 403);

})

test.serial('/createAccount no password', async t => {
  const response = await fetch('http://localhost:3000/createAccount/', {
    method: 'GET',
    headers: {
      newUserName: "admin",
      newPassword: "",
      token: "",
      newAdmin: 'false'
    }
  });

  t.is(response.status, 403);

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

});

test.serial('/checkAdmin no account', async t => {


  const response = await fetch(`http://localhost:3000/checkAdmin`, {
    method: 'GET',
    headers: {
      username: "",
      token: adminToken
    }
  });
  const data = await response.json();
  t.is(data.isAdmin, false);

});

test.serial('/checkAdmin no token', async t => {


  const response = await fetch(`http://localhost:3000/checkAdmin`, {
    method: 'GET',
    headers: {
      username: "",
      token: ""
    }
  });
  const data = await response.json();
  t.is(data.isAdmin, false);

});


test.serial('/makeAdmin succesfully makes admin', async t => {
  const response = await fetch(`http://localhost:3000/makeAdmin`, {
    method: 'POST',
    headers: {
      username: "admin",
      token: adminToken,
      adminName: "testUser"
    }
  });
  t.is(response.ok, true);
});
//
//
test.serial('/makeAdmin admin account succesfully validates', async t => {

  const response = await fetch(`http://localhost:3000/login`, {
    method: 'GET',
    headers: {
      username: "testuser",
      password: "testuser"
    }
  });

  const data = await response.json();
  let newAdminToken = data.token;

  const response2 = await fetch(`http://localhost:3000/checkAdmin`, {
    method: 'GET',
    headers: {
      username: "testuser",
      token: newAdminToken
    }
  });
  const data2 = await response2.json();
  t.is(data2.isAdmin, true);

})
//
test.serial('/makeAdmin fails with bad admin token', async t => {
  const response = await fetch(`http://localhost:3000/makeAdmin`, {
    method: 'POST',
    headers: {
      username: "admin",
      token: "",
      adminName: "testuser"
    }
  });
  t.is(response.status, 403);
});

test.serial('/makeAdmin empty username', async t => {
  const response = await fetch(`http://localhost:3000/makeAdmin`, {
    method: 'POST',
    headers: {
      username: "",
      token: adminToken,
      adminName: "testuser"
    }
  });
  t.is(response.status, 403);
});


test.serial('/changePassword admin succesfully changes password', async t => {

  const response = await fetch(`http://localhost:3000/changePassword`, {
    method: 'GET',
    headers: {
      username: "admin",
      token: adminToken,
      newPassword: "testpassword",
      newUsername: "testuser"
    }
  });
  t.is(response.ok, true);
  const response2 = await fetch(`http://localhost:3000/login`, {
    method: 'GET',
    headers: {
      username: "testuser",
      password: "testpassword"
    }
  });

  const data = await response2.json();
  testUserToken = data.token
  t.is(response2.ok, true);
})

test.serial('/changePassword non admin succesfully changes password', async t => {

  const response = await fetch(`http://localhost:3000/changePassword`, {
    method: 'GET',
    headers: {
      username: "testuser",
      token: testUserToken,
      newPassword: "testpassword1",
      newUsername: "testuser"
    }
  });

  t.is(response.ok, true);

  const response2 = await fetch(`http://localhost:3000/login`, {
    method: 'GET',
    headers: {
      username: "testuser",
      password: "testpassword1"
    }
  });

  t.is(response2.ok, true);




})
test.serial('/changePassword fails with empty username', async t => {

  const response = await fetch(`http://localhost:3000/changePassword`, {
    method: 'GET',
    headers: {
      username: "admin",
      token: adminToken,
      newPassword: "testpassword",
      newUsername: ""
    }
  });
  t.is(response.status, 403);
})
test.serial('/changePassword fails with empty password', async t => {

  const response = await fetch(`http://localhost:3000/changePassword`, {
    method: 'GET',
    headers: {
      username: "admin",
      token: adminToken,
      newPassword: "",
      newUsername: "testuser"
    }
  });
  t.is(response.status, 403);
})
//
//
//
test.serial('/deleteUser fails if token is not correct', async t => {

  const response = await fetch(`http://localhost:3000/deleteUser`, {
    method: 'GET',
    headers: {
      username: "admin",
      token: "",
      toDelete: "admin"
    }
  });

  t.is(response.status, 403);
});


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

<<<<<<< HEAD
=======
test.serial('/getUsers returns correct status code and type', async t => {
  
    const response = await fetch(`http://localhost:3000/getUsers`, {
      method: 'GET',
      headers: {
        username: "admin",
        token: adminToken
      }
    });
    const data = await response.json();
    t.is(response.ok, true);
    t.true(Array.isArray(data.userList));
    if(data.userList.length > 0){
      t.true(data.userList[0] != undefined);
    }
})

test.serial('/getUsers fails with bad token', async t => {

      const response = await fetch(`http://localhost:3000/getUsers`, {
        method: 'GET',
        headers: {
          username: "admin",
          token: ""
        }
      });
      t.is(response.status, 403);
})

test.serial('/summarize code returns correct status code and type', async t => {
  const response = await fetch(`http://localhost:3000/summarize/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      username: "admin",
      token: adminToken,
      debug: true
    },
    body: JSON.stringify({ code: "console.log('hello world')", models: "gpt-4-turbo" })
  });

  const data = await response.json();
  t.is(response.ok, true);
  t.true(Array.isArray(data));
  if(data.length > 0){
    t.true(data[0] != undefined);
  }
  t.true[data[data.length - 1].id == 0];
})

test.serial('/summarize code fails with bad token', async t => {
  const response = await fetch(`http://localhost:3000/summarize/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      username: "admin",
      token: "",
      debug: true
    },
    body: JSON.stringify({ code: "console.log('hello world')", models: "gpt-4-turbo" })
  });

  t.is(response.status, 401);
})

test.serial('/summarize code fails with badly formed body', async t => {
  const response = await fetch(`http://localhost:3000/summarize/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      username: "admin",
      token: adminToken,
      debug: true
    },
    body: JSON.stringify({ code: "console.log('hello world')" })
  });

  t.is(response.status, 500);
})

test.serial('/uploadSummarization returns correct status code', async t => {
  const response = await fetch(`http://localhost:3000/uploadSummarization/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      username: "admin",
      token: adminToken
    },
    body: JSON.stringify({ code: "console.log('hello world')", completions: [{ model: "gpt-4-turbo", text: "hello world" }], ratings: [{ naturalRating: 5, usefulRating: 5, consistentRating: 5, favorite: true, userNotes: "hello world" }] })
  });

  t.is(response.ok, true);
})

test.serial('/uploadSummarization fails with bad token', async t => {
  const response = await fetch(`http://localhost:3000/uploadSummarization/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      username: "admin",
      token: "",
    },
    body: JSON.stringify({ code: "console.log('hello world')", completions: [{ model: "gpt-4-turbo", text: "hello world" }], ratings: [{ naturalRating: 5, usefulRating: 5, consistentRating: 5, favorite: true, userNotes: "hello world" }] })
  });

  t.is(response.status, 401);
})


test.serial('/getSummarizations returns correct status code and type', async t => {
  const response = await fetch(`http://localhost:3000/getSummarizations/`, {
    method: 'GET',
    headers: {
      username: "admin",
      token: adminToken
    }
  });
  const data = await response.json();
  t.is(response.ok, true);
  t.true(Array.isArray(data));
  if(data.length > 0){
    t.true(data[0] != undefined);
    t.true(data[0].id != undefined);
  }
})

test.serial('/getSummarizations fails with bad token', async t => {
  const response = await fetch(`http://localhost:3000/getSummarizations/`, {
    method: 'GET',
    headers: {
      username: "admin",
      token: "",
      targetUserName: "admin"
    }
  });
  t.is(response.status, 401);
})

test.serial('/getSummarizations falls back to own user if targetUsername is blank', async t => {
  const response = await fetch(`http://localhost:3000/getSummarizations/`, {
    method: 'GET',
    headers: {
      username: "admin",
      token: adminToken,
      targetUserName: ""
    }
  });
  t.is(response.status, 200);
})

test.serial('/getSummarizations returns no results for a bad username', async t => {
  const response = await fetch(`http://localhost:3000/getSummarizations/`, {
    method: 'GET',
    headers: {
      username: "admin",
      token: adminToken,
      targetUserName: "badusernamethatdoesn'texistandneverwould1"
    }
  });
  const data = await response.json();
  t.is(response.ok, true);
  t.true(Array.isArray(data));
  t.true(data.length == 0);
})

test.serial('/setRating should block users from rating others\' ratings.', async t => {
  const response = await fetch(`http://localhost:3000/setRating/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      username: "admin",
      token: adminToken,
      id: "55" // This ID is of a rating made by a different user (nickkenney)
    },
    body: JSON.stringify({ ratings: [{ naturalRating: 5, usefulRating: 5, consistentRating: 5, favorite: true, userNotes: "hello world" }] })
  });

  t.is(response.status, 403);
})

test.serial('/stats returns correct status code and type', async t => {
  const response = await fetch(`http://localhost:3000/stats`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      username: "admin",
      token: adminToken
    },
    body: JSON.stringify({ selectedUsers: ["admin"]})
  });
  const data = await response.json();
  t.is(response.ok, true);
  t.true(data.averageNaturalRating != undefined);
  t.true(data.averageUsefulRating != undefined);
  t.true(data.averageConsistentRating != undefined);
})

>>>>>>> ade3d2a1135a180853dee17631aacc074ba0ad3d
