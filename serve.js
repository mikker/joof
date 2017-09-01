const https = require("https");
const fs = require("fs");
const path = require("path");
const promisify = require("util").promisify;

module.exports = serve;

function serve(flags) {
  const options = {
    key: fs.readFileSync(path.join(__dirname, "support", "self-signed.key")),
    cert: fs.readFileSync(path.join(__dirname, "support", "self-signed.pem"))
  };

  return new Promise(resolve => {
    const handler = createHandler(flags);
    const server = https.createServer(options, handler);

    server.listen(3131, err => {
      if (err) throw err;
      console.log("running on port 3131");
      resolve();
    });

    return server;
  });
}

function createHandler(flags) {
  return (req, res) => {
    if (req.url === "/") {
      res.setHeader("Content-Type", "text/plain");
      res.write("joof is on da roof!");
      res.end();
      return;
    }

    handleUrl(flags, req.url)
      .then(
        body => {
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.setHeader("Content-Type", "text/javascript");
          res.write(body);
          res.end();
        },
        err => {
          res.end();
          throw err;
        }
      )
      .catch(err => {
        res.end();
        throw err;
      });
  };
}

async function handleUrl(flags, url) {
  const globalJsPath = path.join(flags.joofDir, "global.js");

  const jsPath = path.join(flags.joofDir, url);
  const cssPath = jsPath.replace(/\.js$/, ".css");

  let jsContent = (await readFile(globalJsPath)) || "";
  jsContent += ";\n" // make sure that global.js ends with a semicolon
  jsContent += (await readFile(jsPath)) || "";

  const cssContent = await readFile(cssPath);

  if (cssContent) {
    jsContent += injectStyles(cssContent);
  }

  return jsContent;
}

const readFilePromise = promisify(fs.readFile);
async function readFile(path) {
  try {
    const content = await readFilePromise(path);
    return content;
  } catch (err) {
    if (err.code !== "ENOENT") {
      throw err;
    }
    return undefined;
  }
}

function injectStyles(css) {
  return `
function _joofInject() {var d=document;var e = d.createElement('style');e.innerHTML=\`\n${css}\`;d.body.appendChild(e);};_joofInject()`;
}
