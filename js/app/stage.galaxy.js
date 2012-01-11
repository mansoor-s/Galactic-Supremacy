App.Stages.Galaxy = (function() { 
    var galaxyGeometry; 
    var camera;
    var scene;
    var materials= [];
    var starlist;
    var farestCameraPosition = 12000;
    var nearestCameraPosition = 200;
    //the levels of zoom
    var zoomLevelCurrent = 0;//
    var zoomLevelCount = 37; 
    var controller;
    var particleSystem;
    var starSize = 5;

    //flag for when the CTRL key is pressed
    var ctrPressed = false;
    //holds the coordinates for moving the camera when free camera is enabled
    var ctrMouse = {
        x: 0,
        y: 0,
        initX: 0,
        initY: 0
    };

    var currentMouse = {
        x: 0, 
        y: 0
    };

    //postprocessing
    var renderModel, composer;
    var filmPass = new THREE.BloomPass(2.5, 25, 4.0);
    var effectScreen = new THREE.ShaderPass( THREE.ShaderExtras[ "screen" ] );
    effectScreen.renderToScreen = true;
	
    //this is where the camea will look at when free camera is enable
    //ivankuzev:i am making it object3d so i can use all of its functions
    //rotations and scale too
    var cameraRig;

    return {
        initialize:function (webgl) {
            controller = webgl;
            //get list of stars from the generator function(for now)
            starlist = createStars();
            
            // Initialize camera
            camera = new THREE.PerspectiveCamera( 90, controller.jqDiv.width() / controller.jqDiv.height(), 1, 30000 );
            camera.position= {
                x: 0, 
                y: 0, 
                z: farestCameraPosition
            };  
            camera.matrixAutoUpdate = true;

            cameraRig = new THREE.Object3D();
            cameraRig.eulerOrder = "ZYX";
            cameraRig.add(camera);
            cameraRig.matrixAutoUpdate = true;
            // Create scene
            scene = new THREE.Scene();

            var starColors = [
            '0x293a45',
            '0x293a45',
            '0x6f90a1',
            '0x677FB5',
            '0x293a45',
            '0x2D2DB3',
            '0x6f90a1',
            '0x677FB5',
            '0x6f90a1',
            '0x6f90a1'
            ];

            // create geometry for the particle system  and add vertices to it
            galaxyGeometry = new THREE.Geometry();
            for ( i = 0; i < starlist.length; i ++ ) {
                var vector = new THREE.Vector3( starlist[i].x, starlist[i].y, starlist[i].z );
                galaxyGeometry.vertices.push( new THREE.Vertex( vector ) );
                galaxyGeometry.colors[i] = new THREE.Color( starColors[starlist[i].type] );
            }

            var starMaterial = new THREE.ParticleBasicMaterial( { 
                size: starSize, 
                map: THREE.ImageUtils.loadTexture( "images/sprite2.png" ),
                vertexColors: true,
                //blending:THREE.AdditiveBlending,
   //             depthTest:false,
				alphaTest: .5
            } );

            //declare particle system with material 0
            particleSystem = new THREE.ParticleSystem( galaxyGeometry, starMaterial );
            particleSystem.dynamic = true;


            //add it to the scenes
            scene.add(cameraRig);
            scene.add( particleSystem );
            //initialize postprocessing

            renderModel = new THREE.RenderPass( scene, camera );
            composer = new THREE.EffectComposer( controller.renderer );
            composer.passes = [renderModel, filmPass, effectScreen];

        },

        update: function(){
            TWEEN.update();
        },

        render: function(){
            //call render for the stage

            if (ctrPressed) {
                //camera.position.x += ( mouseX - camera.position.x ) * 0.01;
                //camera.position.y += ( -mouseY - camera.position.y ) * 0.01;
                camera.lookAt( {
                    x: ( mouseX - camera.position.x ) * 0.01, 
                    y: ( -mouseY - camera.position.y ) * 0.01, 
                    z: 0
                } ); 
            }
            //postprocessing render
            controller.renderer.clear();
            composer.render(0.05);
         
         //   controller.renderer.render(scene,camera);

        },

        onKeyDown: function(e) {
            if (e.keyCode === 17) {
                ctrMouse.initX = currentMouse.x;
                ctrMouse.initY = currentMouse.y;
                ctrPressed = true;
                console.debug(cameraRig);
            //left
            }else if (e.keyCode === 37) {
                cameraRig.rotation.y -= controller.degreesToRadians(1);
            //right
            }else if (e.keyCode === 39) {
                cameraRig.rotation.y += controller.degreesToRadians(1);
            //up
            }else if (e.keyCode === 38) {
                cameraRig.rotation.x -= controller.degreesToRadians(1);
            //down
            }else if (e.keyCode === 40) {
                cameraRig.rotation.x += controller.degreesToRadians(1);
            //add
            }else if (e.keyCode === 107) {
                //this zooming doesnt work..for now
                cameraRig.scale.x+=0.1;
                cameraRig.scale.y+=0.1;
                cameraRig.scale.z+=0.1;

            //subtract
            }else if (e.keyCode === 109) {
                cameraRig.scale.x-=0.1;
                cameraRig.scale.y-=0.1;
                cameraRig.scale.z-=0.1;
            }

        },

        onKeyUp: function(e) {
            if (e.keyCode == 17) {
                ctrPressed = false;
            }
        },

        zoomIn: function(xy){
            if (zoomLevelCurrent === zoomLevelCount) {
                return;
            }
            zoomLevelCurrent++;

            //animate camera to new position 
            new TWEEN.Tween( camera.position )
            .to({
                z: (1 / zoomLevelCurrent) * 6000  - 100
            }, 500 )
            .start()

            this.centerOn(xy) 
        },
        getClosestStar:function(xy){
            xy.x = ( xy.x / controller.jqDiv.width() ) * 2 - 1;
            xy.y =  -( xy.y / controller.jqDiv.height()) * 2 + 1;
            controller.toScreenPrepare(camera);
            var target = starlist[0];
            var targetDistance = 9999;
            
            for (var i = 0; i < starlist.length; i ++ ) {
                if(starlist[i].focused){
                    starlist[i].focused = false;
                } 
                var vector = new THREE.Vector3( starlist[i].x, starlist[i].y, starlist[i].z );
                var pos2d =  controller.toScreenXY(vector);
                var distanceX = Math.abs(pos2d.x - xy.x);
                var distanceY = Math.abs(pos2d.y - xy.y);
                var distance =  Math.sqrt(distanceX*distanceX+distanceY*distanceY);
                if(targetDistance > distance){
                    target = starlist[i];  
                    targetDistance = distance ;  
                }
            }
            return target;
        },
        zoomOut: function(xy){
            var levelOne = false
            //change the current zoom level
            if (zoomLevelCurrent === 0) {
                return;
            } else if (zoomLevelCurrent === 1) {
                levelOne = true
            }
            zoomLevelCurrent--;

            new TWEEN.Tween(  camera.position  )
            .to({     
                z: !levelOne ? (1 / zoomLevelCurrent) * 6000 - 100: farestCameraPosition
            }, 500 )
            .start()

            this.centerOn(xy) 
        },

        //moves the stars so that position is at the center of the screen
        centerOn: function(mousePosition){
            var position;
       
            if (mousePosition === undefined) {
                position = {
                    x: 0, 
                    y: 0, 
                    z: 0
                };
            } else {
                //method 1:look for intersection with z plane
                var z = 0;
                position = controller.getWorldXYZ(camera,mousePosition,z);
            //method 2:look for closest star to cursor
            // position = this.getClosestStar(mousePosition);
                
            }         
     
            new TWEEN.Tween( cameraRig.position )
            .to({
                x: position.x,
                y: position.y,
                z:position.z
            }, 500 )
            .start()
          

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
        //mouseclick handler
        onMouseClick: function(event){

          
            this.centerOn({
                x: event.offsetX, 
                y: event.offsetY
            });
        },

        onMouseMove: function(event) {
            currentMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            currentMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        },

        //declaring all event handlers                         
        events: {
            'mousewheel': 'onMouseWheel',
            'click': 'onMouseClick',
            'keydown': 'onKeyDown',
            'keyup': 'onKeyUp',
            'mousemove': 'onMouseMove'
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
})();
