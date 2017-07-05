#!/usr/bin/env node
"use strict";

const meow = require("meow");
const serve = require("./serve");
const setup = require("./setup");
const path = require("path");
const home = require("user-home");

const cli = meow(
  `
  Usage
    $ joof <command>

  Commands
    serve\tRuns the joof daemon
    setup\tSets up the background daemon
    help\tPrints this message

  Examples
    $ joof serve
    $ joof setup \
        --skipService \
        --skipCert \
        --nodePath /usr/local/bin/node \
        --joofDir ~/.joof
`,
  {
    alias: {
      c: "skipCert",
      s: "skipService"
    },
    default: {
      cliPath: __filename,
      joofDir: path.join(home, ".joof"),
      nodePath: "/usr/local/bin/node"
    }
  }
);

switch (cli.input[0]) {
  case undefined:
  case "help":
    cli.showHelp();
    break;
  case "serve":
    serve(cli.flags);
    break;
  case "setup":
    setup(cli.flags);
    break;
}
