const utils = require("./datautils"); // Patch our arrays to have binary searching
var config = require("./config");
const Endb = require("endb");
var deasync = require('deasync');
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
    // this.outer_db = new Endb(uri);
    this.db = new Endb({ uri: uri, namespace: namespace });
    //this.ref_db = new Endb({uri: uri, namespace: ref_namespace});
    this.prefix = config.leaf.prefix;
    this.split = config.leaf.split;
  }
  async importObject(obj, prefix){
    // DFS import, probaly deprecate it sometime and put BFS
    var l = Object.keys(obj);
    for(var i = 0; i < l.legnth; i ++){
      if((typeof obj[l[i]]) == "string"){
        await this.writeFile(prefix+this.split+l[i],obj[l[i]]);
      }else{
        await this.mkdir(obj+this.split+l[i]);
        await this.importObject(obj[l[i]],obj+this.split+l[i])
      }
    }
  }
  async setupRoot(){
    if(await this.isDirectory(this.prefix)){
      throw "For safety reasons setting up the root directory has been aborted because it already exists. ";
    }
    await this.db.set(this.prefix, {
      type: "directory",
      children: []
    })
  }
  async isSetup(){
    return await this.isDirectory(this.prefix);
  }
  splitPath(path) {
    return path.substring(this.split.length).split(this.split);
  }
  joinPath(splited) {
    return this.prefix + splited.join(this.split);
  }
  sepParent(path) {
    let splitedPath = this.splitPath(path);
    splitedPath = utils.patchArr(splitedPath); // Enable accessing last element through negatives
    return [this.joinPath(splitedPath.slice(0, -1)), this.joinPath[-1]];
  }
  mergeParent(path, file) {
    return path + this.split + file;
  }
  isRelative(path){
    return !path.startsWith(this.split);
  }
  ensureAbsolute(path, pwd = this.prefix){
    if(this.isRelative(path)){
      return pwd+this.split+path
    }else{
      return path;
    }
  }
  removeTrailing(path){
    if(path.endsWith(this.split)){
      return path.substring(0,path.length-1);
    }
    return path;
  }
  async exists(path) {
    return await this.db.has(path);
  }
  async isDirectory(path) {
    if (!(await this.exists(path))) {
      return false;
    }
    return (await this.db.get(path))["type"] === "directory";
  }
  async isFile(path) {
    if (!(await this.exists(path))) {
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
    parent["children"].splice(data["children"].binarySearch(bpath[-1]), 1);
    parent["children"].binaryInsert(apath[-1]);
    await this.db.set(apath, await this.db.get(bpath));
    this.db.delete(bpath);
    callback();
  }
  parentOf(path){
    return this.sepParent(path)[0];
  }
  async mkdir(path, callback = blank) {
    if (await this.isDirectory(path)) {
      throw "A directory or file already exists with that name";
    }
    await this.db.set(path, {
      type: "directory",
      children: []
    });
    let parent = this.parentOf(path);
    if(this.isDirectory(path)){
      
    }else{
      throw "Parent directory doesn't exist"; 
    }
    callback();
  }
  async rmdir(path, callback = blank) {
    if (!(await this.isDirectory(path))) {
      throw "Directory doesn't exist";
    }
    await this.db.delete(path);
    callback();
  }
  async listdir(path, callback = blank) {
    if (!(await this.isDirectory(path))) {
      throw "Directory doesn't exist";
    }
    let listing = (await this.db.get(path))["children"];
    callback(listing);
    return listing;
  }
  async readFile(path, callback = blank) {
    if (!(await this.isFile(path))) {
      throw "File not found";
    }
    let content = (await this.db.get(content))["data"];
    callback(content);
    return content;
  }
  async writeFile(path, data, callback = blank) {
    await this.db.ensure(path, { type: "file", data: "" });
    let file = await this.db.get(path);
    let parent = await this.db.get(this.sepParent(path)[0]);
    if(utils.bs(file, parent["children"]) < 0){
      parent["children"].binaryInsert(this.sepParent(path)[1]);
    }
    file["data"] = data;
    await this.db.set(path, file);
    callback();
  }
  async deleteFile(path, callback = blank){
    if(this.isFile(path)){
      await this.deleteFile_(path, callback);
    }else{
      throw "Path is not a file";
    }
  }
  async deleteFile_(path, callback = blank){
    await this.db.delete(path);
    callback();
  }
  async getType(path, callback = blank){
    if(!(await this.exists(path))){
      throw "Path doesn't exist"
    }
    let type = (await this.db.get(path))["type"];
    callback(type);
    return type;
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
  async getListing(){
    return await this.fs.listdir(this.path);
  }
  getChildDirectory(path){
    return new Directory(this.fs.ensureAbsolute(path, this.path), this.fs);
  }
  getChildFile(path){
    return new File(this.fs.ensureAbsolute(path, this.path), this.fs);
  }
  async getChild(path){
    let type = this.fs.getType(this.fs.ensureAbsolute(path, this.path));
    if(type == "file"){
      return this.getChildFile(path);
    }else if(type == "directory"){
      return this.getChildDirectory(path);
    }else{
      throw "Unknown File Type"
    }
  }
  
  getParent(){
    return new Directory(this.fs.sepParent(this.path)[0], this.fs);
  }
  get parent(){
    return this.getParent();
  }
  
}
class File {
  constructor(path, fs = defaultFS) {
    if (!path) {
      throw "No path specified to construct file";
    }
    this.fs = fs;
    this.path = path;
  }
  async readFile(){
    return await this.fs.readFile(this.path)
  }
  async writeFile(data){
    await this.fs.writeFile(this.path, data);
  }
  getParent(){
    return new Directory(this.fs.sepParent(this.path)[0], this.fs);
  }
}
module.exports = {File: File, VFS: VFS, Directory: Directory, default_fs: defaultFS}
