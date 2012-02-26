(function() {
    "use strict";
    var Fighter = App.Units.Ships.Fighter = function(){
    
    }  
    Fighter.prototype = new App.Units.Ships.Base;
    Fighter.prototype.constructor = Fighter;
    Fighter.prototype.parent = App.Units.Ships.Base.prototype;
   
})