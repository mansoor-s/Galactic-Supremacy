(function() {
    "use strict";
    var Resources = App.Resources = new function()  {
        this.materials = {};
        this.geometries = {};
        this.misc = {};
        this.misc.rotationMatrix = new THREE.Matrix4();
       
        
        this.lineMaterial = function( options ) {
            return new THREE.LineBasicMaterial(options);
        }
    
        this.imageMaterial = function( file, options, inImageDir ) {
            if ( file != undefined ) {
                var loc = inImageDir ? "images/textures/" + file : file;
                options.map = THREE.ImageUtils.loadTexture(loc);
            }
            return new THREE.MeshLambertMaterial(options);
        }
    
        this.basicMaterial = function( options ) {
            return new THREE.MeshBasicMaterial(options);
        }
    
        this._initializeGeometries  = function(){
            this.geometries.sphere = new THREE.SphereGeometry( 1, 64, 62 );
            this.geometries.sphere.castShadow = true;
            this.geometries.sphere.receiveShadow = true;
       
            var circleShape = new THREE.Shape();
            circleShape.moveTo(0,0);
            circleShape.arc( 0, 0, 1, 0, Math.PI * 2, false );
            this.geometries.circle = circleShape.createPointsGeometry(60);
        
            this.geometries.verticalLine = new THREE.Geometry();
            this.geometries.verticalLine.vertices.push( new THREE.Vertex(new THREE.Vector3( 0, 0, 0)));
            this.geometries.verticalLine.vertices.push( new THREE.Vertex( new THREE.Vector3( 0, 1, 0)));
        
        
            //todo correct it becouse its asynch
            this.geometries.ships = {}
            var loader = new THREE.JSONLoader();
            loader.load( './models/Shipyard.js', $.proxy(function(geometry ) {
                geometry.computeBoundingSphere();
                this.geometries.ships['cruiser'] = geometry;
            },this) );
        
        }    
        
          
        
        
        this._initializeMaterials = function() {
            this.materials.planets = {
                gas0: this.imageMaterial("jupiter.jpg", {
                    overdraw: true
                }, true),
                gas1: this.imageMaterial("saturn.jpg", {
                    overdraw: true
                }, true),
                terran0: this.imageMaterial("terran1.jpg", {
                    ambient: 0x555555, 
                    color: 0x888888
                }, true),
                volcanic0: this.imageMaterial("venus.jpg", { }, true),
                desert0: this.imageMaterial("desert1.jpg", {
                    ambient: 0x555555, 
                    color: 0x888888
                }, true),
                barren0: this.imageMaterial("barren1.jpg", {
                    ambient: 0x555555, 
                    color: 0x888888
                }, true)
            };

            this.materials.stars = {
                star0: this.imageMaterial( 'main_sequence_body.png' ,{},true) 
                
            };


            this.materials.etc = {
                gridDefault: this.lineMaterial({
                    color: 0x293A45, 
                    opacity: 0.9
                }), 
                
                gridSelected: this.lineMaterial({
                    color: 0xff0000, 
                    opacity: 0.9
                }),
                selector: this.imageMaterial("selector.png",{
                    transparent: true, 
                    overdraw: true, 
                    doubleSided: true},true),
                meshFace: new THREE.MeshFaceMaterial()
            };   
        
        } 
        this._initializeMaterials();
        this._initializeGeometries();
    }
})();