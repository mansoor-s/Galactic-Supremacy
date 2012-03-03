(function() {
    "use strict";
    var Planet = App.Objects.Planet = function(){
        this.mesh = null;
        this.scene = null;
        this.position = new THREE.Vector3();
        this.grid;
        this._createGrid();
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
    Planet.prototype._createGrid = function(){
        //todo use resources.
        this.grid.circle  = new THREE.Line( App.Resources.geometries.circle, App.Resources.materials.etc.gridDefault )
        //  this._grid.circle.position.set(ship.position.x, 0, ship.position.z);
        this.grid.circle.rotation.x = degreesToRadians(90);
    }
    Planet.prototype.load = function(data,scene){
        this.scene = scene;
        
        
        
        scene.add(this.mesh);
        scene.add(this.grid);
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
    Planet.prototype.onReturnToPool = function(){
        if (this.scene!==null){
            this.scene.remove(this.grid);
            this.scene.remove(this.mesh)
            this.scene = null;
        }
    }
})