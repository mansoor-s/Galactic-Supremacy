(function() {
    "use strict";
    var Webgl = App.Controllers.Webgl = function($viewport) {
        this._$viewport = $viewport;

        // Game loop
        this.loops = 0,
        this.nextGameTick = (new Date).getTime(),

        // Constants
        this.FPS = 60,
        this.MAX_FRAME_SKIP = 10,
        this.SKIP_TICKS = 1000 / this.FPS;
        this.projScreenMat = new THREE.Matrix4();

        this.renderer;
        this.projector;
        this.jqDiv;

        // Create projector
        this.projector = new THREE.Projector();

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
        } );

        this.renderer.shadowMapEnabled = true;
        this.renderer.setClearColor( 0xff0000, 1 );
        this.renderer.autoClear = false;
        this.renderer.setSize( this._$viewport.width(), this._$viewport.height() );

        // initialize fps counter
        this.stats = new Stats(); 
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.top = '75px';
        this.stats.domElement.style.right = '0px';
        this._$viewport.append(this.stats.domElement);
        this._$viewport.append(this.renderer.domElement);

        //render the current stage
        this.currentStage = new App.Stages.StarSystem(this);


        //event binding
        this._$viewport.on('mousedown mouseup mousemove dblclick click mousewheel', this.onEvent());
        $(document).live('keydown keyup keypress', this.onEvent());

        this.animate();
    };

    Webgl.prototype.animate = function() {
        var self = this;
        (function animateInner() {
            requestAnimationFrame( animateInner ); 
            self.stats.update();      
            self.render(); 
        })();
    };

    /*
    function update
    Handles game state updates
    */
    Webgl.prototype.update = function() {
        this.currentStage.update();
    };

    /*
    function render
    */
    Webgl.prototype.render = function() {
        loops = 0;

        // Attempt to update as many times as possible to get to our nextGameTick 'timeslot'
        // However, we only can update up to 10 times per frame
        while ( (new Date).getTime() > this.nextGameTick && loops < this.MAX_FRAME_SKIP ) {
            this.update();
            this.nextGameTick += this.SKIP_TICKS;
            loops++;
        }

        // Render our scene
        this.currentStage.render();
    };

    //gets position in the z plane of a givvent mouse coordinates
    Webgl.prototype.getWorldXYZ = function(camera, xyPosition, z) {

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
    };

    //helpful functions
    Webgl.prototype.degreesToRadians = function(degrees){
        return (eval(degrees))*(Math.PI/180);
    };

    Webgl.prototype.radiansToDegrees = function(radians){
        return (eval(radians))*(180/Math.PI);
    };

    Webgl.prototype.toScreenPrepare = function(camera){
        projScreenMat.multiply( camera.projectionMatrix, camera.matrixWorldInverse );
    };

    Webgl.prototype.toScreenXY = function(position) {
        var pos = position.clone();
        this.projScreenMat.multiplyVector3( pos );
        return pos;

    };

    //pass the event handling to proper stage
    Webgl.prototype.onEvent = function(){
        var self = this;
        return function(event, delta) {
            self.currentStage.onEvent(event, delta);
        };
        
    };

    Webgl.prototype.getViewport = function() {
        return this._$viewport;
    };

})();