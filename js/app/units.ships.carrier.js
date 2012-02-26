(function() {
    "use strict";
    var Carrier = App.Units.Ships.Carrier = function(){
    
    }  
    Carrier.prototype = new App.Units.Ships.Base;
    Carrier.prototype.constructor = Carrier;
    Carrier.prototype.parent = App.Units.Ships.Base.prototype;
   
})