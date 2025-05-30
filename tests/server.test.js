const assert = require('node:assert');
const { test } = require('node:test');
const { startServer } = require('../server');
const path = require('node:path');
const fs = require('node:fs');

async function fetchText(port, route) {
  const res = await fetch(`http://localhost:${port}${route}`);
  const text = await res.text();
  return { status: res.status, text, headers: res.headers };
}

async function withServer(testFn) {
  return new Promise((resolve, reject) => {
    const srv = startServer(0, async () => {
      try {
        const port = srv.address().port;
        await testFn(port);
        srv.close(resolve);
      } catch (err) {
        srv.close(() => reject(err));
      }
    });
  });
}

test('serves index.html at /', async () => {
  await withServer(async port => {
    const { status, text, headers } = await fetchText(port, '/');
    const expected = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
    assert.strictEqual(status, 200);
    assert.strictEqual(headers.get('content-type'), 'text/html');
    assert.strictEqual(text, expected);
  });
});

test('serves style.css with correct content type', async () => {
  await withServer(async port => {
    const { status, headers } = await fetchText(port, '/style.css');
    assert.strictEqual(status, 200);
    assert.strictEqual(headers.get('content-type'), 'text/css');
  });
});

test('returns 404 for missing file', async () => {
  await withServer(async port => {
    const { status } = await fetchText(port, '/nope.txt');
    assert.strictEqual(status, 404);
  });
});
