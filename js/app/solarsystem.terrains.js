function Terrains() {
    this._array = {};
    
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
    
    this.init = function() {
        var ar = this._array;
        ar.torus = this.imageTexture(undefined, { ambient: 0x008888, color: 0x00ffff });
        ar.grid = this.lineTexture({ color: 0x293A45, opacity: 0.9, smooth: true });
        ar.wireframe = this.basicTexture({ color: 0x293A45, wireframe: true });
        ar.main_sequence = this.basicTexture({ map: THREE.ImageUtils.loadTexture( 'images/textures/main_sequence_body.png' ), blending: THREE.AdditiveBlending, overdraw: true});
        ar.horizon = this.basicTexture({ overdraw:true, transparent: true,map: THREE.ImageUtils.loadTexture( 'images/textures/horizon.png' )});
        ar.desert = this.imageTexture("desert1.jpg", { ambient: 0x555555, color: 0x888888 }, true);
        ar.volcanic = this.imageTexture("venus.gif", { }, true);
        ar.gasgiant = this.imageTexture("jupiter.jpg", { overdraw: true }, true);
        ar.barren = this.imageTexture("barren1.jpg", { ambient: 0x555555, color: 0x888888 }, true);
        ar.terran = this.imageTexture("terran1.jpg", { ambient: 0x555555, color: 0x888888 }, true);      
        ar.ice = this.imageTexture(undefined, { ambient: 0x05555, color: 0x008888 });
        ar.selector = this.basicTexture({ transparent: true, overdraw: true, doubleSided: true, map: THREE.ImageUtils.loadTexture( 'images/textures/selector.png' )});
    }
}
