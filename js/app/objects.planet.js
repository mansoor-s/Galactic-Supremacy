(function() {
    "use strict";
    var Planet = App.Objects.Planet = function(){
        this.mesh = null;
        this.scene = null;
        this.position;
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
        this.grid  = new THREE.Line( App.Resources.geometries.circle, App.Resources.materials.etc.gridDefault )
        //  this._grid.circle.position.set(ship.position.x, 0, ship.position.z);
        this.grid.rotation.x = degreesToRadians(90);
    }
    Planet.prototype.load = function(data,scene,parent){
        this.scene = scene;
        if(parent === undefined){
            parent = {
                position:{
                    x:0,
                    y:0,
                    z:0
                },
                size:0             
            };          
            this.size = data.size;
        }else{
            //when parent is defined its a moon
            this.size = data.size = 100;
        }
        this.mesh = new THREE.Mesh( App.Resources.geometries.sphere, 
            App.Resources.materials.planets[data.map] );
        this.position = this.mesh.position;
       
        this.mesh.scale.multiplyScalar(data.size);
        //set the position.and then rotate it...
        this.mesh.position.set(1,0,0).multiplyScalar(data.distance + parent.size);
            
        App.Resources.misc.rotationMatrix.setRotationY(degreesToRadians(360 * data.orbit));
        App.Resources.misc.rotationMatrix.multiplyVector3(this.mesh.position);
            
      this.mesh.position.addSelf(parent.position);
                
        
        //adding orbit lines
        this.grid.scale.multiplyScalar(data.distance + parent.size)
        this.grid.position = parent.position;

        
        
        
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
})();