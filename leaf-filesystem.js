const utils = require("./datautils"); // Patch our arrays to have binary searching
var config = require("./config");
const Endb = require("endb");
function blank(e = null) {
  // Do nothing basically
}
class VFS {
  constructor(uri, namespace, ref_namespace) {
    if (!uri) {
      uri = config.leaf.db;
    }
    if (!namespace) {
      namespace = config.leaf.namespace;
    }
    if (!ref_namespace) {
      ref_namespace = config.leaf.ref_namespace;
    }
    this.db = new Endb({ uri: uri, namespace: namespace });
    //this.ref_db = new Endb({uri: uri, namespace: ref_namespace});
    this.prefix = config.leaf.prefix;
    this.split = config.leaf.split;
  }
  splitPath(path) {
    return path.substring(this.split.length).split(this.split);
  }
  joinPath(splited) {
    return this.prefix + splited.join(this.split);
  }
  async exists(path) {
    return await this.db.has(path);
  }
  async isDirectory(path) {
    if(!(await this.exists(path))){
      return false;
    }
    return (await this.db.get(path))["type"] === "directory";
  }
  async isFile(path) {
    if(!(await this.exists(path))){
      return false;
    }
    return (await this.db.get(path))["type"] === "file";
  }
  async rename(before, after, callback = blank) {
    if (!(await this.exists(before))) {
      throw before + " does not exist";
    }
    let data = await this.db.get(before);
    let bpath = this.splitPath(before);
    bpath = utils.patchArr(bpath);
    let apath = this.splitPath(before);
    apath = utils.patchArr(apath);
    data["children"].splice(data["children"].binarySearch(bpath[-1]), 1);
    data["children"].binaryInsert(apath[-1]);
    await this.db.set(apath, await this.db.get(bpath));
    this.db.delete(bpath);
    callback();
  }
  async mkdir(path, callback = blank) {
    if (await this.exists(path)) {
      throw "A directory or file already exists with that name";
    }
    await this.db.set(path, {
      type: "directory",
      children: []
    });
    callback();
  }
  async rmdir(path, callback = blank){
     if (!await this.exists(path)) {
      throw "Directory doesn't exist";
    }
    await this.db.delete(path);
    callback();
  }
  async listdir(path, callback = blank){
    if (!await this.exists(path)) {
      throw "Directory doesn't exist";
    }
    let listing = await this.db.get(path)["children"];
    callback(listing)
  }
  async readFile(path, callback = blank) {
    if (!(await this.exists(path))) {
      throw "File not found";
    }
    let content = (await this.db.get(content))["data"];
    callback(content);
    return content;
  }
  async writeFile(path, data, callback = blank) {
    await this.db.ensure(path, {type: "file", data:""});
    let file = await this.db.get(path);
    file["data"] = data;
    await this.db.set(path, file);
    callback();
  }
}
var defaultFS = new VFS();
class Directory {
  constructor(path, fs = defaultFS) {
    if (!path) {
      var path = "/";
    }
    this.fs = fs;
    this.path = path;
  }
}
class File {
  constructor(path, fs = defaultFS) {
    if (!path) {
      throw "No path specified to construct file"
    }
    this.fs = fs;
    this.path = path;
  }
}
