(function() {
    "use strict";

    var Galaxy = App.Stages.Galaxy = function(webglController) {
        //this.materials = [];

        this.farestCameraPosition = 10000;
        this.nearestCameraPosition = 200;
        this.cameraDistance = this.farestCameraPosition;
        //the levels of zoom
        this.zoomLevelCurrent = 0;//
        this.zoomLevelCount = 37; 
        this.starSize = 5;

        //flag for when the CTRL key is pressed
        this.ctrPressed = false;
        //holds the coordinates for moving the camera when free camera is enabled
        this.ctrMouse = {
            x: 0,
            y: 0,
            initX: 0,
            initY: 0
        };

        this.currentMouse = {
            x: 0, 
            y: 0
        };

        this.filmPass = new THREE.BloomPass(2.5, 25, 4.0);
        this.effectScreen = new THREE.ShaderPass( THREE.ShaderExtras[ "screen" ] );
        this.effectScreen.renderToScreen = true;

        //matrix used for rotating things(any things)
        this.rotationMatrix = new THREE.Matrix4();

        //********* MAKE GETTER FUNCTION FOR THESE!!
        //camera controls ,,,have to be public for the transition between 
        //galaxy and system view
        this.cameraLookTarget = new THREE.Vector3(0, 0, 0),
        
        this.cameraRotations = new THREE.Vector3(0, 0, 0),


        this.controller = webglController;
        //get list of stars from the generator function(for now)
        this.starlist = createStars();
            
        // Initialize camera
        this.camera = new THREE.PerspectiveCamera( 45, this.controller.$viewport.width() / this.controller.$viewport.height(), 1, 90000 );
            
        this.camera.matrixAutoUpdate = true;
            
        this.cameraDistance = this.farestCameraPosition;
        // Create scene
        this.scene = new THREE.Scene();

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

        //setup DOM event handlers
        this.events = {
            'mousewheel':   'onMouseWheel',
            'click'     :   'onMouseClick',
            'keydown'   :   'onKeyDown',
            'keyup'     :   'onKeyUp',
            'mousemove' :   'onMouseMove'
        };

        // create geometry for the particle system  and add vertices to it
        this.galaxyGeometry = new THREE.Geometry();
        for ( var i = 0; i < this.starlist.length; i ++ ) {
            var vector = new THREE.Vector3( this.starlist[i].x, this.starlist[i].y, this.starlist[i].z );
            this.galaxyGeometry.vertices.push( new THREE.Vertex( vector ) );
            this.galaxyGeometry.colors[i] = new THREE.Color( starColors[0]);
        }

        var starMaterial = new THREE.ParticleBasicMaterial( { 
            size: this.starSize, 
            map: THREE.ImageUtils.loadTexture( "images/sprite2.png" ),
            vertexColors: true,
            //blending:THREE.AdditiveBlending,
            //             depthTest:false,
            alphaTest: .5
        } );

        //declare particle system with material 0
        this.particleSystem = new THREE.ParticleSystem( this.galaxyGeometry, this.starMaterial );
        this.particleSystem.dynamic = true;


        //add it to the scenes
        this.scene.add( this.particleSystem );
        //initialize postprocessing

        this.renderModel = new THREE.RenderPass( this.scene, this.camera );
        this.composer = new THREE.EffectComposer( this.controller.renderer );
        this.composer.passes = [this.renderModel, this.filmPass, this.effectScreen];
    };

    Galaxy.prototype.update = function() {
        //updating camera position depending on controlls
        var distanceVector = new THREE.Vector3(0,0,-this.cameraDistance);
        this.rotationMatrix.setRotationX(App.Utill.degreesToRadians(this.cameraRotations.x));
        this.distanceVector = this.rotationMatrix.multiplyVector3(distanceVector);
        this.rotationMatrix.setRotationY(App.Utill.degreesToRadians(this.cameraRotations.y));
        this.distanceVector = this.rotationMatrix.multiplyVector3(distanceVector);
        
        this.camera.position.x = this.cameraLookTarget.x;
        this.camera.position.y = this.cameraLookTarget.y;
        this.camera.position.z = this.cameraLookTarget.z;
   
        this.camera.position.addSelf(distanceVector);
        
        this.camera.lookAt(this.cameraLookTarget);
        
        TWEEN.update();
    };

    Galaxy.prototype.render = function() {
        if (this.ctrPressed) {
            //camera.position.x += ( mouseX - camera.position.x ) * 0.01;
            //camera.position.y += ( -mouseY - camera.position.y ) * 0.01;
            this.camera.lookAt( {
                x: ( mouseX - camera.position.x ) * 0.01, 
                y: ( -mouseY - camera.position.y ) * 0.01, 
                z: 0
            } ); 
        }
        //postprocessing render
        this.controller.renderer.clear();
        this.composer.render();
    };


    Galaxy.prototype.onKeyDown = function(e) {
        if (e.keyCode === 17) {
            this.ctrMouse.initX = this.currentMouse.x;
            this.ctrMouse.initY = this.currentMouse.y;
            this.ctrPressed = true;

        //left
        }else if (e.keyCode === 37) {
            this.cameraRotations.y -= .5
        //right
        }else if (e.keyCode === 39) {
            this.cameraRotations.y += .5
        //up
        }else if (e.keyCode === 38) {
            this.cameraRotations.x += .5
        //down
        }else if (e.keyCode === 40) {
            this.cameraRotations.x -= .5
        //add
        }else if (e.keyCode === 107) {
            this.cameraDistance -=1;
        //subtract
        }else if (e.keyCode === 109) {
            this.cameraDistance +=1;
        }
    };


    Galaxy.prototype.onKeyUp = function(e) {
        if (e.keyCode == 17) {
            ctrPressed = false;
        }
    };

    Galaxy.prototype.getClosestStar = function(xyPos) {
        xyPos.x = ( xyPos.x / controller.$viewport.width() ) * 2 - 1;
        xyPos.y =  -( xyPos.y / controller.$viewport.height()) * 2 + 1;
        
        App.Utill.toScreenPrepare(camera);
        
        var target = starlist[0];
        var targetDistance = 9999;
        
        for (var i = 0; i < this.starlist.length; i ++ ) {
            if(this.starlist[i].focused){
                this.starlist[i].focused = false;
            } 
            var vector = new THREE.Vector3( starlist[i].x, starlist[i].y, starlist[i].z );
            var pos2d =  controller.toScreenXY(vector);
            var distanceX = Math.abs(pos2d.x - xyPos.x);
            var distanceY = Math.abs(pos2d.y - xyPos.y);
            var distance =  Math.sqrt(distanceX * distanceX + distanceY * distanceY);
            if(targetDistance > distance){
                target = starlist[i];  
                targetDistance = distance ;  
            }
        }
        return target;
    };


    Galaxy.prototype.zoomIn = function(xyPos){
        if (this.zoomLevelCurrent === this.zoomLevelCount) {
            return;
        }

        this.zoomLevelCurrent++;

        //animate camera to new position 
        new TWEEN.Tween( this )
        .to({
            cameraDistance: 1000
        }, 500 )
        .start()

        //this.centerOn(xyPos) 
    };




    Galaxy.prototype.zoomOut = function(xyPos){
        var levelOne = false
        //change the current zoom level
        if (this.zoomLevelCurrent === 0) {
            return;
        } else if (this.zoomLevelCurrent === 1) {
            levelOne = true
        }
        this.zoomLevelCurrent--;

        new TWEEN.Tween(this)
        .to({     
            cameraDistance: 10000
        }, 500 )
        .start()

        //this.centerOn(xyPos) 
    };


    //moves the stars so that position is at the center of the screen
    Galaxy.prototype.centerOn = function(mousePosition){
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
            position = this.controller.getWorldXYZ(this.camera, mousePosition,z);
        //method 2:look for closest star to cursor
        // position = this.getClosestStar(mousePosition);
            
        }         
 
        new TWEEN.Tween( this.cameraLookTarget )
        .to({
            x: position.x,
            y: position.y,
            z:position.z
        }, 500 )
        .start()
    };

    Galaxy.prototype.onMouseWheel = function(event, delta){
        event.preventDefault();

        //if free camera mode is enabled do nothing because nasty thing will happen
        if (this.ctrPressed) {
            return;
        }

        var clickX= event.pageX - $(event.target).position().left;
        var clickY= event.pageY - $(event.target).position().top;
        var mouseXY = {
            x: clickX,
            y: clickY
        };

        if(delta > 0){
            this.zoomIn(mouseXY);
        }else{                                                      
            this.zoomOut(mouseXY);            
        }

    };


    Galaxy.prototype.onMouseClick = function(event) {
        this.centerOn({
            x: event.offsetX, 
            y: event.offsetY
        });
    }

    Galaxy.prototype.onMouseMove = function(event) {
        this.currentMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.currentMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    Galaxy.prototype.onEvent = function(event, delta) {
        for (var type in this.events){
            if (event.type === type){
                this[this.events[type]](event, delta); 
            }
        }
    };

})();