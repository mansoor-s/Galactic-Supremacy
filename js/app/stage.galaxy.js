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
    return {
        initialize:function (webgl) {
            //get list of stars from the generator function(for now)
            starlist = createStars();
            // Initialize camera
            camera = new THREE.PerspectiveCamera( 75, webgl.jqDiv.width() / webgl.jqDiv.height(), 1, 5000 );
            camera.position= {x:0,y:0,z:farestCameraPosition };  

            // Create scene
            scene = new THREE.Scene();

            //declare materials
            materials[0] = new THREE.ParticleBasicMaterial( { 
                size: 20, 
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
            var particle = new THREE.ParticleSystem( galaxyGeometry, materials[0] );
            particle.dynamic = true;          



            //add it to the scene
            scene.add( particle );

        },
        update:function(webgl){
            TWEEN.update();
        },
        render:function(webgl){
            //call render for the stage
            webgl.renderer.render(scene,camera);
        },
        zoomIn:function(){
            //animate camera to new position 
            zoomLevelCurrent += zoomLevelCurrent < zoomLevelCount ? 1 : 0; 
            //animate camera to new position 
            new TWEEN.Tween( camera.position )
            .to({
                x:camera.position.x,
                y:camera.position.y,
                z:farestCameraPosition - (zoomLevelCurrent*((farestCameraPosition-nearestCameraPosition)/zoomLevelCount))
            }, 100 )
            .start();
        },
        zoomOut:function(){
            //change the current zoom level
            zoomLevelCurrent += zoomLevelCurrent < zoomLevelCount ? 1 : 0; 
            //animate camera to new position
            new TWEEN.Tween( camera.position )
            .to({
                x:camera.position.x,
                y:camera.position.y,
                z:farestCameraPosition - (zoomLevelCurrent*((farestCameraPosition-nearestCameraPosition)/zoomLevelCount))
            }, 100 )
            .start();
        },
        //mousewheel handler
        onMouseWheel:function(event,delta){           
            if(delta>0){
                this.zoomIn();
            }else{
                this.zoomOut();            
            }

        },
        //declaring all event handlers
        events:{
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
})();