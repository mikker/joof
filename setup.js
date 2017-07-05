const execa = require("execa");
const Listr = require("Listr");
const path = require("path");
const fs = require("fs");
const home = require("user-home");

module.exports = setup;

function setup(flags) {
  const tasks = new Listr([
    {
      title: "Create ~/.joof",
      skip: () => fileExists(flags.joofDir),
      task: () => createJoofDir(flags)
    },
    {
      title: "Install background service",
      skip: flags.skipService,
      task: () => installService(flags)
    },
    {
      title: "Install self-signed certificate for localhost",
      skip: flags.skipCert,
      task: () => installCert(flags)
    }
  ]);

  function createJoofDir(flags) {
    return execa("mkdir", ["-p", flags.joofDir]).then(
      fs.writeFileSync(
        path.join(flags.joofDir, "global.js"),
        'console.log("%cjoof is ready to go!", "color: green")',
        "utf-8"
      )
    );
  }

  function installService(flags) {
    let plist = fs.readFileSync(
      path.join(__dirname, "support", "com.brnbw.joof.plist"),
      "utf-8"
    );

    plist = plist.replace("{NODE_PATH}", flags.nodePath);
    plist = plist.replace("{CLI_PATH}", flags.cliPath);
    plist = plist.replace("{JOOF_DIR}", flags.joofDir);

    const plistDest = path.join(
      home,
      "Library",
      "LaunchAgents",
      "com.brnbw.joof.plist"
    );

    fs.writeFileSync(plistDest, plist, "utf-8");

    return execa("launchctl", ["load", plistDest]);
  }

  function installCert(flags) {
    return execa("sudo", [
      "security",
      "add-trusted-cert",
      "-d",
      "-p",
      "ssl",
      "-k",
      "/Library/Keychains/System.keychain",
      path.join(__dirname, "support", "self-signed.crt")
    ]).stdout.pipe(process.stdout);
  }

  return tasks.run();
}

function fileExists(path) {
  try {
    fs.accessSync(path);
    return true;
  } catch (err) {
    if (err.code === "ENOENT") return false;
    throw err;
  }
}
