function log(data){
  console.log(data); // Replacable
}
console.log("Loading config...")
const config = require("./config")
console.log("Starting "+config.brand+" "+config.tyoe+" edition");
var {File, Directory, VFS, default_fs} = require("./leaf-filesystem");
var fs = default_fs;
console.log("File system loaded and mounted");
process.on('SIGTERM', () => {
  console.info('Termiantion Signal Recieved. Shuting down now!');
});
console.log("Shutdown Recovery Enabled");