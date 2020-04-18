// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
const path = require("path");
var session = require("express-session");
const exphbs = require("express-handlebars");
app.engine(".html", exphbs({ extname: ".html" }));
app.set("view engine", ".html");

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (req, res) => {
  res.render("");
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
