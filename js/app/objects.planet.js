(function() {
    "use strict";
    var Planet = App.Objects.Planet = function(){
        this.position = new THREE.Vector3();
        this.mesh;
        this._grid;
        this.population;
        this.metalProduction;
        this.foodProduction;
        this.taxIncome;
        this.loyalty;
        this.name;
        this.size;
        this.type;
        this.owner;
    }
    //loads on system load
    Planet.prototype.load = function(data){
        
    }
    //updates every frame
    Planet.prototype.update = function(){
        
    }
    //selected by user
    Planet.prototype.select = function(){
        
    }
    //deselected by user
    Planet.prototype.deselect = function(){
        
    }
})