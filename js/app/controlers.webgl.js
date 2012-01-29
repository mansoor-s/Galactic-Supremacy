App.Controllers.webgl = (function() {

    var currentStage;
    // Game loop
    var loops = 0,
    nextGameTick = (new Date).getTime(),

    // Constants
    FPS = 60,
    MAX_FRAME_SKIP = 10,
    SKIP_TICKS = 1000 / FPS;
    var projScreenMat = new THREE.Matrix4();
    return {

        // App variables
        renderer: null,        
        projector: null,
        jqDiv: null,
        /*
        Initialize scene
        */
        initialize: function(jqElement) {
            this.jqDiv = jqElement;
            _.bindAll( this, "animate", "render", "update" );

            // Create projector
            this.projector = new THREE.Projector();

            // Create renderer
            this.renderer = new THREE.WebGLRenderer({antialias:true} );
            this.renderer.setClearColor( 0xff0000, 1 );
            this.renderer.autoClear = false;
            this.renderer.setSize( this.jqDiv.width(), this.jqDiv.height() );
            // initialize fps counter
            stats = new Stats(); 
            stats.domElement.style.position = 'absolute';
            stats.domElement.style.top = '75px';
            stats.domElement.style.right = '0px';
            this.jqDiv.append(stats.domElement);
            this.jqDiv.append(this.renderer.domElement);

            //render the current stage
            currentStage = App.Stages.StarSystem;
            currentStage.initialize(this);
            //event binding

            this.jqDiv.on('mousedown mouseup mousemove dblclick click mousewheel', this._event);
            $(document).live('keydown keyup keypress', this._event);

            this.animate();
        },


        /*
        function animate
        Game loop - requests each new frame
        */
        animate: function() {  
            requestAnimationFrame( this.animate ); 
            stats.update();      
            this.render();   
        },



        /*
        function update
        Handles game state updates
        */
        update: function() {
            currentStage.update();
        },


        /*
        function render
        */
        render: function() {
            loops = 0;

            // Attempt to update as many times as possible to get to our nextGameTick 'timeslot'
            // However, we only can update up to 10 times per frame
            while ( (new Date).getTime() > nextGameTick && loops < MAX_FRAME_SKIP ) {
                this.update();
                nextGameTick += SKIP_TICKS;
                loops++;
            }

            // Render our scene
            currentStage.render();

        },
        //gets position in the z plane of a givvent mouse coordinates
        getWorldXYZ:function(camera,xyPosition,z){

            var mousex = ( xyPosition.x / this.jqDiv.width() ) * 2 - 1;
            var mousey =  ( xyPosition.y / this.jqDiv.height()) * 2 - 1;
          
            var vector = new THREE.Vector3( -mousex, mousey, -1 );

            this.projector.unprojectVector( vector, camera );
                        
            var origin = camera.matrixWorld.getPosition();
            

            vector =  vector.subSelf( origin ).normalize();
            
            var scalar =(origin.z - z  )/vector.z;   

            var intersection = origin.clone().addSelf( vector.multiplyScalar(scalar) );
 
            intersection.z = z;
            return intersection;
        },
        //helpful functions
        degreesToRadians:function(degrees){
            return (eval(degrees))*(Math.PI/180);
        },
        radiansToDegrees:function(radians){
            return (eval(radians))*(180/Math.PI);
        },
        toScreenPrepare:function(camera){
            projScreenMat.multiply( camera.projectionMatrix, camera.matrixWorldInverse );
        },
        toScreenXY:function( position) {
            var pos = position.clone();
            projScreenMat.multiplyVector3( pos );
            return pos;

        },
        //pass the event handling to proper stage
        _event:function(event,delta){
            currentStage._event(event,delta);
        }
    };
}());