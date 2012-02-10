App.Stages.StarSystem = (function() { 
    var controller;
    var scene;
    var camera;
    var materials = {};
    var meshes = {};
    var shapes = {};
    var farestCameraPosition = 5000;
    var zoomLevelCurrent = 10;
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
        cameraDistance: 1000,
        //camera controls ,,,have to be public for the transition between 
        //galaxy and system view
       
        initialize:function (webgl) {
            controller = webgl;
            
            // Initialize camera
            camera = new THREE.PerspectiveCamera( 45, controller.jqDiv.width() / controller.jqDiv.height(), 1, 999999 );
          
            camera.matrixAutoUpdate = true;
            
            cameraLookTarget = new THREE.Vector3(0,0,0),
            cameraDistance = 1000;
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
            materials = t._array;
        },
        _initializeLights:function(){
            scene.add( new THREE.AmbientLight( 0xffffff ) );

            // create a point light
            scene.add( new THREE.PointLight( 0xFFFFFF , 3));
        },
        
        addSpace : function() {

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
        },
        
        //shows differend system depending on the data given
        showSystem: function(data){
          
            //adding solar objects
            var star = new THREE.Mesh( THREE.GeometryUtils.clone(meshes['sphere']), materials['main_sequence'] );
            var horizon = new THREE.Mesh( THREE.GeometryUtils.clone(meshes['sphere']), materials['horizon'] );
            selector = new THREE.Mesh( THREE.GeometryUtils.clone(meshes['sphere']), materials['selector'] );
            scene.add(selector);
            //since default size of the meshes is 1 ..we just multiply
            //it by the size of the object
            star.scale.multiplyScalar(data.star.size * 30);
            horizon.scale.multiplyScalar(data.star.size+0.4);
            //adding some meta data to keep track of the object more easily
            star.tag = {
                object:'star',
                data:data.star,
                parent:scene
            }
            scene.add( star );
            scene.add( horizon );
            //this.addSpace();
            //matrix that will rotate the vectors
            for(var i = 0;i<data.planets.length;i++){
                var planet = new THREE.Mesh( THREE.GeometryUtils.clone(meshes['sphere']), materials[data.planets[i].type] );
                planet.scale.multiplyScalar(data.planets[i].size * 50);
                //set the position.and then rotate it...
                planet.position.set(1,0,0).multiplyScalar(data.planets[i].distance * 600 + 100);
                rotationMatrix.setRotationY(controller.degreesToRadians(360*data.planets[i].orbit));
                rotationMatrix.multiplyVector3(planet.position);
          
                planet.tag = {
                    object:'planet' + i,
                    data:data.planets[i],
                    parent:scene
                }
                scene.add( planet );
                var grid  = new THREE.Line( shapes['circle'].createPointsGeometry(60),materials['grid'])
                grid.rotation.x = controller.degreesToRadians(90);
                grid.scale.multiplyScalar(data.planets[i].distance * 600 + 100)
         
                grid.tag={
                    object: 'grid' + i, 
                    parent: scene
                }
           
                scene.add(grid);
                for(var i2 = 0; i2 < data.planets[i].moons.length; i2++){
                    var moon = new THREE.Mesh( THREE.GeometryUtils.clone(meshes['sphere']), materials[data.planets[i].moons[i2].type] );
                    moon.scale.multiplyScalar(30);
                    //set distance(from planet)
                    moon.position.set(1,0,0).multiplyScalar((i2 * 200) + 400 + data.planets[i].size);
                    //rotate
                    rotationMatrix.setRotationY(controller.degreesToRadians(360*data.planets[i].moons[i2].orbit));
                    rotationMatrix.multiplyVector3(moon.position);
                    //add planet position
                    moon.position.addSelf(planet.position);
                    moon.tag = {
                        object:'moon'+i,
                        data:data.planets[i].moons[i2],
                        parent:planet
                    }
                    scene.add( moon );
                    grid  = new THREE.Line( shapes['circle'].createPointsGeometry(60),materials['grid'])
                    grid.rotation.x = controller.degreesToRadians(90);
                    //distance from planet
                    grid.scale.multiplyScalar((i2 * 200) + 400 + data.planets[i].size)
                    grid.position = planet.position.clone();
                    grid.tag={
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
            controller.renderer.render(scene,camera);

        },
        onMouseClick:function(event){
            var  mouse={};
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

                    selector.position=intersects[ 0 ].object.position.clone();
                    var size = new THREE.Vector3;
                    size = intersects[ 0 ].object.scale.clone();
                    size.x += 0.1;
                    size.y += 0.1;
                    size.z += 0.1;
                    selector.scale = size;
                    //console.log( intersects[ 0 ].object.scale.clone().scale.multiplyScalar(1));
                    SELECTED = intersects[ 0 ].object;
                    
                    new TWEEN.Tween( this.cameraLookTarget )
                    .to(intersects[ 0 ].object.position, 1500 )
                    .start()
                    
                }

            } else {
                SELECTED = null;
                selector.position = scene.position.clone()
            }
        },

        zoomOut: function(xy){
            new TWEEN.Tween( this  )
            .to({
                cameraDistance: this.cameraDistance + 200

            }, 500 )
            .start();

            //this.centerOn(xy) 
        },


        zoomIn: function(xy){

            //animate camera to new position 
            new TWEEN.Tween( this )
            .to({
                cameraDistance: this.cameraDistance - 200
            }, 500 )
            .start()

            //this.centerOn(xy) 
        },
        onKeyDown:function(e){
            //left
            if (e.keyCode === 17) {
                ctrMouse.initX = currentMouse.x;
                ctrMouse.initY = currentMouse.y;
                ctrPressed = true;

            //left
            }else if (e.keyCode === 37) {
                cameraRotations.y -= 2;
            //right
            }else if (e.keyCode === 39) {
                cameraRotations.y += 2;
            //up
            }else if (e.keyCode === 38) {
               
                cameraRotations.x += 2;
                if(cameraRotations.x > 80)cameraRotations.x =80;
            //down
            }else if (e.keyCode === 40) {
                cameraRotations.x -= 2;
                if(cameraRotations.x < -80)cameraRotations.x = -80;
            //add
            }else if (e.keyCode === 107) {
                this.zoomIn();
       
            //subtract
            }else if (e.keyCode === 109) {
                this.zoomOut();
            }
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
            "click":"onMouseClick",
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