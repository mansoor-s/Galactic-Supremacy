(function() {
    "use strict";
    var Carrier = App.Units.Ships.Carrier = function(){
    this.turrets = [];
    this.fighters = [];
    
    }  
    Carrier.inheritsFrom(App.Units.Ships.Base);
  
   
    Carrier.prototype.launchFighters = function(){
       
    }
    Carrier.prototype.recallFighters = function(){
       
    }
})();