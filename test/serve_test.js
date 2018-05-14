const test = require("tape");
const serve = require("../serve");
const got = require("got");
const home = require("user-home");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

async function bootServer() {
  const server = await serve({
    joofDir: `test/fixtures`,
    quiet: true,
    port: 10101
  });
  return server;
}

test("serves index", async t => {
  const server = await bootServer()
  const res = await got("https://localhost:10101/");
  t.equal(res.body, "joof is on da roof!");
  await server.close()

  t.end()
});

test("serves js", async t => {
  const server = await bootServer()
  const res = await got("https://localhost:10101/example.com.js");
  t.equal(res.body, ";\nalert('ok!')\n");
  await server.close()

  t.end()
});

test("serves css", async t => {
  const server = await bootServer()
  const res = await got("https://localhost:10101/css-example.com.js");
  t.assert(res.body.match('body { background: papayawhip; }'))
  await server.close()

  t.end()
})
