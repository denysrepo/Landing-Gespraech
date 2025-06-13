const { strictEqual } = require('assert');
process.env.BREVO_MOCK = '1';
process.env.BREVO_KEY = 'dummy';
const app = require('./index');

const PORT = 3100;
let server;

(async () => {
  server = app.listen(PORT, () => {
    console.log('Test server started');
  });

  const valid = await fetch(`http://localhost:${PORT}/api/brevo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test@example.com',
      attributes: {
        NAME: 'Test',
        HANDY: '123456',
        OPT_IN: true,
        UTM_SOURCE: 'test',
        UTM_MEDIUM: 'test'
      },
      listIds: [10]
    })
  });
  strictEqual(valid.status, 200, 'valid brevo request returns 200');

  const invalid = await fetch(`http://localhost:${PORT}/api/brevo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
  strictEqual(invalid.status, 400, 'missing fields returns 400');

  console.log('All tests passed');
  server.close();
})().catch(err => {
  console.error(err);
  if (server) server.close();
  process.exit(1);
});
