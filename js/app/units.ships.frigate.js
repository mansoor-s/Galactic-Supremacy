(function() {
    "use strict";
    var Frigate = App.Units.Ships.Frigate = function(){
        App.Units.Ships.Base.call(this); 
        this.turrets = [];
    }  
    Frigate.prototype =  Object.create(App.Units.Ships.Base.prototype);
    
  
})();