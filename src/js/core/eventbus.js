function Registry() {
  
}

Registry.prototype = {
    registrate: function (eventName, fn) {

    },
    find: function(eventName) {
       return function(e) {};
    }
}

function EventBus(){
   this.registry = new Registry()
}

EventBus.prototype = {
    on: function(eventName, fn){
        this.registry.registrate(eventName, fn);
    },

    emit: function(event) {
        this.registry.find(event.name).call(event);
    }
}