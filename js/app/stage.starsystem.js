App.Stages.StarSystem = (function() { 
    var controller;
    var scene;
    var camera;
    var materials = {};
    var meshes = {};
    var shapes = {};
    var farestCameraPosition = 5000;
    //flag for when the CTRL key is pressed
    var ctrPressed = false;
    //holds the coordinates for moving the camera when free camera is enabled
    var ctrMouse = {
        x: 0,
        y: 0,
        initX: 0,
        initY: 0
    };
    //keeps the intersected object for now
    var selector;
    var SELECTED;
    var rotationMatrix = new THREE.Matrix4();
    var cameraRotations;
    var cameraLookTarget;
    return {
        cameraDistance: farestCameraPosition,
        //camera controls ,,,have to be public for the transition between 
        //galaxy and system view
       
        initialize:function (webgl) {
            controller = webgl;
            
            // Initialize camera
            camera = new THREE.PerspectiveCamera( 45, controller.jqDiv.width() / controller.jqDiv.height(), 1, 999999 );
          
            camera.matrixAutoUpdate = true;
            
            cameraLookTarget = new THREE.Vector3(0,0,0);
            cameraRotations = new THREE.Vector3(45,0,0);

            // Create scene
            scene = new THREE.Scene();

            
            
            //initialize postprocessing
            //renderModel = new THREE.RenderPass( scene, camera );
            //composer = new THREE.EffectComposer( controller.renderer );
            //composer.passes = [renderModel, filmPass, effectScreen];
            this._initializeLights();
            this._initializeMaterials();
            this._initializeGeometry();
            this.showSystem(systemData);

            var loader = new THREE.JSONLoader();
            loader.load( './models/Shipyard.js', function(geometry ) {
                var material = new THREE.MeshFaceMaterial();

                var mesh = new THREE.Mesh( geometry, material );
                mesh.position.set( 2800, 50, 50);
                scene.add( mesh );
                
            } );
        },
        _initializeGeometry:function(){
            meshes['sphere'] = new THREE.SphereGeometry( 1, 64, 62 );
            meshes['torus'] = new THREE.TorusGeometry(1.2, 0.1, 2, 60)
            shapes['circle'] = new THREE.Shape();
            shapes['circle'].moveTo(0,0);
            shapes['circle'].arc( 0, 0, 1, 0, Math.PI * 2, false );
        },
        _initializeMaterials:function(){
            //initialized all materials
            //todo:add also textured materials
            var t = new Terrains();
            t.init();
            materials = t.textures;
        },
        _initializeLights:function(){
            scene.add( new THREE.AmbientLight( 0xffffff ) );

            // create a point light
            scene.add( new THREE.PointLight( 0xFFFFFF , 1));
        },
        
        addSpace : function() {
/*
				var geometry = new THREE.Geometry();

				var sprite1 = THREE.ImageUtils.loadTexture( "images/textures/star_particle.png" );
				var sprite2 = THREE.ImageUtils.loadTexture( "images/textures/red_star_particle.png" );
				var sprite3 = THREE.ImageUtils.loadTexture( "images/textures/blue_star_particle.png" );
				var sprite4 = THREE.ImageUtils.loadTexture( "images/textures/star_particle.png" );
				var sprite5 = THREE.ImageUtils.loadTexture( "images/textures/star_particle.png" );
                var vector, color, sprite, size, particles, materials={};
				for ( i = 0; i < 10000; i ++ ) {
					vector = new THREE.Vector3( Math.random() * 2000 - 1000, Math.random() * 2000 - 1000, Math.random() * 2000 - 1000 );
					geometry.vertices.push( new THREE.Vertex( vector ) );
				}

				var parameters = [ [ [4, 0.2, 5], sprite2, 1 ],
							   [ [5, 0.1, 5], sprite3, 1 ],
							   [ [6, 0.05, 5], sprite1, 0.6 ],
							   [ [7, 0, 5], sprite5,2 ],
							   [ [10, 0, 10], sprite4,1 ],
							   ];

				for ( i = 0; i < parameters.length; i ++ ) {

					color  = parameters[i][0];
					sprite = parameters[i][1];
					size   = parameters[i][2];

					materials[i] = new THREE.ParticleBasicMaterial( { size: size, map: sprite, depthTest: false, transparent : true } );
					materials[i].color.setHSV( color[0], color[1], color[2] );

					particles = new THREE.ParticleSystem( geometry, materials[i] );
                    particles.rotation.x = Math.random() * 8 + 12;
					particles.rotation.y = Math.random() * 8 + 12;
					particles.rotation.z = Math.random() * 8 + 12;
                    //scene.add(particles);
                    }
                    */
        },
        
        //shows differend system depending on the data given
        showSystem: function(data){
            //adding solar objects
            var star = new THREE.Mesh( THREE.GeometryUtils.clone(meshes['sphere']), materials.stars[data.star.map] );
            selector = new THREE.Mesh( THREE.GeometryUtils.clone(meshes['sphere']), materials.etc.selector );
            scene.add(selector);
            selector.visible = false;
            //since default size of the meshes is 1 ..we just multiply
            //it by the size of the object
            star.scale.multiplyScalar(data.star.size * 30);
            //adding some meta data to keep track of the object more easily
            star.tag = {
                object:'star',
                data:data.star,
                parent:scene
            }
            scene.add( star );
            //this.addSpace();
            //matrix that will rotate the vectors
            for(var i = 0; i < data.planets.length; i++){
                var planet = new THREE.Mesh( THREE.GeometryUtils.clone(meshes['sphere']), 
                    materials.planets[data.planets[i].map] );
                planet.scale.multiplyScalar(data.planets[i].size * 100);
                //set the position.and then rotate it...
                planet.position.set(1,0,0).multiplyScalar(data.planets[i].distance * 600 + 400);
                rotationMatrix.setRotationY(controller.degreesToRadians(360 * data.planets[i].orbit));
                rotationMatrix.multiplyVector3(planet.position);
          
                planet.tag = {
                    object: 'planet' + i,
                    data: data.planets[i],
                    parent: scene
                }
                scene.add( planet );
                var grid  = new THREE.Line( shapes['circle'].createPointsGeometry(60), materials.etc.grid)
                grid.rotation.x = controller.degreesToRadians(90);
                grid.scale.multiplyScalar(data.planets[i].distance * 600 + 400)
         
                grid.tag = {
                    object: 'grid' + i, 
                    parent: scene
                }
           
                scene.add(grid);
                for(var i2 = 0; i2 < data.planets[i].moons.length; i2++){
                    var moon = new THREE.Mesh( THREE.GeometryUtils.clone(meshes['sphere']), 
                        materials.moons[data.planets[i].moons[i2].map] );
                    moon.scale.multiplyScalar(30);
                    //set distance(from planet)
                    moon.position.set(1,0,0).multiplyScalar((i2 * 200) + 400 + data.planets[i].size);
                    //rotate
                    rotationMatrix.setRotationY(controller.degreesToRadians(360*data.planets[i].moons[i2].orbit));
                    rotationMatrix.multiplyVector3(moon.position);
                    //add planet position
                    moon.position.addSelf(planet.position);
                    moon.tag = {
                        object: 'moon' + i,
                        data: data.planets[i].moons[i2],
                        parent: planet
                    }
                    scene.add( moon );
                    grid  = new THREE.Line( shapes['circle'].createPointsGeometry(60), materials.etc.grid);
                    grid.rotation.x = controller.degreesToRadians(90);
                    //distance from planet
                    grid.scale.multiplyScalar((i2 * 200) + 400 + data.planets[i].size)
                    grid.position = planet.position.clone();
                    grid.tag = {
                        object:'grid'+i, 
                        parent:scene
                    }
           
                    scene.add(grid);
                }
             
            }
            
            
        },
        
        //update the animation
        update: function(){
            //updating camera position depending on controlls
            var distanceVector = new THREE.Vector3(0,0,-this.cameraDistance);
            rotationMatrix.setRotationX(controller.degreesToRadians(cameraRotations.x));
            distanceVector = rotationMatrix.multiplyVector3(distanceVector);
            rotationMatrix.setRotationY(controller.degreesToRadians(cameraRotations.y));
            distanceVector = rotationMatrix.multiplyVector3(distanceVector);
            
            camera.position.x = cameraLookTarget.x;
            camera.position.y = cameraLookTarget.y;
            camera.position.z = cameraLookTarget.z;
       
            camera.position.addSelf(distanceVector);
            
            camera.lookAt(cameraLookTarget);
            
            TWEEN.update();
        },
        //render for stage
        render: function(){
            //not used
            //postprocessing render 
            //   controller.renderer.clear();
            //   composer.render(0.05);
            controller.renderer.clear();
            controller.renderer.render(scene, camera);

        },
        onMouseClick:function(event){
            var  mouse = {};
            //not sure if this will aways pick the correct mouse cordinates
            mouse.x = ( event.clientX / controller.jqDiv.width()) * 2 - 1;
            mouse.y = - ( event.clientY / controller.jqDiv.height()) * 2 + 1;
            // find intersections
            var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
            controller.projector.unprojectVector( vector, camera );
            //use three.ray to find intersecting geometry
            var ray = new THREE.Ray( camera.position, vector.subSelf( camera.position ).normalize() );

            var intersects = ray.intersectScene( scene );
            if ( intersects.length > 0 ) {
                if ( SELECTED != intersects[ 0 ].object ) {

                    selector.position = intersects[ 0 ].object.position.clone();
                    var size = new THREE.Vector3;
                    size = intersects[ 0 ].object.scale.clone();
                    size.x += 0.1;
                    size.y += 0.1;
                    size.z += 0.1;
                    selector.scale = size;
                    SELECTED = intersects[ 0 ].object;
                    selector.visible =
                    new TWEEN.Tween( cameraLookTarget )
                    .to(intersects[ 0 ].object.position, 1500 )
                    .start()
                    
                }

            } else {
                SELECTED = null;
                selector.visible = false;
                selector.position = scene.position.clone()
            }
        },

        zoomOut: function(){
        
            var newDistance = this.cameraDistance + (Math.pow(this.cameraDistance, .85));

            new TWEEN.Tween( this  )
            .to({
                cameraDistance: newDistance

            }, 500 )
            .start();
        },


        zoomIn: function(){

           var newDistance = this.cameraDistance - (Math.pow(this.cameraDistance, .85));

            new TWEEN.Tween( this  )
            .to({
                cameraDistance: newDistance

            }, 500 )
            .start();

        },
        onKeyDown:function(e){
            //left
            var yRot = cameraRotations.y, xRot = cameraRotations.x;
            var turnUnits = 4;
            if (e.keyCode === 17) {
                //ctrMouse.initX = currentMouse.x;
                //ctrMouse.initY = currentMouse.y;
                ctrPressed = true;
            //left
            }else if (e.keyCode === 37) {
                yRot = cameraRotations.y - turnUnits;
            //right
            }else if (e.keyCode === 39) {
                yRot = cameraRotations.y + turnUnits;
            //up
            }else if (e.keyCode === 38) {
                if(cameraRotations.x > 80) {
                    xRot = 80;
                } else {
                    xRot = cameraRotations.x + turnUnits;
                }

            //down
            }else if (e.keyCode === 40) {
                if(cameraRotations.x < -80) {
                    xRot = -80;
                } else {
                    xRot = cameraRotations.x - turnUnits;
                }
            //add
            }else if (e.keyCode === 107) {
                this.zoomIn();
       
            //subtract
            }else if (e.keyCode === 109) {
                this.zoomOut();
            }
            new TWEEN.Tween( cameraRotations  )
            .to({
                x: xRot,
                y: yRot

            }, 50 )
            .start();
        },
        onKeyUp:function(e){
            
        },

        //mousewheel handler
        onMouseWheel: function(event,delta){
            event.preventDefault();

            //if free camera mode is enabled do nothing because nasty thing will happen
            if (ctrPressed) {
                return;
            }

            var clickX= event.pageX - $(event.target).position().left;
            var clickY= event.pageY - $(event.target).position().top;
            var mouseXY = {
                x:clickX,
                y:clickY
            };
            if(delta>0){
                this.zoomIn(mouseXY);
            }else{                                                      
                this.zoomOut(mouseXY);            
            }

        },

        //use it like "eventname":"functionname"
        events: {
            'keydown': 'onKeyDown',
            'keyup': 'onKeyUp',
            "click": 'onMouseClick',
            'mousewheel': 'onMouseWheel'
        },
        //event distribution
        _event:function(event,delta){
            for (var type in this.events){
                if (event.type === type){
                    this[this.events[type]](event,delta); 
                }
            }
        }
    }
}());