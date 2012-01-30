App.Stages.StarSystem = (function() { 
    var controller;
    var scene;
    var camera;
    var materials = {};
    var meshes = {};
    var shapes = {};
    //keeps the intersected object for now
    var torus,torus2;
    var SELECTED;
    var rotationMatrix = new THREE.Matrix4();
     
    return {
        //camera controls ,,,have to be public for the transition between 
        //galaxy and system view
        cameraLookTarget:new THREE.Vector3(0,0,0),
        cameraDistance:70,
        cameraRotations:new THREE.Vector3(45,0,0),
       
        initialize:function (webgl) {
            controller = webgl;
            
            // Initialize camera
            camera = new THREE.PerspectiveCamera( 45, controller.jqDiv.width() / controller.jqDiv.height(), 1, 200 );
          
            camera.matrixAutoUpdate = true;
                
          
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
            meshes['sphere'] = new THREE.SphereGeometry( 1, 64, 32 );
            meshes['torus'] = new THREE.TorusGeometry(1.2, 0.1, 2, 60)
            shapes['circle'] = new THREE.Shape();
            shapes['circle'].moveTo(0,0);
            shapes['circle'].arc( 0, 0, 1, 0, Math.PI*2, false );
        },
        _initializeMaterials:function(){
            //initialized all materials
            //todo:add also textured materials
          
            materials['torus'] = new THREE.MeshLambertMaterial( {
                ambient:0x008888,
                color: 0x00ffff
            } ); 
            materials['grid'] =  new THREE.LineBasicMaterial( {
                color: 0x293A45, 
                opacity: 0.9, 
                smooth:true // not sure if there is even smooth
            } );

            materials['wireframe'] = new THREE.MeshBasicMaterial( {
                color: 0x293A45, 
                wireframe: true
            } );
            materials['star'] = new THREE.MeshLambertMaterial(
            {
                ambient:0xbbbbbb,
              //  color: 0x888888,
                map: THREE.ImageUtils.loadTexture( 'images/textures/sun1.png')
  
            });
           
            materials['desert'] = new THREE.MeshLambertMaterial(
            {
                ambient: 0x555555,
                color: 0x888888,
                map: THREE.ImageUtils.loadTexture( 'images/textures/desert1.jpg')
  
            });
            materials['volcanic'] = new THREE.MeshLambertMaterial(
            {
                color: 0x880000,
                ambient: 0x550000
            });
            materials['gasgiant'] = new THREE.MeshLambertMaterial(
            {
                ambient: 0x005500,
                color: 0x008800
            });
          
            materials['barren'] = new THREE.MeshLambertMaterial(
            {
                ambient: 0x555555,
                color: 0x888888,
                map: THREE.ImageUtils.loadTexture( 'images/textures/barren1.jpg')
      
            });
            materials['terran'] = new THREE.MeshLambertMaterial(
            {
                ambient: 0x555555,
                color: 0x888888,
                map: THREE.ImageUtils.loadTexture( 'images/textures/terran1.jpg')
    
            });
            materials['ice'] = new THREE.MeshLambertMaterial(
            {
                ambient: 0x05555,
                color: 0x008888
            });
        },
        _initializeLights:function(){
            scene.add( new THREE.AmbientLight( 0xffffff ) );

            // create a point light
            scene.add( new THREE.PointLight( 0xFFFFFF ,1));
        },
        //shows differend system depending on the data given
        showSystem: function(data){
            //adding torus
            torus = new THREE.Mesh(meshes['torus'],materials['torus']);
            torus2 = new THREE.Mesh(meshes['torus'],materials['torus']);
            torus.rotation.x = controller.degreesToRadians(90);
            torus2.rotation.x = controller.degreesToRadians(90);
            torus.scale.multiplyScalar(data.star.size);
            torus.tag={
                object:'torus', 
                parent:scene
            }
            torus2.tag =  torus.tag;
            
            scene.add(torus);
            torus.add(torus2);
                
            //tests with the tourus  
            ta = new TWEEN.Tween( torus.rotation )
            .to({
                x:controller.degreesToRadians(450)
            }, 4000 )
            .onComplete(function(){
                torus.rotation.x = controller.degreesToRadians(90);
                ta.start();
            })
            .start()      
                    
            //adding solar objects
            var star = new THREE.Mesh( THREE.GeometryUtils.clone(meshes['sphere']), materials['star'] );
            //since default size of the meshes is 1 ..we just multiply
            //it by the size of the object
            star.scale.multiplyScalar(data.star.size)
            //adding some meta data to keep track of the object more easily
            star.tag = {
                object:'star',
                data:data.star,
                parent:scene
            }
            scene.add( star );
            //matrix that will rotate the vectors
            for(var i = 0;i<data.planets.length;i++){
                var planet = new THREE.Mesh( THREE.GeometryUtils.clone(meshes['sphere']), materials[data.planets[i].type] );
                planet.scale.multiplyScalar(data.planets[i].size);
                //set the position.and then rotate it...
                planet.position.set(1,0,0).multiplyScalar(data.planets[i].distance);
                rotationMatrix.setRotationY(controller.degreesToRadians(360*data.planets[i].orbit));
                rotationMatrix.multiplyVector3(planet.position);
          
                planet.tag = {
                    object:'planet'+i,
                    data:data.planets[i],
                    parent:scene
                }
                scene.add( planet );
                var grid  = new THREE.Line( shapes['circle'].createPointsGeometry(60),materials['grid'])
                grid.rotation.x = controller.degreesToRadians(90);
                grid.scale.multiplyScalar(data.planets[i].distance)
         
                grid.tag={
                    object:'grid'+i, 
                    parent:scene
                }
           
                scene.add(grid);
                for(var i2 = 0;i2<data.planets[i].moons.length;i2++){
                    var moon = new THREE.Mesh( THREE.GeometryUtils.clone(meshes['sphere']), materials[data.planets[i].moons[i2].type] );
                    moon.scale.multiplyScalar(0.5);
                    //set distance(from planet)
                    moon.position.set(1,0,0).multiplyScalar(i2+1+data.planets[i].size);
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
                    grid.scale.multiplyScalar(i2+1+data.planets[i].size)
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
            rotationMatrix.setRotationX(controller.degreesToRadians(this.cameraRotations.x));
            distanceVector = rotationMatrix.multiplyVector3(distanceVector);
            rotationMatrix.setRotationY(controller.degreesToRadians(this.cameraRotations.y));
            distanceVector = rotationMatrix.multiplyVector3(distanceVector);
            
            camera.position.x = this.cameraLookTarget.x;
            camera.position.y = this.cameraLookTarget.y;
            camera.position.z = this.cameraLookTarget.z;
       
            camera.position.addSelf(distanceVector);
            
            camera.lookAt(this.cameraLookTarget);
            
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

                    torus.position=intersects[ 0 ].object.position.clone();
                    torus.scale = intersects[ 0 ].object.scale.clone();
                    SELECTED = intersects[ 0 ].object;
                    
                    new TWEEN.Tween( this.cameraLookTarget )
                    .to(intersects[ 0 ].object.position, 1500 )
                    .start()
                    
                }

            } else {
                SELECTED = null;
                torus.position = scene.position.clone()
            }
        },
        onMouseWheel:function(event,delta){
            // this.onMouseClick(event);
            event.preventDefault();
            if(delta>0){
                this.cameraDistance -= 2;
                if(this.cameraDistance < 10)this.cameraDistance = 10;
            }else{                                                      
                this.cameraDistance += 2;
                if(this.cameraDistance > 150)this.cameraDistance = 150;     
            }
        }
        ,
        onKeyDown:function(e){
            //left
            if (e.keyCode === 37) {
                this.cameraRotations.y -= 2;
            //right
            }else if (e.keyCode === 39) {
                this.cameraRotations.y += 2;
            //up
            }else if (e.keyCode === 38) {
               
                this.cameraRotations.x += 2;
                if(this.cameraRotations.x > 80)this.cameraRotations.x =80;
            //down
            }else if (e.keyCode === 40) {
                this.cameraRotations.x -= 2;
                if(this.cameraRotations.x < -80)this.cameraRotations.x = -80;
            //add
            }else if (e.keyCode === 107) {
                this.cameraDistance -= 2;
                if(this.cameraDistance < 10)this.cameraDistance = 10;
       
            //subtract
            }else if (e.keyCode === 109) {
                this.cameraDistance += 2;
                if(this.cameraDistance > 150)this.cameraDistance = 150;
            }
        },
        onKeyUp:function(e){
            
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