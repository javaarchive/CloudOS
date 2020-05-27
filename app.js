//
console.log("Starting Up")
var config = require("./config");
var boot = require("./boot");
const {EventListener} = require("./eventlisteners");
let shutdownListener = new EventListener();
boot.handlers.shutdown = function(){
  shutdownListener.trigger();
}
const server = require("./server") // Load Server Ui
console.log("Ended");