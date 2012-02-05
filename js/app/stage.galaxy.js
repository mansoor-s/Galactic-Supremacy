App.Stages.Galaxy = (function() { 
    var galaxyGeometry; 
    var camera;
    var scene;
    var materials= [];
    var starlist;
    //the levels of zoom
    var zoomLevelCurrent = 1;//
    var zoomLevelCount = 50; 
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

    //matrix used for rotating things(any things)
    var rotationMatrix = new THREE.Matrix4();

    return {
        //camera controls ,,,have to be public for the transition between 
        //galaxy and system view
        cameraLookTarget:new THREE.Vector3(0,0,0),
        cameraDistance:40000,
        cameraRotations:new THREE.Vector3(45,0,0),
        
        initialize:function (webgl) {
            controller = webgl;
            //get list of stars from the generator function(for now)
            starlist = createStars();
            
            // Initialize camera
            camera = new THREE.PerspectiveCamera( 45, controller.jqDiv.width() / controller.jqDiv.height(), 1, 60000 );
            
            camera.matrixAutoUpdate = true;
            
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
                //todo :  
                var vector = new THREE.Vector3( starlist[i].x,starlist[i].y,starlist[i].z);
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
            scene.add( particleSystem );
            //initialize postprocessing

            renderModel = new THREE.RenderPass( scene, camera );
            composer = new THREE.EffectComposer( controller.renderer );
            composer.passes = [renderModel, filmPass, effectScreen];

        },

        update: function(){
            //we have to rewrite this one       
            if (ctrPressed) {
            
            }
          
            //updating camera position depending on controlls
            var distanceVector = new THREE.Vector3(0,0,-this.cameraDistance);
            rotationMatrix.setRotationX(controller.degreesToRadians(this.cameraRotations.x));
            distanceVector = rotationMatrix.multiplyVector3(distanceVector);
            rotationMatrix.setRotationY(controller.degreesToRadians(this.cameraRotations.y));
            distanceVector = rotationMatrix.multiplyVector3(distanceVector);
            //i had trouble with just 1 line so i used 3
            camera.position.x = this.cameraLookTarget.x;
            camera.position.y = this.cameraLookTarget.y;
            camera.position.z = this.cameraLookTarget.z;
       
            camera.position.addSelf(distanceVector);
            
            camera.lookAt(this.cameraLookTarget);
            
            
            TWEEN.update();
        },

        render: function(){
            //call render for the stage
            //postprocessing render
            controller.renderer.clear();
            composer.render(0.05);
         
        },

        onKeyDown: function(e) {
            if (e.keyCode === 17) {
                ctrMouse.initX = currentMouse.x;
                ctrMouse.initY = currentMouse.y;
                ctrPressed = true;

            //left
            }else if (e.keyCode === 37) {
                this.cameraRotations.y -= 1
            //right
            }else if (e.keyCode === 39) {
                this.cameraRotations.y += 1
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
                this.cameraDistance -=100;
            //subtract
            }else if (e.keyCode === 109) {
                this.cameraDistance +=100;
            }

        },

        onKeyUp: function(e) {
            if (e.keyCode == 17) {
                ctrPressed = false;
            }
        },

      
        getClosestStar:function(){
            controller.toScreenPrepare(camera);
            var target = starlist[0];
            var targetDistance = 9999;
            
            for (var i = 0; i < starlist.length; i ++ ) {
                if(starlist[i].focused){
                    starlist[i].focused = false;
                } 
                var vector = new THREE.Vector3( starlist[i].x, starlist[i].y, starlist[i].z );
                var pos2d =  controller.toScreenXY(vector);
                var distanceX = Math.abs(pos2d.x - currentMouse.x);
                var distanceY = Math.abs(pos2d.y - currentMouse.y);
                var distance =  Math.sqrt(distanceX*distanceX+distanceY*distanceY);
                if(targetDistance > distance){
                    target = starlist[i]; 
                    target.id = i;
                    targetDistance = distance ;  
                }
            }
            return target;
        },
        zoomIn: function(){
            if (zoomLevelCurrent === zoomLevelCount) {
                return;
            }
            zoomLevelCurrent++;

            //animate camera to new position 
            new TWEEN.Tween( this )
            .to({
                //    cameraDistance: (farestCameraPosition-nearestCameraPosition) - (((farestCameraPosition-nearestCameraPosition)/zoomLevelCount) *zoomLevelCurrent)+nearestCameraPosition
                cameraDistance: (1 / zoomLevelCurrent) * 40000  - 750
            }, 500 )
            .start()

            this.centerOn() 
        },
        zoomOut: function(){
            //change the current zoom level
            if (zoomLevelCurrent === 1) {
                return;
            } 
            zoomLevelCurrent--;

            new TWEEN.Tween( this )
            .to({     
                //   cameraDistance: !levelOne ?  (farestCameraPosition-nearestCameraPosition) - (((farestCameraPosition-nearestCameraPosition)/zoomLevelCount) *zoomLevelCurrent)+nearestCameraPosition: farestCameraPosition
                cameraDistance: (1 / zoomLevelCurrent) * 40000 - 750
            }, 500 )
            .start()

            this.centerOn() 
        },

        //moves the stars so that position is at the center of the screen
        centerOn: function(){
            var position;
       
            if (currentMouse === undefined) {
                position = {
                    x: 0, 
                    y: 0, 
                    z: 0
                };
            } else {
                //method 1:look for intersection with z plane
                position = controller.getIntersectionWithY(camera,currentMouse,0);
            //method 2:look for closest star to cursor
            //  position = this.getClosestStar();
                
            }         
            if(zoomLevelCount === zoomLevelCurrent){
                position = this.getClosestStar();
            } 
            new TWEEN.Tween( this.cameraLookTarget )
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

            currentMouse.x = (event.offsetX / controller.jqDiv.width()) * 2 - 1;
            currentMouse.y = -(event.offsetY / controller.jqDiv.height()) * 2 + 1;
  
            if(delta>0){
                this.zoomIn();
            }else{                                                      
                this.zoomOut();            
            }

        },
        //mouseclick handler
        onMouseClick: function(event){
            currentMouse.x = (event.offsetX / controller.jqDiv.width()) * 2 - 1;
            currentMouse.y = -(event.offsetY / controller.jqDiv.height()) * 2 + 1;
  
            if(zoomLevelCount === zoomLevelCurrent){
                App.Controllers.Network.getSystemInfo(this.getClosestStar().id,controller.switchStages)
            }
          
            this.centerOn();
        },

        onMouseMove: function(event) {
            currentMouse.x = (event.offsetX / controller.jqDiv.width()) * 2 - 1;
            currentMouse.y = -(event.offsetY / controller.jqDiv.height()) * 2 + 1;
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
