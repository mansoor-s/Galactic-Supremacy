App.Stages.Galaxy = (function() { 
    var galaxyGeometry; 
    var camera;
    var scene;
    var materials= [];
    var starlist;
    var farestCameraPosition = 12000;
    var nearestCameraPosition = 230;
    //the levels of zoom
    var zoomLevelCurrent = 0;//
    var zoomLevelCount = 50; 
    var controller;
    var particleSystem;
    var starSize = 3;
    
    //used for calculating star size with respect to camera z location
    var currentStarSize = 10;
    
    //flag for when the CTRL key is pressed
    var ctrPressed = false;
    //holds the coordinates for moving the camera when free camera is enabled
    var ctrMouse = {
        x: 0,
        y: 0,
        initX: 0,
        initY: 0
    };
    
    var currentMouse = {x: 0, y: 0};
    
    //this is where the camea will look at when free camera is enabled
    var pointOfIntrest = {x: 0, y: 0, z: 0};
    
    return {
        initialize:function (webgl) {
            controller = webgl;
            //get list of stars from the generator function(for now)
            starlist = createStars();
            // Initialize camera
            camera = new THREE.PerspectiveCamera( 90, controller.jqDiv.width() / controller.jqDiv.height(), 1, 15000 );
            camera.position= {x: 0, y: 0, z: farestCameraPosition };  

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
                map: THREE.ImageUtils.loadTexture( "images/star-sprite.png" ),
                blending: THREE.AdditiveBlending,
                vertexColors: true
            } );
            
            //declare particle system with material 0
            particleSystem = new THREE.ParticleSystem( galaxyGeometry, starMaterial );
            particleSystem.dynamic = true;



            //add it to the scene
            scene.add( particleSystem );

        },
        
        update: function(){

        },
        
        render: function(){
            //call render for the stage
            
            if (ctrPressed) {
                camera.position.x += ( mouseX - camera.position.x ) * 0.01;
                camera.position.y += ( -mouseY - camera.position.y ) * 0.01;
                camera.lookAt( pointOfIntrest ); 
            }
            
            
            TWEEN.update();
            controller.renderer.render(scene,camera);
            
        },
        
        onKeyDown: function(e) {
            if (e.keyCode == 17) {
                ctrMouse.initX = currentMouse.x;
                ctrMouse.initY = currentMouse.y;
                ctrPressed = true;
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
            
            this.centerOn(xy,true) 
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
            
            this.centerOn(xy, true) 
        },
        
        //moves the stars so that position is at the center of the screen
        centerOn: function(mousePosition,zooming){
            zooming = zooming || false;
            var position;
            
            if (mousePosition === undefined) {
                position = {x: 0, y: 0, z: 0};
            } else {
                var z = 0;
                position = controller.getWorldXYZ(camera,mousePosition,0);
            }
            
            this.pointOfIntrest = position;
            
            //calculating partial traveling distance
            if (zooming) {
                var travelvector =  position.subSelf( camera.position );
                travelvector = travelvector.multiplyScalar(1);
    
                position.x = camera.position.x  + travelvector.x;
                position.y = camera.position.y  + travelvector.y;
            }
            
            new TWEEN.Tween( camera.position )
            .to({
                x: position.x,
                y: position.y
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

            if(delta>0){
                this.zoomIn({x:clickX,y:clickY});
            }else{                                                      
                this.zoomOut({x:clickX,y:clickY});            
            }

        },
        //mouseclick handler
        onMouseClick: function(event){

            var clickX= event.pageX - $(event.target).position().left;
            var clickY= event.pageY - $(event.target).position().top;

            this.centerOn({x: clickX, y: clickY});
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