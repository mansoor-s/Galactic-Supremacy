(function() {
    'use strict';

    
    var Turret = App.Parts.Turret = function(ship, position, damage, rotationSpeed) {
        this.position = position.clone();
        this.rotation = new THREE.Vector3();
        this.damage = damage;
        this.rotationSpeed = rotationSpeed;
        this.mesh;
        this.ship = ship;
    }


    Turret.prototype.aimAt = function(target) {
        
    }


    Turret.prototype.fireAt = function(target) {
        
    }


    Turret.prototype.update = function() {
        
    }
})();