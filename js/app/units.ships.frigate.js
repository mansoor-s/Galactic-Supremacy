(function() {
    "use strict";
    var Frigate = App.Units.Ships.Frigate = function(){
    
    }  
    Frigate.prototype = new App.Units.Ships.Base;
    Frigate.prototype.constructor = Frigate;
    Frigate.prototype.parent = App.Units.Ships.Base.prototype;
   
})