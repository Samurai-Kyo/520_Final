const app = require('./index.js');
const supertest = require("supertest");
const request = supertest(app);


it('Example Server', async () => {
  const res = await request.get('/login')
    .set({'Accept':'application/json', "username":'admin','password':'admin'});
  expect(res.body.token).not.toBeUndefined();
})
