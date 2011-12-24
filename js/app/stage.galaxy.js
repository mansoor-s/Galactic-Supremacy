App.Stages.Galaxy = (function() { 
    var galaxyGeometry; 
    var camera;
    var scene;
    var materials= [];
    var starlist;
    var farestCameraPosition = 5000;
    var nearestCameraPosition = 1000;
    //the levels of zoom
    var zoomLevelCurrent = 0;//
    var zoomLevelCount =10; 
    var controller;
    var particleSystem;
    return {
        initialize:function (webgl) {
            controller = webgl;
            //get list of stars from the generator function(for now)
            //starlist = createStars();
            starlist = [];
            starlist[0] = {x:1000,y:0};
            starlist[1] = {x:-1000,y:0}; 
            starlist[2] = {x:5000,y:0};
            starlist[3] = {x:-5000,y:0}; 
            // Initialize camera
            camera = new THREE.PerspectiveCamera( 75, controller.jqDiv.width() / controller.jqDiv.height(), 1, 5000 );
            camera.position= {x:0,y:0,z:farestCameraPosition };  

            // Create scene
            scene = new THREE.Scene();

            //declare materials
            materials[0] = new THREE.ParticleBasicMaterial( { 
                size: 150, 
                color:0x0000ff,
                map: THREE.ImageUtils.loadTexture( "images/spark1.png" ),
                blending: THREE.AdditiveBlending,
                depthTest: false,
                transparent : true 
            } );

            // create geometry for the particle system  and add vertices to it
            galaxyGeometry = new THREE.Geometry();
            for ( i = 0; i < starlist.length; i ++ ) {

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
                x:camera.position.x,
                y:camera.position.y,
                z:farestCameraPosition - (zoomLevelCurrent*((farestCameraPosition-nearestCameraPosition)/zoomLevelCount))
            }, 500 )
            .start();
            this.centerOn(xy) 
        },
        zoomOut:function(xy){
            //change the current zoom level
            zoomLevelCurrent -= zoomLevelCurrent > 0 ? 1 : 0; 
            //animate camera to new position
            new TWEEN.Tween( camera.position )
            .to({
                x:camera.position.x,
                y:camera.position.y,
                z:farestCameraPosition - (zoomLevelCurrent*((farestCameraPosition-nearestCameraPosition)/zoomLevelCount))
            }, 500 )
            .start();
            this.centerOn(xy)
        },
        //moves the stars so that position is at the center of the screen
        centerOn:function(mousePosition){
         
            var position = controller.getWorldXYZ(camera,mousePosition,0);
          new TWEEN.Tween( camera.position )
            .to({
                x:position.x,
                y:position.y,
                z:camera.position.z
            }, 500 )
            .start()


        },
        //mousewheel handler
        onMouseWheel:function(event,delta){           
            if(delta>0){
                this.zoomIn({x:event.offsetX,y:event.offsetY});
            }else{                                                      
                this.zoomOut({x:event.offsetX,y:event.offsetY});            
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