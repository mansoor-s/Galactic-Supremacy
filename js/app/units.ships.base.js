(function() {
    "use strict";
    var Base = App.Units.Ships.Base = function(){
        this.mesh = null;
        this.scene = null;
        //grid
        this.grid = {}
        this._createGrid()
        //positioning
        this.speed = 10;
        this.rotationSpeed = App.Utill.degreesToRadians(1)
        this.position;
        this.rotation;
        
        this.controllable = true;
    
        //damage indicators
        this.hull = 100;
        this.shields = 100;
        this.hullCoeficent =1 ;
        this.shieldsCoeficent =1;
    
    
        this.mainCannonPosition = new THREE.Vector3();
        this.mainCannonDamage = 10;
    
        this.owner = '';
    
        this.orders = [];
    }
    //creates ship grid
    Base.prototype._createGrid = function(){
        
        //todo use resources.
        //circle under the ship
        this.grid.circle = new THREE.Line( App.Resources.geometries.circle, App.Resources.materials.etc.gridDefault)
        //  this._grid.circle.position.set(ship.position.x, 0, ship.position.z);
        this.grid.circle.rotation.x = App.Utill.degreesToRadians(90);
        // this._grid.circle.scale = ship.scale.clone();
        // this._grid.circle.scale.multiplyScalar(ship.geometry.boundingSphere.radius);
          
        //line between y=0 and the ship
        //todo: move shipAnchorGeometry to common resource loader
        this.grid.anchor = new THREE.Line(App.Resources.geometries.verticalLine,App.Resources.materials.etc.gridDefault)
        this.grid.anchor.position = this.grid.circle.position;
        //  shipAnchor.position.set(ship.position.x,ship.position.y, ship.position.z);
        //  shipAnchor.scale.multiplyScalar( -ship.position.y);
        
        //future position circle
        this.grid.futureCircle  = new THREE.Line( App.Resources.geometries.circle, App.Resources.materials.etc.gridDefault)
        this.grid.futureCircle.rotation.x = App.Utill.degreesToRadians(90);
        this.grid.futureCircle.scale = this.grid.circle.scale;
        this.grid.futureCircle.visible = false;
        
        //future position line between y=0 and the ship
        this.grid.futureAnchor = new THREE.Line(App.Resources.geometries.verticalLine,App.Resources.materials.etc.gridDefault)
        //futureAnchor.scale.multiplyScalar( -ship.position.y);
        this.grid.futureAnchor.visible = false;
        
        
        //a line between current and future ship positions
        var connectingGeometry = new THREE.Geometry();
        connectingGeometry.vertices.push( new THREE.Vertex(new THREE.Vector3()));
        connectingGeometry.vertices.push( new THREE.Vertex( new THREE.Vector3()));
        connectingGeometry.dynamic = true;
        
        this.grid.connectingLine = new THREE.Line(connectingGeometry,App.Resources.materials.etc.gridDefault)
        this.grid.connectingLine.visible = false;
             
    };    //load data when the system loads
    Base.prototype.load = function(data,scene){
        this.scene = scene;
        //todo load appropriate mesh
       
        this.mesh = new THREE.Mesh(App.Resources.geometries.ships[data.subtype],App.Resources.materials.etc.meshFace);
        this.mesh.position.set(data.position.x, data.position.y, data.position.z);
        this.mesh.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
        this.position = this.mesh.position;
        this.rotation = this.mesh.rotation;
        
       
        //calculate grid positions
        this.grid.shipCircle.position.set(data.position.x,0,data.position.z);
        this.grid.shipAnchor.scale.multiplyScalar(data.position.y);
               
        scene.add(this.mesh);
        scene.add(this.grid.connectingLine);
        scene.add(this.grid.shipCircle);
        scene.add(this.grid.shipAnchor);
        scene.add(this.grid.futureCircle);
        scene.add(this.grid.futureAnchor);
    }
    // updates every frame
    Base.prototype.update= function(){
        
    }
    //selects this ship
    Base.prototype.select= function(){
        
    }
    //deselects ship
    Base.prototype.deselect= function(){
        
    }
    //issue order to move
    Base.prototype.moveTo= function(vector3){
        
    }
    //issue order to face a target
    Base.prototype.rotateTo= function(vector3){
        
    }
    // issue order to rotate
    Base.prototype.rotate= function(vector3){
        
    }
    Base.prototype.onReturnToPool = function(){
        if (this.scene!==null){
            this.scene.remove(this.grid.connectingLine);
            this.scene.remove(this.grid.shipCircle);
            this.scene.remove(this.grid.shipAnchor);
            this.scene.remove(this.grid.futureCircle);
            this.scene.remove(this.grid.futureAnchor);
            this.scene.remove(this.mesh)
            this.scene = null;
        }
    }
})();