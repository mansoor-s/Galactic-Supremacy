var container, stats;

var cameraTarget;
var mouseX = 0, mouseY = 0;mouseZ = 0;
var starlist;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;  

var camera, scene, renderer, particles = [], geometry, materials = [], parameters, i, h, color;


$(document).ready(function() {
    init();
});

function init() {
    starlist = createStars();
    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 5000 );
    camera.position.z = 1000;

    scene = new THREE.Scene();

    cameraTarget = scene.position;
    /*
    material.blue = new THREE.ParticleBasicMaterial( { map: new THREE.Texture( generateSprite('blue') ), blending: THREE.AdditiveBlending } );
    material.green = new THREE.ParticleBasicMaterial( { map: new THREE.Texture( generateSprite('green') ), blending: THREE.AdditiveBlending } );
    material.red = new THREE.ParticleBasicMaterial( { map: new THREE.Texture( generateSprite('red') ), blending: THREE.AdditiveBlending } );
    material.yellow = new THREE.ParticleBasicMaterial( { map: new THREE.Texture( generateSprite('yellow') ), blending: THREE.AdditiveBlending } );
    */
    materials[1] = new THREE.ParticleBasicMaterial( {
        size: 20,
        color:0xffffff,
        map:THREE.ImageUtils.loadTexture( "disc.png" ),  
        blending: THREE.AdditiveBlending,
        transparent: true
    } );
    materials[0] = new THREE.ParticleBasicMaterial( {
        size: 20,
        color:0xffffff,
        map:THREE.ImageUtils.loadTexture( "disc.png" ), 
        blending: THREE.AdditiveBlending,
        transparent: true
    } );

    geometry = new THREE.Geometry();

    for ( i = 0; i < starlist.length; i ++ ) {

        vector = new THREE.Vector3( starlist[i].x,starlist[i].y,0 );
        geometry.vertices.push( new THREE.Vertex( vector ) );

    }

    for ( var i = 0; i < 1; i++ ) {

        var particle = new THREE.ParticleSystem( geometry, materials[1] );




        scene.add( particle );
    }
    //canvas renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );
    //zooms in (and centers)
    $(container).bind('mousewheel', function(event, delta, deltaX, deltaY) {
        switch (deltaY) {
            case 1:
                zoomIn();
                break;
            case -1:
                zoomOut();
                break;
        }
    });
    $(container).bind('mousemove',function(event){
        var target = null;
        var targetDistance = 10000;
        for(istar in particles){
            if(particles[istar].visible){
                if(particles[istar].material === material.yellow ){
                    particles[istar].material =  material[starlist[istar].color]
                }
                var pos2d = toScreenXY(particles[istar].position,camera,$(container));

                if ((Math.abs(pos2d.x - event.offsetX) < 20) && (Math.abs(pos2d.y - event.offsetY) < 20)){
                    distanceX = Math.abs(pos2d.x - event.offsetX);
                    distanceY = Math.abs(pos2d.x - event.offsetX);
                    distance =  Math.sqrt(distanceX*distanceX+distanceY*distanceY);
                    if(target === null){
                        target = istar;  
                        targetDistance = distance ;
                    }else if(targetDistance > distance){
                        target = istar;  
                        targetDistance = distance ;  
                    }
                }

            } 
        }; 
        if(target!== null)particles[target].material = material.yellow;   
    });
    //binds click for a star
    $(container).bind('click',function(){
        //centerson a star
        centerOn();
    })

    stats = new Stats(); ;
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild( stats.domElement );

    

    animate();  
} 
function zoomIn(){
    mouseZ += mouseZ < 8 ? 1 : 0; 

    new TWEEN.Tween( camera.position )
    .to({
        x:camera.position.x,
        y:camera.position.y,
        z:1000 - (mouseZ*100)
    }, 100 )
    .start()
    materials[1].size = camera.position.z/1000*20; 
    centerOn();
}
//function for centering on a star
function centerOn(){
    for(istar in particles){ 

        if(particles[istar].material === material.yellow ){ 
            //version 1   
            /* new TWEEN.Tween( cameraTarget )
            .to( particles[istar].position, 1000 )
            .start();
            //version 2
            */    
            for(istar2 in particles){

                new TWEEN.Tween( particles[istar2].position )
                .to({
                    x:particles[istar2].position.x - particles[istar].position.x,
                    y:particles[istar2].position.y - particles[istar].position.y,
                    z:particles[istar2].position.z - particles[istar].position.z
                }, 100 )
                .start()
            }

            break;   
        }
    }
}
function zoomOut(){
    mouseZ -= mouseZ > 0 ? 1 : 0; 

    new TWEEN.Tween( camera.position )
    .to({
        x:camera.position.x,
        y:camera.position.y,
        z:1000 - (mouseZ*100)
    }, 100 )
    .start()
    materials[1].size = camera.position.z/1000*20;             
}

/*function generateSprite(type) {

var canvas = document.createElement( 'canvas' );
canvas.width = 36;
canvas.height = 36;

var context = canvas.getContext( '2d' );
var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
gradient.addColorStop( 0, 'rgba(255,255,255,1)' );
switch(type){
case 'blue':
gradient.addColorStop( 0.2, 'rgba(0,255,255,1)' );
gradient.addColorStop( 0.4, 'rgba(0,0,64,1)' );
break;
case 'green':
gradient.addColorStop( 0.2, 'rgba(0,255,0,1)' );
gradient.addColorStop( 0.4, 'rgba(0,64,0,1)' );
break;
case 'red':
gradient.addColorStop( 0.2, 'rgba(255,0,0,1)' );
gradient.addColorStop( 0.4, 'rgba(64,0,0,1)' );
break; 
case 'yellow':
gradient.addColorStop( 0.2, 'rgba(255,255,0,1)' );
gradient.addColorStop( 0.4, 'rgba(64,64,0,1)' );
break;
}
gradient.addColorStop( 1, 'rgba(0,0,0,1)' );

context.fillStyle = gradient;
context.fillRect( 0, 0, canvas.width, canvas.height );

return canvas;

}
*/
function generateSprite() {

    var canvas = document.createElement( 'canvas' );
    canvas.width = 16;
    canvas.height = 16;

    var context = canvas.getContext( '2d' );
    var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
    gradient.addColorStop( 0, 'rgba(255,255,255,1)' );
    gradient.addColorStop( 0.2, 'rgba(0,255,255,1)' );
    gradient.addColorStop( 0.4, 'rgba(0,0,64,1)' );
    gradient.addColorStop( 1, 'rgba(0,0,0,1)' );

    context.fillStyle = gradient;
    context.fillRect( 0, 0, canvas.width, canvas.height );

    return canvas;

}
function initParticle( particle, position) {

    particle.position.x = position.x || 0;
    particle.position.y = position.y || 0;
    particle.position.z = position.z || 0;
    particle.scale.x = particle.scale.y =2;

    /*new TWEEN.Tween( particle )
    .delay( delay )
    .to( {}, 10000 )
    .onComplete( initParticle )
    .start();
    */
    /*    new TWEEN.Tween( particle.position )
    .delay( delay )
    .to( { x: Math.random() * 4000 - 2000, y: Math.random() * 1000 - 500, z: Math.random() * 4000 - 2000 }, 10000 )
    .start();

    new TWEEN.Tween( particle.scale )
    .delay( delay )
    .to( { x: 0, y: 0 }, 10000 )
    .start();
    */

}

//

function animate() {

    requestAnimationFrame( animate );

    render();
    stats.update();

}

function render() {

    TWEEN.update();

    /* camera.position.x += ( mouseX - camera.position.x ) * 0.05;
    camera.position.y += ( - mouseY - camera.position.y ) * 0.05;

    */


    camera.lookAt( cameraTarget );
    renderer.clear();   

    renderer.render(scene,camera)

}

function toScreenXY( position, camera, jqdiv ) {

    var pos = position.clone();
    projScreenMat = new THREE.Matrix4();
    projScreenMat.multiply( camera.projectionMatrix, camera.matrixWorldInverse );
    projScreenMat.multiplyVector3( pos );

    return { x: ( pos.x + 1 ) * jqdiv.width() / 2 + jqdiv.offset().left,
        y: ( - pos.y + 1) * jqdiv.height() / 2 + jqdiv.offset().top };

}