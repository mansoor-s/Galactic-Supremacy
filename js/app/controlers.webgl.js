App.Controllers.webgl = (function() {

    var renderer;

    var activeModels = [];
    var activeView = [];

    // Game loop
    var loops = 0,
    nextGameTick = (new Date).getTime(),

    // Constants
    FPS = 60,
    MAX_FRAME_SKIP = 10,
    SKIP_TICKS = 1000 / FPS;

    return {

        // App variables
        camera: null,
        scene: null,
        projector: null,

        /*
        Initialize scene
        */
        initialize: function() {
            _.bindAll( this, "animate", "render", "update" );
            debugger;
            // Initialize camera
            this.camera = new THREE.Camera( 45, window.innerWidth / window.innerHeight, -2000, 10000 );
            this.camera.projectionMatrix = THREE.Matrix4.makeOrtho( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -2000, 10000 );
            this.camera.position.y = 70.711;
            this.camera.position.x = 100;
            this.camera.position.z = 100;

            // Create scene
            this.scene = new THREE.Scene();

            // Create projector
            this.projector = new THREE.Projector();

            // Create renderer
            renderer = new THREE.WebGLRenderer( { antialias: true } );
            renderer.setSize( window.innerWidth, window.innerHeight );

            document.body.appendChild(renderer.domElement);
        },


        /*
        function animate
        Game loop - requests each new frame
        */
        animate: function() {  
            requestAnimationFrame( this.animate );   
            this.render();   
        },



        /*
        function update
        Handles game state updates
        */
        update: function() {
            for(var i = 0;i<activeModels.length;i++){
                activeModels[i].update();
            }  
            for(var i = 0;i<activeView.length;i++){
                activeView[i].update();
            }  
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
            renderer.render( this.scene, this.camera );

        }

    };
})();