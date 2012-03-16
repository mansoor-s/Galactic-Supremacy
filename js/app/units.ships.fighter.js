(function() {
    "use strict";
    var Fighter = App.Units.Ships.Fighter = function(){
           App.Units.Ships.Base.call(this);
         this.launched = false;
    }  
    Fighter.prototype =  Object.create(App.Units.Ships.Base.prototype);
    
  
})();