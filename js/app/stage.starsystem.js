(function() {
    'use strict';
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
        this.selectedPlanet;
        this.selectedShips = [];
       
        //ships and planets arrays
        this.ships = [];

        this.fighterPool = new App.Utilities.Pool(App.Units.Ships.Fighter);
        this.carrierPool = new App.Utilities.Pool(App.Units.Ships.Carrier);
        this.frigatePool = new App.Utilities.Pool(App.Units.Ships.Frigate);
        this.planetPool = new App.Utilities.Pool(App.Objects.Planet);
        this.planets = this.planetPool.inUse;

        this.events = {
            'dblclick':'onDoubleClick',
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
        this.loadShips(systemData);
   
    };


    StarSystem.prototype.onDoubleClick = function(event){
        var clickedPosition = this._controller.getIntersectionWithYPlane(this.camera,this.mouse,0);
        new TWEEN.Tween( this.cameraLookTarget)
        .to(clickedPosition, 1500)
        .start()
    };


    StarSystem.prototype._initializeHelpers = function(){
        this.planetSelector = new THREE.Mesh( App.Res.geometries.sphere, App.Res.materials.etc.selector );
        this.planetSelector.visible = false;
        this.scene.add(this.planetSelector);
    };

    
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
    };


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
    };


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
        var x = 0;
        var y = 0;
        var totalOffsetLeft = 0;
        var totalOffsetTop = 0 ;
        
        var element = event.target;
        
        while (element.offsetParent)
        {
          totalOffsetLeft += element.offsetLeft;
          totalOffsetTop += element.offsetTop;
          element = element.offsetParent;
        }
        x = event.pageX - totalOffsetLeft;
        y = event.pageY - totalOffsetTop;

        var $viewport = this._controller.$viewport;
        this.mouse.x = ( x / $viewport.width()) * 2 - 1;
        this.mouse.y = - ( y / $viewport.height()) * 2 + 1;
        this.hoverOnOneShip();
    };

    
    StarSystem.prototype.selectPlanet= function(planetObject){
        this.planetSelector.position = planetObject.position.clone();
        var size = planetObject.mesh.scale.clone();
        size.multiplyScalar(1.01);
        this.planetSelector.scale = size;
        this.selectedPlanet = planetObject;
        this.planetSelector.visible = true;
        new TWEEN.Tween( this.cameraLookTarget )
        .to(planetObject.position, 1500 )
        .start()
    };


    StarSystem.prototype.deselectPlanet= function(planetObject){
        this.planetSelector.visible = false;
    };


    StarSystem.prototype.selectShip= function(shipObject){
        this.selectedShips.push(shipObject);
        shipObject.select();
        new TWEEN.Tween( this.cameraLookTarget )
        .to(shipObject.position, 1500 )
        .start()
    };


    StarSystem.prototype.deselectAll = function(){
        if(this.selectedPlanet !== undefined) this.deselectPlanet(this.selectedPlanet);
        for(var i = 0;i<this.selectedShips.length;i++){
            this.selectedShips[i].deselect();
        }
        this.selectedPlanet = undefined;
        this.selectedShips = [];
        
    };


    StarSystem.prototype.hoverOnOneShip = function(){
        for(var i = 0; i < this.ships.length; i++){
            if(this.ships[i].hovered) this.ships[i].unhover();
        }
        
        // find intersections
        var vector = new THREE.Vector3( this.mouse.x, this.mouse.y, 1 );
        this._controller.projector.unprojectVector( vector, this.camera );
        //use three.ray to find intersecting geometry
        var ray = new THREE.Ray( this.camera.position, vector.subSelf( this.camera.position ).normalize() );
        var intersects = ray.intersectObjects( this.scene.children );
        
        if ( intersects.length > 0 ) {
            
            for(var i = 0;i<intersects.length;i++){
                if (intersects[ i ].object.visible === true){
                 
                    if(intersects[ i ].object.tag instanceof App.Units.Ships.Base){
                        intersects[ i ].object.tag.hover();
                    }
                    break;
                }                
            }
        }
    };



    /*
        unitOrders: [
        0: move      specify vector, distance, speed
        1: stop      
        3: rotate    specify x, y and z
        4: fire      specify target location

    ]
    */
    StarSystem.prototype.handleUnitUpdates = function(update) {
        var order = update.order;
        var unitId = update.unitId;

        if (order === 0) {
            var ship = this.getUnit(unitId);
            ship.moveTo(update.pos);
            
        }
    };


    StarSystem.prototype.getUnit = function(id) {
        for (var i = 0, len = this.ships.length; i < len; ++i) {

            if (this.ships[i].id == id) {
                return this.ships[i];
            }
        }
    };



    StarSystem.prototype.onMouseClick = function(event){
        // find intersections
        var vector = new THREE.Vector3( this.mouse.x, this.mouse.y, 1 );
        this._controller.projector.unprojectVector( vector, this.camera );
        //use three.ray to find intersecting geometry
        var ray = new THREE.Ray( this.camera.position, vector.subSelf( this.camera.position ).normalize() );
        var intersects = ray.intersectObjects( this.scene.children );
        
        if ( intersects.length > 0 ) {
            
            for(var i = 0; i < intersects.length; i++){
                if (intersects[ i ].object.visible === true){
                 
                    if(intersects[ i ].object.tag instanceof App.Units.Ships.Base){
                        this.deselectAll();
                        this.selectShip(intersects[ i ].object.tag);
                    } else if(intersects[ i ].object.tag instanceof App.Objects.Planet){
                        this.deselectAll();
                        this.selectPlanet(intersects[ i ].object.tag);
                    }
                    break;
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

        }, 500 ).start();
    };


    StarSystem.prototype.zoomIn = function(){
        var newDistance = this.cameraDistance - (Math.pow(this.cameraDistance, .85));

        new TWEEN.Tween( this  )
        .to({
            cameraDistance: newDistance

        }, 500 ).start();

    };


    StarSystem.prototype.onKeyDown =function(e){
        
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
        //numpad +
        } else if (e.keyCode === 107) {
            this.zoomIn();
   
        //numpad -
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