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
        this.rotationMatrix = new THREE.Matrix4();
        
        //ships and planets arrays
        this.ships = [];
        this.planets = [];
        
        //camera control
        this.cameraRotations;
        this.cameraLookTarget;
        this.cameraDistance = this.farestCameraPosition;

        this.events = {
            'keydown': 'onKeyDown',
            'keyup': 'onKeyUp',
            "click": 'onMouseClick',
            'mousewheel': 'onMouseWheel',
            'mousemove': 'onMouseMove'
        };
        
        var $viewport = this._controller.getViewport();

        // Initialize camera
        this.camera = new THREE.PerspectiveCamera( 45, $viewport.width() / $viewport.height(), 1, 999999 );
      
        this.cameraLookTarget = new THREE.Vector3(0,0,0);
        this.cameraRotations = new THREE.Vector3(45,0,0);

        // Create scene
        this.scene = new THREE.Scene();

        
        
        //initialize postprocessing
        //renderModel = new THREE.RenderPass( scene, camera );
        //composer = new THREE.EffectComposer( controller.renderer );
        //composer.passes = [renderModel, filmPass, effectScreen];
        this._initializeLights();
        this._initializeMaterials();
        this._initializeGeometry();
        this._initializeHelpers();
        //selectors and interaction helpers
     
       
      
        this.createSystem(systemData);
   
    };
    StarSystem.prototype._initializeHelpers = function(){
        this.planetSelector = new THREE.Mesh( THREE.GeometryUtils.clone(this.meshes['sphere']), this.materials.etc.selector );
        this.planetSelector.visible = false;
        this.scene.add(this.planetSelector);
       
     
    
    } 
    StarSystem.prototype._initializeGeometry = function(){
        this.meshes.sphere = new THREE.SphereGeometry( 1, 64, 62 );
        this.meshes.sphere.castShadow = true;
        this.meshes.sphere.receiveShadow = true;
        this.meshes.torus = new THREE.TorusGeometry(1.2, 0.1, 2, 60)
        this.shapes['circle'] = new THREE.Shape();
        this.shapes['circle'].moveTo(0,0);
        this.shapes['circle'].arc( 0, 0, 1, 0, Math.PI * 2, false );
        
        //todo... move to resource loader   
        this.meshes.ships = {}
        var loader = new THREE.JSONLoader();
        loader.load( './models/Shipyard.js', $.proxy(function(geometry ) {
            geometry.computeBoundingSphere();
            this.meshes.ships['cruiser'] = geometry;
            this.createShips(systemData);
        },this) );
    };

    StarSystem.prototype._initializeMaterials = function(){
        //initialized all materials
        //todo:add also textured materials
        var t = App.Resources;
        t.initialize();
        this.materials = t.textures;
    },

    StarSystem.prototype._initializeLights = function(){
        var ambient = new THREE.AmbientLight( 0xffffff ); 
        this.scene.add( ambient );

        // create a point light
        var pointLight = new THREE.SpotLight( 0xFFFFFF , 1, 10000, true);
        pointLight.shadowCameraFov = 360;
        this.scene.add(pointLight);
    };

    StarSystem.prototype.createSystem = function(data) {
         
        
        
        //adding solar objects
        var star = new THREE.Mesh( THREE.GeometryUtils.clone(this.meshes['sphere']),this. materials.stars[data.star.map] );
        //since default size of the meshes is 1 ..we just multiply
        //it by the size of the object
        star.scale.multiplyScalar(data.star.size * 30);
        //adding some meta data to keep track of the object more easily
        star.tag = {
            data: data.star,
            parent: this.scene
        }
        this.scene.add( star );
        //this.addSpace();
        //matrix that will rotate the vectors
        for(var i = 0; i < data.planets.length; i++){
            var planet = new THREE.Mesh( THREE.GeometryUtils.clone(this.meshes['sphere']), 
                this.materials.planets[data.planets[i].map] );
            
            planet.scale.multiplyScalar(data.planets[i].size * 100);
            //set the position.and then rotate it...
            planet.position.set(1,0,0).multiplyScalar(data.planets[i].distance * 600 + 400);
            
            this.rotationMatrix.setRotationY(degreesToRadians(360 * data.planets[i].orbit));
            this.rotationMatrix.multiplyVector3(planet.position);
            
            planet.castShadow = true;
            planet.receiveShadow = true;
            planet.tag = {
                data: data.planets[i],
                parent: this.scene
            }
            //adding orbit lines
            var grid  = new THREE.Line( this.shapes['circle'].createPointsGeometry(60), this.materials.etc.gridDefault)
            grid.rotation.x = degreesToRadians(90);
            grid.scale.multiplyScalar(data.planets[i].distance * 600 + 400)
     
            grid.tag = {
                parent: this.scene
            }
            this.scene.add( planet );
            this.scene.add(grid);
            this.planets.push(planet);
            for(var i2 = 0; i2 < data.planets[i].moons.length; i2++){
                var moon = new THREE.Mesh( THREE.GeometryUtils.clone(this.meshes['sphere']), 
                    this.materials.moons[data.planets[i].moons[i2].map] );
                moon.scale.multiplyScalar(30);
                moon.castShadow = true;
                moon.receiveShadow = true;
                //set distance(from planet)
                moon.position.set(1,0,0).multiplyScalar((i2 * 200) + 400 + data.planets[i].size);
                //rotate
                this.rotationMatrix.setRotationY(degreesToRadians(360*data.planets[i].moons[i2].orbit));
                this.rotationMatrix.multiplyVector3(moon.position);
                //add planet position
                moon.position.addSelf(planet.position);
                moon.tag = {
                    data: data.planets[i].moons[i2],
                    parent: planet
                }
                grid  = new THREE.Line( this.shapes['circle'].createPointsGeometry(60), this.materials.etc.gridDefault);
                grid.rotation.x = degreesToRadians(90);
                //distance from planet
                grid.scale.multiplyScalar((i2 * 200) + 400 + data.planets[i].size)
                grid.position = planet.position.clone();
                grid.tag = {
                    parent: this.scene
                }
                this.scene.add( moon );
                this.planets.push(moon);
                this.scene.add(grid);
            }
        }
    };
    StarSystem.prototype._createShipAnchor = function(ship){
        //circle under the ship
        var shipCircle  = new THREE.Line( this.shapes['circle'].createPointsGeometry(60), this.materials.etc.gridDefault)
        shipCircle.position.set(ship.position.x, 0, ship.position.z);
        shipCircle.rotation.x = degreesToRadians(90);
        shipCircle.scale = ship.scale.clone();
        shipCircle.scale.multiplyScalar(ship.geometry.boundingSphere.radius);
          
        //line between y=0 and the ship
        var shipAnchorGeometry = new THREE.Geometry();
        shipAnchorGeometry.vertices.push( new THREE.Vertex(new THREE.Vector3( 0, 0, 0)));
        shipAnchorGeometry.vertices.push( new THREE.Vertex( new THREE.Vector3( 0, 1, 0)));
        var shipAnchor = new THREE.Line(shipAnchorGeometry,this.materials.etc.gridDefault)
        shipAnchor.position.set(ship.position.x,ship.position.y, ship.position.z);
        shipAnchor.scale.multiplyScalar( -ship.position.y);
        
        //future position circle
        var futureCircle  = new THREE.Line( this.shapes['circle'].createPointsGeometry(60), this.materials.etc.gridDefault)
        futureCircle.rotation.x = degreesToRadians(90);
        futureCircle.scale = shipCircle.scale;
        futureCircle.visible = false;
        
        //future position line between y=0 and the ship
        var futureAnchor = new THREE.Line(shipAnchorGeometry,this.materials.etc.gridDefault)
        futureAnchor.scale.multiplyScalar( -ship.position.y);
        futureAnchor.visible = false;
        
        
        //a line between current and future ship positions
         var connectingGeometry = new THREE.Geometry();
        connectingGeometry.vertices.push( new THREE.Vertex(new THREE.Vector3()));
        connectingGeometry.vertices.push( new THREE.Vertex( new THREE.Vector3()));
        connectingGeometry.dynamic = true;
        
        var connectingLine = new THREE.Line(connectingGeometry,this.materials.etc.gridDefault)
        connectingLine.visible = false;
        
        ship.tag.shipCircle = shipCircle;
        ship.tag.shipAnchor = shipAnchor;
        ship.tag.futureCircle = futureCircle;
        ship.tag.futureAnchor = futureAnchor;
        ship.tag.connectingLine = connectingLine;
        
        this.scene.add(connectingLine);
        this.scene.add(shipCircle);
        this.scene.add(shipAnchor);
        this.scene.add(futureCircle);
        this.scene.add(futureAnchor);
        
        
         
    };
    
    StarSystem.prototype.createShips = function(data){
        var material = new THREE.MeshFaceMaterial();
        for(var i = 0;i<data.ships.length;i++){
            var ship = new THREE.Mesh(this.meshes.ships[data.ships[i].type],material);
            ship.position.set(data.ships[i].position.x, data.ships[i].position.y, data.ships[i].position.z);
            ship.rotation.set(data.ships[i].rotation.x, data.ships[i].rotation.y, data.ships[i].rotation.z);
            ship.scale.set(2,2,2);
        
            ship.tag = {
                parent: this.scene,
                data:data.ships[i]
            }
            this.scene.add(ship);
                this._createShipAnchor(ship)
            this.ships.push(ship)
            
        }
    }
    StarSystem.prototype.update = function(){
        //updating camera position depending on controlls
        var distanceVector = new THREE.Vector3(0,0,-this.cameraDistance);
        this.rotationMatrix.setRotationX(degreesToRadians(this.cameraRotations.x));
        this.distanceVector = this.rotationMatrix.multiplyVector3(distanceVector);
        this.rotationMatrix.setRotationY(degreesToRadians(this.cameraRotations.y));
        this.distanceVector = this.rotationMatrix.multiplyVector3(distanceVector);
        
        this.camera.position.x = this.cameraLookTarget.x;
        this.camera.position.y = this.cameraLookTarget.y;
        this.camera.position.z = this.cameraLookTarget.z;
   
        this.camera.position.addSelf(distanceVector);
        
        this.camera.lookAt(this.cameraLookTarget);
        
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
    

        var $viewport = this._controller.getViewport();
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
        var intersects = ray.intersectScene( this.scene );
        
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
        var turnUnits = 4;
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