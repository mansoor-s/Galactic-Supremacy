(function () {
    "use strict";
    var Resources = App.Resources = function (callback) {
        this.progressValue = 0;
        this.progressMax = 9;//maximum value of the progress bar
        this.$background = $('<img src=images/preloader.jpg>').appendTo('body').css({
            width:'100%',
            height:'100%',
            position:'fixed',
            zIndex:10
        })
        this.$progressbar = $('<div>').appendTo('body').css({
            width:'100%',
            height:50,
            position:'fixed',
            bottom:100,
            zIndex:11            
        }).progressbar();
       
        this.callback = callback;
        this.materials = {};
        this.geometries = {};
        this.misc = {};
        this.misc.rotationMatrix = new THREE.Matrix4();
        this._preloadGeometries();
        this._preloadMaterials();
    }
    Resources.prototype.progress = function () {
        this.progressValue += 1;
        this.$progressbar.progressbar( "option", "value", (this.progressValue/this.progressMax)*100 );
        if (this.progressValue === this.progressMax) {
            this.$progressbar.remove();
            this.$background.remove();
            this.callback();
        }

    }
    //helper funcions for resource loadin
    Resources.prototype.lineMaterial = function (options) {
        return new THREE.LineBasicMaterial(options);
    }
    Resources.prototype.imageMaterial = function (file, options, inImageDir) {
        if (file !== undefined) {
            var loc = inImageDir ? "images/textures/" + file : file;
            options.map = THREE.ImageUtils.loadTexture(loc, undefined, $.proxy(this.progress,this));
        }
        return new THREE.MeshLambertMaterial(options);
    }
    
    Resources.prototype.basicMaterial = function (options) {
        return new THREE.MeshBasicMaterial(options);
    }
    
    //load all geometries
    Resources.prototype._preloadGeometries  = function(){
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
            this.geometries.ships['cruiser'] = geometry;
            this.progress();
        },this) );
        
    }    
    //preloads materials
    Resources.prototype._preloadMaterials = function() {
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
                color: 0x293A45
            }), 
                
            gridSelected: this.lineMaterial({
                color: 0xff0000
            }),
            
            gridHover: this.lineMaterial({
                color: 0xffff00
            }),
            selector: this.imageMaterial("selector.png",{
                transparent: true, 
                overdraw: true, 
                doubleSided: true
            },true),
            meshFace: new THREE.MeshFaceMaterial()
        };   
        
    } 
})();