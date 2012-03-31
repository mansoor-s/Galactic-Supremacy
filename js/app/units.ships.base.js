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
        this.selected = false;
        this.hovered = false;
        
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

        this.id = '';
    }
    //creates ship grid
    Base.prototype._createGrid = function(){
        
        //todo use App.Res.
        //circle under the ship
        this.grid.shipCircle = new THREE.Line( App.Res.geometries.circle, App.Res.materials.etc.gridDefault)
        //  this._grid.circle.position.set(ship.position.x, 0, ship.position.z);
        this.grid.shipCircle.rotation.x = App.Utill.degreesToRadians(90);
        // this._grid.circle.scale = ship.scale.clone();
        // this._grid.circle.scale.multiplyScalar(ship.geometry.boundingSphere.radius);
          
        //line between y=0 and the ship
        //todo: move shipAnchorGeometry to common resource loader
        this.grid.shipAnchor = new THREE.Line(App.Res.geometries.verticalLine,App.Res.materials.etc.gridDefault)
        this.grid.shipAnchor.position = this.grid.shipCircle.position;
        //  shipAnchor.position.set(ship.position.x,ship.position.y, ship.position.z);
        //  shipAnchor.scale.multiplyScalar( -ship.position.y);
        
        //future position circle
        this.grid.futureCircle  = new THREE.Line( App.Res.geometries.circle, App.Res.materials.etc.gridDefault)
        this.grid.futureCircle.rotation.x = App.Utill.degreesToRadians(90);
        this.grid.futureCircle.scale = this.grid.shipCircle.scale;
        this.grid.futureCircle.visible = false;
        
        //future position line between y=0 and the ship
        this.grid.futureAnchor = new THREE.Line(App.Res.geometries.verticalLine,App.Res.materials.etc.gridDefault)
        //futureAnchor.scale.multiplyScalar( -ship.position.y);
        this.grid.futureAnchor.visible = false;
        
        
        //a line between current and future ship positions
        var connectingGeometry = new THREE.Geometry();
        connectingGeometry.vertices.push( new THREE.Vertex(new THREE.Vector3()));
        connectingGeometry.vertices.push( new THREE.Vertex( new THREE.Vector3()));
        connectingGeometry.dynamic = true;
        
        this.grid.connectingLine = new THREE.Line(connectingGeometry,App.Res.materials.etc.gridDefault)
        this.grid.connectingLine.visible = false;
             
    };    

    //load data when the system loads
    Base.prototype.load = function(data, scene){
        this.scene = scene;
        //todo load appropriate mesh
       
        this.id = data.id;
        this.mesh = new THREE.Mesh(App.Res.geometries.ships[data.subtype],App.Res.materials.etc.meshFace);
        this.mesh.position.set(data.position.x, data.position.y, data.position.z);
        this.mesh.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
        this.mesh.scale.set(10,10,10);
        this.mesh.tag = this;
        this.position = this.mesh.position;
        this.rotation = this.mesh.rotation;
     
       
        //calculate grid positions
        this.grid.shipCircle.position.set(data.position.x,0,data.position.z);
        this.grid.shipCircle.scale = this.mesh.scale;
        this.grid.shipAnchor.scale.multiplyScalar(data.position.y);
               
        scene.add(this.mesh);
        scene.add(this.grid.connectingLine);
        scene.add(this.grid.shipCircle);
        scene.add(this.grid.shipAnchor);
        scene.add(this.grid.futureCircle);
        scene.add(this.grid.futureAnchor);
    };


    // updates every frame
    Base.prototype.update= function(){
        
    };


    //selects this ship
    Base.prototype.select= function(){
        this.selected = true;
        this.grid.shipCircle.material = App.Res.materials.etc.gridSelected;
        this.grid.shipAnchor.material = App.Res.materials.etc.gridSelected;
        
    };


    //deselects ship
    Base.prototype.deselect= function(){
        this.selected = false;
        if(this.hovered){
            this.grid.shipCircle.material = App.Res.materials.etc.gridHover;
            this.grid.shipAnchor.material = App.Res.materials.etc.gridHover;
        }else{
            this.grid.shipCircle.material = App.Res.materials.etc.gridDefault;
            this.grid.shipAnchor.material = App.Res.materials.etc.gridDefault;
        }
    };


    //hover management
    Base.prototype.hover = function(){
        this.hovered = true;
        this.grid.shipCircle.material = App.Res.materials.etc.gridHover;
        this.grid.shipAnchor.material = App.Res.materials.etc.gridHover;
    
    };


    //hover management
    Base.prototype.unhover = function(){
        this.hovered = false;
        if(this.selected){
            this.grid.shipCircle.material = App.Res.materials.etc.gridSelected;
            this.grid.shipAnchor.material = App.Res.materials.etc.gridSelected;
        }else{
            this.grid.shipCircle.material = App.Res.materials.etc.gridDefault;
            this.grid.shipAnchor.material = App.Res.materials.etc.gridDefault;
        }
    };


    //issue order to move
    Base.prototype.moveTo = function(pos){
        new TWEEN.Tween( this.position )
            .to({
                x: pos.x,
                y: pos.y,
                z: pos.z

            }, 250 ).start();
    };


    //issue order to face a target
    Base.prototype.rotateTo = function(vector3){
        
    };


    // issue order to rotate
    Base.prototype.rotate = function(vector3){
        
    };


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
    };


})();