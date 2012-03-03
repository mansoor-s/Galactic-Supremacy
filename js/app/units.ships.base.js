(function() {
    "use strict";
    var Base = App.Units.Ships.Base = function(){
        this.mesh = null;
        //grid
        this.grid = {}
        this._createGrid()
        //positioning
        this.speed = 10;
        this.rotationSpeed = degreesToRadians(1)
        this.position = new THREE.Vector3();
        this.rotation = new THREE.Vector3();
        
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
        //circle under the ship
        this.grid.circle  = new THREE.Line( this.shapes['circle'].createPointsGeometry(60), this.materials.etc.gridDefault)
        //  this._grid.circle.position.set(ship.position.x, 0, ship.position.z);
        this.grid.circle.rotation.x = degreesToRadians(90);
        // this._grid.circle.scale = ship.scale.clone();
        // this._grid.circle.scale.multiplyScalar(ship.geometry.boundingSphere.radius);
          
        //line between y=0 and the ship
        //todo: move shipAnchorGeometry to common resource loader
       this._rid.anchor = new THREE.Line(shipAnchorGeometry,this.materials.etc.gridDefault)
        //  shipAnchor.position.set(ship.position.x,ship.position.y, ship.position.z);
        //  shipAnchor.scale.multiplyScalar( -ship.position.y);
        
        //future position circle
        this.grid.futureCircle  = new THREE.Line( this.shapes['circle'].createPointsGeometry(60), this.materials.etc.gridDefault)
        this.grid.futureCircle.rotation.x = degreesToRadians(90);
        this.grid.futureCircle.scale = this._grid.circle.scale;
        this.grid.futureCircle.visible = false;
        
        //future position line between y=0 and the ship
        this.grid.futureAnchor = new THREE.Line(shipAnchorGeometry,this.materials.etc.gridDefault)
        //futureAnchor.scale.multiplyScalar( -ship.position.y);
        this.grid.futureAnchor.visible = false;
        
        
        //a line between current and future ship positions
        var connectingGeometry = new THREE.Geometry();
        connectingGeometry.vertices.push( new THREE.Vertex(new THREE.Vector3()));
        connectingGeometry.vertices.push( new THREE.Vertex( new THREE.Vector3()));
        connectingGeometry.dynamic = true;
        
        this.grid.connectingLine = new THREE.Line(connectingGeometry,this.materials.etc.gridDefault)
        this.grid.connectingLine.visible = false;
             
    };    //load data when the system loads
    Base.prototype.load = function(data,scene){
         
         
         
         
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
})