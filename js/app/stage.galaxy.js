App.Stages.Galaxy = (function() { 
    var galaxyGeometry; 
    var camera;
    var scene;
    var materials= [];
    var starlist;
    return {
         initialize:function (webgl) {
            starlist = createStars();
            // Initialize camera
            camera = new THREE.PerspectiveCamera( 75, webgl.jqDiv.width() / webgl.jqDiv.height(), 1, 5000 );
            camera.position= {x:0,y:0,z:5000 };  

            // Create scene
            scene = new THREE.Scene();

            //declare materials
            materials[0] = new THREE.ParticleBasicMaterial( {
                size: 20,
                color:0xffffff,
                map:THREE.ImageUtils.loadTexture( "images/star0.png" ), 
                blending: THREE.AdditiveBlending,
                transparent: true
            } );
            // create geometry for the particle system  and add vertices to it
            galaxyGeometry = new THREE.Geometry();
            for ( i = 0; i < starlist.length; i ++ ) {

                vector = new THREE.Vector3( starlist[i].x,starlist[i].y,0 );
                galaxyGeometry.vertices.push( new THREE.Vertex( vector ) );

            }
            //declare particle system with material 0
            var particle = new THREE.ParticleSystem( galaxyGeometry, materials[0] );
            //add it to the scene
            scene.add( particle );

        },
        update:function(webgl){

        },
        render:function(webgl){
            //call render for the stage
            webgl.renderer.render(scene,camera);
        }
    }
})();