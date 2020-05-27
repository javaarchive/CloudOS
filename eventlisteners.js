class EventListener{
  constructor(){
    this.subscribers = [];
  }
  subscribe(handler){
    this.subscribers.push(handler);
  }
  trigger(obj = null){
    if(obj){
    for(var i = 0; i < this.subscribers.length; i ++){
      this.subscirbers[i](obj);
    }
    }else{
      for(var i = 0; i < this.subscribers.length; i ++){
      this.subscirbers[i]();
    }
    }
  }
}
module.exports = {EventListener: EventListener};