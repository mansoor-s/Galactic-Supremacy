(function() {
    "use strict";
    var StarSystem = App.Stages.StarSystem = function(webglController) {
        this._controller = webglController;
        this.scene;
        this.camera;
        this.materials = {};
        this.meshes = {};
        this.shapes = {};
        this.farestCameraPosition = 5000;
        
        //input managment
        this.mouse = {
            x:0,
            y:0
        };
        
        
        //keeps the intersected object for now
        this.SELECTED = [];
       
        //ships and planets arrays
        this.ships = [];
        this.fighterPool = new App.Utilities.Pool(App.Units.Ships.Fighter);
        this.carrierPool = new App.Utilities.Pool(App.Units.Ships.Carrier);
        this.frigatePool = new App.Utilities.Pool(App.Units.Ships.Frigate);
        this.planetPool = new App.Utilities.Pool(App.Objects.Planet);
        this.planets = this.planetPool.inUse;

        this.events = {
            'keydown': 'onKeyDown',
            'keyup': 'onKeyUp',
            "click": 'onMouseClick',
            'mousewheel': 'onMouseWheel',
            'mousemove': 'onMouseMove'
        };
        
        // Initialize camera
        this.camera = new THREE.PerspectiveCamera( 45, this._controller.$viewport.width() / this._controller.$viewport.height(), 1, 999999 );
        //camera control
        this.cameraLookTarget = new THREE.Vector3(0,0,0);
        this.cameraRotations = new THREE.Vector3(45,0,0);
        this.cameraDistance = this.farestCameraPosition;

        // Create scene
        this.scene = new THREE.Scene();

        this._initializeLights();
        this._initializeHelpers();
        //selectors and interaction helpers
     
       
      
        this.loadSystem(systemData);
    // this.loadShips(systemData);
   
    };
    
    StarSystem.prototype._initializeHelpers = function(){
        this.planetSelector = new THREE.Mesh( App.Res.geometries.sphere, App.Res.materials.etc.selector );
        this.planetSelector.visible = false;
        this.scene.add(this.planetSelector);
    } 
    
    StarSystem.prototype._initializeLights = function(){
        var ambient = new THREE.AmbientLight( 0xffffff ); 
        this.scene.add( ambient );

        // create a point light
        var pointLight = new THREE.SpotLight( 0xFFFFFF , 1, 10000, true);
        pointLight.shadowCameraFov = 360;
        this.scene.add(pointLight);
    };

    StarSystem.prototype.loadSystem = function(data) {
         
        
        
        //adding solar objects
        var star = new THREE.Mesh(
            App.Res.geometries.sphere,
            App.Res.materials.stars[data.star.map]  
            );
        //since default size of the meshes is 1 ..we just multiply
        //it by the size of the object
        star.scale.multiplyScalar(data.star.size);
        //adding some meta data to keep track of the object more easily
        star.tag = {
            data: data.star
        }
        this.scene.add( star );
        //this.addSpace();
        //matrix that will rotate the vectors
        for(var i = 0; i < data.planets.length; i++){
            var planet = this.planetPool.useOne();
            planet.load(data.planets[i],this.scene)
            this.planets.push(planet);
            for(var i2 = 0; i2 < data.planets[i].moons.length; i2++){
                var moon = this.planetPool.useOne();
                moon.load(data.planets[i].moons[i2],this.scene,planet)
                this.planets.push(moon);
            }
        }
    };
    StarSystem.prototype.loadShips = function(data){
        this.fighterPool.freeAll();
        this.frigatePool.freeAll();
        this.carrierPool.freeAll();
        
        for(var i = 0;i<data.ships.length;i++){
            var ship = this[data.ships[i].type+"Pool"].useOne();
            ship.load(data.ships[i],this.scene);
            this.ships.push(ship);    
        }
    }
    StarSystem.prototype.updateCamera = function(){
        var distanceVector = new THREE.Vector3(0,0,-this.cameraDistance);
        App.Res.misc.rotationMatrix.setRotationX(App.Utill.degreesToRadians(this.cameraRotations.x));
        distanceVector =  App.Res.misc.rotationMatrix.multiplyVector3(distanceVector);
        App.Res.misc.rotationMatrix.setRotationY(App.Utill.degreesToRadians(this.cameraRotations.y));
        distanceVector =  App.Res.misc.rotationMatrix.multiplyVector3(distanceVector);
        
        this.camera.position.x = this.cameraLookTarget.x;
        this.camera.position.y = this.cameraLookTarget.y;
        this.camera.position.z = this.cameraLookTarget.z;
   
        this.camera.position.addSelf(distanceVector);
        
        this.camera.lookAt(this.cameraLookTarget);
    }
    StarSystem.prototype.update = function(){
        //updating camera position depending on controlls
        this.updateCamera();
        
        TWEEN.update();
    };

    StarSystem.prototype.render = function(){
        //not used
        //postprocessing render 
        //   controller.renderer.clear();
        //   composer.render(0.05);
        this._controller.renderer.clear();
        this._controller.renderer.render(this.scene, this.camera);
    };


    StarSystem.prototype.onMouseMove = function(event){
    

        var $viewport = this._controller.$viewport;
        this.mouse.x = ( event.offsetX / $viewport.width()) * 2 - 1;
        this.mouse.y = - ( event.offsetY / $viewport.height()) * 2 + 1;
    
    }
    
    StarSystem.prototype.selectPlanet= function(planetObject){
        this.planetSelector.position = planetObject.position.clone();
        var size = planetObject.scale.clone();
        size.multiplyScalar(1.01);
        this.planetSelector.scale = size;
        this.SELECTED.push(planetObject);
        this.planetSelector.visible = true;
        new TWEEN.Tween( this.cameraLookTarget )
        .to(planetObject.position, 1500 )
        .start()
    }
    StarSystem.prototype.deselectPlanet= function(planetObject){
        this.planetSelector.visible = false;
    }
    StarSystem.prototype.selectShip= function(shipObject){
        this.SELECTED.push(shipObject);
        shipObject.tag.shipCircle.material = this.materials.etc.gridSelected;
        shipObject.tag.shipAnchor.material = this.materials.etc.gridSelected;
        new TWEEN.Tween( this.cameraLookTarget )
        .to(shipObject.position, 1500 )
        .start()
    }
    StarSystem.prototype.deselectShip= function(shipObject){
        shipObject.tag.shipCircle.material = this.materials.etc.gridDefault;
        shipObject.tag.shipAnchor.material = this.materials.etc.gridDefault;
        
    }
    
    StarSystem.prototype.deselectAll = function(){
        for(var i = 0;i<this.SELECTED.length;i++){
            if($.inArray(this.SELECTED[i], this.planets)!== -1){
                this.deselectPlanet(this.SELECTED[i]);
            }else if ($.inArray(this.SELECTED[i], this.ships)!== -1){
                this.deselectShip(this.SELECTED[i]);
            }
        }
        this.SELECTED = [];
        
    }
    StarSystem.prototype.onMouseClick = function(event){
        // find intersections
        var vector = new THREE.Vector3( this.mouse.x, this.mouse.y, 1 );
        this._controller.projector.unprojectVector( vector, this.camera );
        //use three.ray to find intersecting geometry
        var ray = new THREE.Ray( this.camera.position, vector.subSelf( this.camera.position ).normalize() );
        var intersects = ray.intersectObjects( this.scene.children );
        
        if ( intersects.length > 0 ) {
            if ( this.SELECTED != intersects[ 0 ].object ) {
                if($.inArray(intersects[ 0 ].object, this.planets) !== -1){
                    this.deselectAll();
                    this.selectPlanet(intersects[ 0 ].object);
                }else if($.inArray(intersects[ 0 ].object, this.ships) !== -1) {
                    this.deselectAll();
                    this.selectShip(intersects[ 0 ].object);
                }
            }
        } else {
            this.deselectAll();
        }
    };


    StarSystem.prototype.zoomOut = function(){
        var newDistance = this.cameraDistance + (Math.pow(this.cameraDistance, .85));

        new TWEEN.Tween( this  )
        .to({
            cameraDistance: newDistance

        }, 500 )
        .start();
    };


    StarSystem.prototype.zoomIn = function(){
        var newDistance = this.cameraDistance - (Math.pow(this.cameraDistance, .85));

        new TWEEN.Tween( this  )
        .to({
            cameraDistance: newDistance

        }, 500 )
        .start();

    };

    StarSystem.prototype.onKeyDown =function(e){
        //left
        var yRot = this.cameraRotations.y, xRot = this.cameraRotations.x;
        var turnUnits = 2;
        if (e.keyCode === 17) {
            //ctrMouse.initX = currentMouse.x;
            //ctrMouse.initY = currentMouse.y;
            this.ctrPressed = true;
        //left
        } else if (e.keyCode === 37) {
            yRot = this.cameraRotations.y - turnUnits;
        //right
        } else if (e.keyCode === 39) {
            yRot = this.cameraRotations.y + turnUnits;
        //up
        } else if (e.keyCode === 38) {
            if(this.cameraRotations.x > 80) {
                xRot = 80;
            } else {
                xRot = this.cameraRotations.x + turnUnits;
            }

        //down
        } else if (e.keyCode === 40) {
            if(this.cameraRotations.x < -80) {
                xRot = -80;
            } else {
                xRot = this.cameraRotations.x - turnUnits;
            }
        //add
        } else if (e.keyCode === 107) {
            this.zoomIn();
   
        //subtract
        } else if (e.keyCode === 109) {
            this.zoomOut();
        }
        new TWEEN.Tween( this.cameraRotations  )
        .to({
            x: xRot,
            y: yRot

        }, 50 )
        .start();
    };

    StarSystem.prototype.onKeyUp = function(e){
        
    };

    StarSystem.prototype.onMouseWheel = function(event,delta){
        event.preventDefault();

        if (delta > 0){
            this.zoomIn();
        } else{                                                      
            this.zoomOut();            
        }

    };

    StarSystem.prototype.onEvent = function(event, delta){

        for (var type in this.events){
            if (event.type === type){
                this[this.events[type]](event,delta); 
            }
        }
    };
})();