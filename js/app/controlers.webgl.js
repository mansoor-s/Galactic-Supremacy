Game.Controllers.webgl = (function() {

    var
    renderer,
    appView,

    // Game loop
    loops = 0,
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

        },


        /*
        function animate
        Game loop - requests each new frame
        */
        animate: function() {

        },


        /*
        function update
        Handles game state updates
        */
        update: function() {

        },


        /*
        function render
        */
        render: function() {

        }

    };
})();