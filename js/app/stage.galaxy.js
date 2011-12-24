App.Stages.Galaxy = (function() { 
    var galaxyGeometry; 
    var camera;
    var scene;
    var materials= [];
    var starlist;
    var farestCameraPosition = 5000;
    var nearestCameraPosition = 100;
    //the levels of zoom
    var zoomLevelCurrent = 0;//
    var zoomLevelCount =10; 
    var controller;
    var particleSystem;
    return {
        initialize:function (webgl) {
            controller = webgl;
            //get list of stars from the generator function(for now)
            starlist = createStars();
            // Initialize camera
            camera = new THREE.PerspectiveCamera( 90, controller.jqDiv.width() / controller.jqDiv.height(), 1, 10000 );
            camera.position= {x:0,y:0,z:farestCameraPosition };  

            // Create scene
            scene = new THREE.Scene();

            //declare materials
            materials[0] = new THREE.ParticleBasicMaterial( { 
                size: 10, 
                map: THREE.ImageUtils.loadTexture( "images/spark1.png" ),
                blending: THREE.AdditiveBlending,
                transparent : true

            } );

            // create geometry for the particle system  and add vertices to it
            galaxyGeometry = new THREE.Geometry();
            for ( i = 0; i < starlist.length; i ++ ) {
                galaxyGeometry.colors[i] = 0x0000ff
                vector = new THREE.Vector3( starlist[i].x,starlist[i].y,0 );
                galaxyGeometry.vertices.push( new THREE.Vertex( vector ) );

            }

            //declare particle system with material 0
            particleSystem = new THREE.ParticleSystem( galaxyGeometry, materials[0] );
            particleSystem.dynamic = true;



            //add it to the scene
            scene.add( particleSystem );

        },
        update:function(){

        },
        render:function(){
            //call render for the stage
            TWEEN.update();        
            controller.renderer.render(scene,camera);
        },
        zoomIn:function(xy){
            //animate camera to new position 
            zoomLevelCurrent += zoomLevelCurrent < zoomLevelCount ? 1 : 0; 
            //animate camera to new position 

            new TWEEN.Tween( camera.position )
            .to({
                z:farestCameraPosition - (zoomLevelCurrent*((farestCameraPosition-nearestCameraPosition)/zoomLevelCount))
            }, 500 )
            .start()
            this.centerOn(xy,true) 
        },
        zoomOut:function(xy){
            //change the current zoom level
            zoomLevelCurrent -= zoomLevelCurrent > 0 ? 1 : 0;
            new TWEEN.Tween(  camera.position  )
            .to({     
                     z:farestCameraPosition - (zoomLevelCurrent*((farestCameraPosition-nearestCameraPosition)/zoomLevelCount))
            }, 500 )
            .start()
            this.centerOn(xy,true) 
        },
        //moves the stars so that position is at the center of the screen
        centerOn:function(mousePosition,zooming){
            zooming = zooming || false;
            var position = controller.getWorldXYZ(camera,mousePosition,0);
            //calculating partial traveling distance
            if (zooming) {
                var travelvector =  position.subSelf( camera.position );
                travelvector = travelvector.multiplyScalar(1);

                position.x = camera.position.x  + travelvector.x;
                position.y = camera.position.y  + travelvector.y;
            }            
            new TWEEN.Tween( camera.position )
            .to({
                x:position.x,
                y:position.y
            }, 500 )
            .start()


        },
        //mousewheel handler
        onMouseWheel:function(event,delta){           
            var clickX= event.pageX - $(event.target).position().left;
            var clickY= event.pageY - $(event.target).position().top;

            if(delta>0){
                this.zoomIn({x:clickX,y:clickY});
            }else{                                                      
                this.zoomOut({x:clickX,y:clickY});            
            }

        },
        //mouseclick handler
        onMouseClick:function(event){

            var clickX= event.pageX - $(event.target).position().left;
            var clickY= event.pageY - $(event.target).position().top;

            this.centerOn({x:clickX,y:clickY});
        },
        //declaring all event handlers                         
        events:{
            'mousewheel': 'onMouseWheel',
            'click': 'onMouseClick'
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