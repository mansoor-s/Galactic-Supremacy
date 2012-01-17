App.Stages.StarSystem = (function() { 
    var controller,scene,camera;
    
    var materials = {};
    var meshes = {};
    return {
        initialize:function (webgl) {
            controller = webgl;
            
            // Initialize camera
            camera = new THREE.PerspectiveCamera( 45, controller.jqDiv.width() / controller.jqDiv.height(), 1, 200 );
            camera.position= {
                x: 50, 
                y: 60, 
                z: 30
            };  
            camera.matrixAutoUpdate = true;
            camera.lookAt({
                x:0,
                y:0,
                z:0
            });
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
            meshes['sphere'] = new THREE.SphereGeometry( 1, 32, 16 );
            

          
        },
        _initializeMaterials:function(){
            //todo: textured materials
            
            materials['star'] = new THREE.MeshLambertMaterial(
            {
                ambient:0xffffff,
                color: 0xffffff
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
            materials['desert'] = new THREE.MeshLambertMaterial(
            {
                ambient: 0x555500,
                color: 0x888800
            });
            materials['barren'] = new THREE.MeshLambertMaterial(
            {
                ambient: 0x550055,
                color: 0x880055
            });
            materials['terran'] = new THREE.MeshLambertMaterial(
            {
                ambient: 0x00055,
                color: 0x000088
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
            //
            var star = new THREE.Mesh( meshes['sphere'], materials['star'] );
            star.scale.multiplyScalar(data.star.size)
            star.tag = {
                object:'star',
                data:data.star,
                parent:scene
            }
            scene.add( star );
            //matrix that will rotate the vectors
            var rotatingMatrix = new THREE.Matrix4();
            for(var i = 0;i<data.planets.length;i++){
                var planet = new THREE.Mesh( meshes['sphere'], materials[data.planets[i].type] );
                planet.scale.multiplyScalar(data.planets[i].size);
                planet.position.set(1,0,0);
                rotatingMatrix.setRotationY(controller.degreesToRadians(360*data.planets[i].orbit));
                rotatingMatrix.multiplyVector3(planet.position);
                
                planet.position.multiplyScalar(data.planets[i].distance)
                planet.tag = {
                    object:'planet'+i,
                    data:data.planets[i],
                    parent:scene
                }
                scene.add( planet );
                for(var i2 = 0;i2<data.planets[i].moons.length;i2++){
                    var moon = new THREE.Mesh( meshes['sphere'], materials[data.planets[i].moons[i2].type] );
                    moon.scale.multiplyScalar(0.5);
                    moon.position.set(1,0,0)
                    rotatingMatrix.setRotationY(controller.degreesToRadians(360*data.planets[i].moons[i2].orbit));
                    rotatingMatrix.multiplyVector3(moon.position);
                    moon.position.multiplyScalar(i2+1+data.planets[i].size).addSelf(planet.position);
                    moon.tag = {
                        object:'moon'+i,
                        data:data.planets[i].moons[i2],
                        parent:planet
                    }
                    scene.add( moon );
                }
             
            }
            
            
        },
        //update the animation
        update: function(){
            TWEEN.update();
        },
        //render for stage
        render: function(){
            //postprocessing render
            //   controller.renderer.clear();
            //   composer.render(0.05);
         
            controller.renderer.render(scene,camera);

        },
        //use it like "eventname":"functionname"
        events: {
          
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