(function() {
    "use strict";
    var Base = App.Units.Ships.Base = function(scene,data){
        this.mesh = null;
        //grid
        this._grid
        this._futureGrid
        this.connectingLine
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
        
        this.load(data);
    }
    //load data when the system loads
    Base.prototype.load = function(data){
        
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