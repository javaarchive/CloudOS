function log(data) {
  console.log(data); // Replacable
}
log("Loading config...");
const config = require("./config");
log("Starting " + config.brand + " " + config.type + " edition");
var { File, Directory, VFS, default_fs } = require("./leaf-filesystem");
var fs = default_fs;
log("File system loaded and mounted");
log("Running FileSystem Setup Asynchronously");
async function setupFS() {
  log("Running async checks");
  let setup = await fs.isSetup();
  log("You are setup: "+setup)
  if (setup == false) {
    log("Starting Setup on FileSystem");
    await fs.setupRoot();
    log("Importing filesystem");
    await fs.importObject(
      {
        home: {
          main: {}
        },
        root: {
          "hello.txt": "Welcome to " + config.brand
        }
      },
      fs.prefix
    );
  } else {
    log("File System check passed");
  }
}
let handlers = {
  shutdown: function(){}
}
setupFS().then(console.log).catch(console.error);
process.on('SIGTERM', () => {
  log('Termiantion Signal Recieved. Shuting down now!');
  handlers.shutdown();
  process.exit(0);
});
log("Shutdown Recovery Enabled");
module.exports = { fs: fs , handlers: handlers};
