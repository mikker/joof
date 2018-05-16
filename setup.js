const execa = require("execa");
const Listr = require("Listr");
const path = require("path");
const fs = require("fs");
const home = require("user-home");
const sudo = require("sudo-prompt");

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
      task: (ctx, task) => installCert(flags).catch(err => task.skip())
    },
    {
      title: "Install Safari extension",
      task: () => installSafariExtension()
    }
  ]);

  return tasks.run();

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
    return new Promise((resolve, reject) => {
      const task = sudo.exec(
        [
          "security add-trusted-cert -d -p ssl -k",
          "/Library/Keychains/System.keychain",
          path.join(__dirname, "support", "self-signed.pem")
        ].join(" "),
        { name: "joof" },
        (err, stdout, stderr) => {
          if (err) reject(err);
          resolve();
        }
      );
    });
  }

  async function installSafariExtension () {
    await execa('cp', [
      path.join(__dirname, 'ext', 'joof.safariextz'),
      path.join(__dirname, 'ext', 'joof-copy.safariextz')
    ])
    return execa('open', [path.join(__dirname, 'ext', 'joof-copy.safariextz')])
  }
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
