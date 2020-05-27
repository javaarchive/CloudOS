// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
const path = require("path");
var session = require("express-session");
const exphbs = require("express-handlebars");
app.engine(".html", exphbs({ extname: ".html" }));
app.set("view engine", ".html");
const {EventListener} = require("./eventlisteners");
let socketListener = new EventListener();
io.on('connection', (socket) => {
  socketListener.trigger(socket);
});
// https://expressjs.com/en/starter/basic-routing.html


// listen for requests :)
const listener = http.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
module.exports = {app: app, io: io, socketListener: socketListener};