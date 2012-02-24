(function() {
    "use strict";
     var Resources = App.Resources = new function()  {
        this.textures = {};
    
        this.lineTexture = function( options ) {
            return new THREE.LineBasicMaterial(options);
        }
    
        this.imageTexture = function( file, options, inImageDir ) {
            if ( file != undefined ) {
                var loc = inImageDir ? "images/textures/" + file : file;
                options.map = THREE.ImageUtils.loadTexture(loc);
            }
            return new THREE.MeshLambertMaterial(options);
        }
    
        this.basicTexture = function( options ) {
            return new THREE.MeshBasicMaterial(options);
        }
    
        this.initialize = function() {
            this.textures.planets = {
                gas0: this.imageTexture("jupiter.jpg", {
                    overdraw: true
                }, true),
                gas1: this.imageTexture("saturn.jpg", {
                    overdraw: true
                }, true),
                terran0: this.imageTexture("terran1.jpg", {
                    ambient: 0x555555, 
                    color: 0x888888
                }, true),
                volcanic0: this.imageTexture("venus.jpg", { }, true),
                desert0: this.imageTexture("desert1.jpg", {
                    ambient: 0x555555, 
                    color: 0x888888
                }, true)
            };

            this.textures.moons = {
                ice0: this.imageTexture(undefined, {
                    ambient: 0x05555, 
                    color: 0x008888
                }),
                barren0: this.imageTexture("barren1.jpg", {
                    ambient: 0x555555, 
                    color: 0x888888
                }, true)
            };

            this.textures.stars = {
                star0: this.basicTexture({
                    map: THREE.ImageUtils.loadTexture( 'images/textures/main_sequence_body.png' ), 
                    blending: THREE.AdditiveBlending, 
                    overdraw: true
                })

            };


            this.textures.etc = {
                torus: this.imageTexture(undefined, {
                    ambient: 0x008888, 
                    color: 0x00ffff
                }),
                gridDefault: this.lineTexture({
                    color: 0x293A45, 
                    opacity: 0.9
                }), 
                
                gridSelected: this.lineTexture({
                    color: 0xff0000, 
                    opacity: 0.9
                }),
                wireframe: this.basicTexture({
                    color: 0x293A45, 
                    wireframe: true
                }),
                selector: this.basicTexture({
                    transparent: true, 
                    overdraw: true, 
                    doubleSided: true,
                    map: THREE.ImageUtils.loadTexture( 'images/textures/selector.png' )
                })
            };   
        
        } 
    }
})();