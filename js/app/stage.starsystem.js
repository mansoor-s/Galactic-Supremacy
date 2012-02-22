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
        this.selector;
        this.SELECTED;
        this.rotationMatrix = new THREE.Matrix4();
        
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
      
        this.camera.matrixAutoUpdate = true;
        
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
      
        this.createSystem(systemData);
   
    };
    
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
        this.selector = new THREE.Mesh( THREE.GeometryUtils.clone(this.meshes['sphere']), this.materials.etc.selector );
        this.scene.add(this.selector);
        this.selector.visible = false;
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
            this.scene.add( planet );
            //adding orbit lines
            var grid  = new THREE.Line( this.shapes['circle'].createPointsGeometry(60), this.materials.etc.grid)
            grid.rotation.x = degreesToRadians(90);
            grid.scale.multiplyScalar(data.planets[i].distance * 600 + 400)
     
            grid.tag = {
                parent: this.scene
            }
       
            this.scene.add(grid);
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
                this.scene.add( moon );
                grid  = new THREE.Line( this.shapes['circle'].createPointsGeometry(60), this.materials.etc.grid);
                grid.rotation.x = degreesToRadians(90);
                //distance from planet
                grid.scale.multiplyScalar((i2 * 200) + 400 + data.planets[i].size)
                grid.position = planet.position.clone();
                grid.tag = {
                    parent: this.scene
                }
       
                this.scene.add(grid);
            }
        }
    };
    StarSystem.prototype.createShips = function(data){
        var material = new THREE.MeshFaceMaterial();
        for(var i = 0;i<data.ships.length;i++){
            var ship = new THREE.Mesh(this.meshes.ships[data.ships[i].type],material);
            ship.position.set(data.ships[i].position.x, data.ships[i].position.y, data.ships[i].position.z);
            ship.rotation.set(data.ships[i].rotation.x, data.ships[i].rotation.y, data.ships[i].rotation.z);
            ship.scale.set(2,2,2);
            
            this.scene.add(ship);
            var shipGrid  = new THREE.Line( this.shapes['circle'].createPointsGeometry(60), this.materials.etc.grid)
            shipGrid.position.set(data.ships[i].position.x, data.ships[i].position.y, data.ships[i].position.z);
            shipGrid.rotation.x = degreesToRadians(90);
            shipGrid.scale = ship.scale.clone();
            shipGrid.scale.multiplyScalar(this.meshes.ships[data.ships[i].type].boundingSphere.radius);
            
            ship.tag = {
                parent: this.scene,
                data:data.ships[i],
                grid:shipGrid
            }
            shipGrid.tag = {
                parent: ship
            };
            this.scene.add(shipGrid);
            
            
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
        
    }
    StarSystem.prototype.deselectPlanet= function(planetObject){
        
    }
    StarSystem.prototype.selectShip= function(shipObject){
        
    }
    StarSystem.prototype.deselectShip= function(shipObject){
        
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
                this.selector.position = intersects[ 0 ].object.position.clone();
                var size = new THREE.Vector3;
                size = intersects[ 0 ].object.scale.clone();
                size.x += 0.1;
                size.y += 0.1;
                size.z += 0.1;
                this.selector.scale = size;
                this.SELECTED = intersects[ 0 ].object;
                this.selector.visible = true;
                new TWEEN.Tween( this.cameraLookTarget )
                .to(intersects[ 0 ].object.position, 1500 )
                .start()
            //todo need to rework the whole intersection business
            // if (this.SELECTED.tag.object.substr(0,4) === 'ship'){
            //      this.SELECTED.tag.grid.material = this.materials.etc.grid2;
            // }
            }

        } else {
            this.SELECTED = null;
            this.selector.visible = false;
            this.selector.position = this.scene.position.clone()
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