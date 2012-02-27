(function() {
    "use strict";
    var Base = App.Units.Ships.Base = function(scene){
        this.mesh;
        //grid
        this._grid
        this._futureGrid
        this.connectingLine
        //positioning
        this.speed;
        this.rotationSpeed
        this.position = new THREE.Vector3();
        this.rotation = new THREE.Vector3();
        
        this.controllable = true;
    
        //damage indicators
        this.hull;
        this.shields;
        this.hullCoeficent;
        this.shieldsCoeficent;
    
    
        this.mainCannonPosition
        this.mainCannonDamage
    
        this.owner;
    
        this.orders = [];
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