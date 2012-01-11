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
                x: 0, 
                y: 40, 
                z: 50
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
            materials['terran'] = new THREE.MeshLambertMaterial(
            {
                ambient: 0x00055,
                 color: 0x000088
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
                type:data.star.type
            }
            scene.add( star );
            //todo planet enumeration 
            for(var i = 0;i<data.planets.length;i++){
                var planet = new THREE.Mesh( meshes['sphere'], materials[data.planets[i].type] );
                planet.scale.multiplyScalar(data.planets[i].size);
                planet.position.set(1,0,0).multiplyScalar(data.planets[i].distance)
                scene.add( planet );
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
})();