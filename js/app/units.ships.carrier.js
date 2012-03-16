(function() {
    "use strict";
    var Carrier = App.Units.Ships.Carrier = function(){
        App.Units.Ships.Base.call(this);
        this.turrets = [];
        this.fighters = [];
    
    }  
    Carrier.prototype =  Object.create(App.Units.Ships.Base.prototype);
    
  
   
    Carrier.prototype.launchFighters = function(){
       
    }
    Carrier.prototype.recallFighters = function(){
       
    }
})();