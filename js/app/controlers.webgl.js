(function() {
    'use strict';
    
    var Webgl = App.Controllers.Webgl = function($viewport) {
        this.$viewport = $viewport;

        // Game loop
        this.loops = 0,
        this.nextGameTick = (new Date).getTime(),

        // Constants
        this.FPS = 60,
        this.MAX_FRAME_SKIP = 10,
        this.SKIP_TICKS = 1000 / this.FPS;
       
        // Create projector
        this.projector = new THREE.Projector();

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias:true
        });
 
       
        this.renderer.shadowMapEnabled = true;
        this.renderer.setClearColor( 0xff0000, 1 );
        this.renderer.autoClear = false;
        this.renderer.setSize( this.$viewport.width(), this.$viewport.height() );

        // initialize fps counter
        this.stats = new Stats(); 
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.top = '75px';
        this.stats.domElement.style.right = '0px';
        this.$viewport.append(this.stats.domElement);
        this.$viewport.append(this.renderer.domElement);

        //render the current stage
        //this.currentStage = new App.Stages.StarSystem(this);

        this.currentStage = new App.Stages.Galaxy(this);

        //event binding
        this.$viewport.on('mousedown mouseup mousemove dblclick click mousewheel', this.onEvent());
        $(document).live('keydown keyup keypress', this.onEvent());

        //setup animation event loop

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
        this.loops = 0;

        // Attempt to update as many times as possible to get to our nextGameTick 'timeslot'
        // However, we only can update up to 10 times per frame
        while ( (new Date).getTime() > this.nextGameTick && this.loops < this.MAX_FRAME_SKIP ) {
            this.update();
            this.nextGameTick += this.SKIP_TICKS;
            this.loops++;
        }

        // Render our scene
        this.currentStage.render();
    };



    //gets position in the z plane of a givent mouse coordinates
    Webgl.prototype.getIntersectionWithYPlane = function(camera, mouse, y) {
        var vector = new THREE.Vector3( mouse.x, mouse.y, -1 );

        this.projector.unprojectVector( vector, camera );
        var origin = camera.matrixWorld.getPosition();
        
        vector =  vector.subSelf( origin ).normalize();
        
        var scalar = (y - origin.y) / vector.y
        var intersection = origin.clone().addSelf( vector.multiplyScalar(scalar) );

        return intersection;
    };


    //pass the event handling to proper stage
    Webgl.prototype.onEvent = function(){
        var self = this;
        return function(event, delta) {
            self.currentStage.onEvent(event, delta);
        };
        
    };



/*

    task ids:

    0 - unit movement
    1 - unit position update
    2 - player/infrustrcuture updates
    3 - private chat
    4 - alliance chat

*/
    Webgl.prototype.routeUpdateEvents = function(tasks) {
        for(var i = 0, len = tasks.length; i < len; ++i) {
            var task = tasks[i];
            
            if (task.id === 0 || task.id === 1) {
                this.currentStage.handleUnitUpdates(task.task);
            } else if (task.id === 2) {
                this.currentStage.handlePlayerUpdates(task.task);
            } else if (task.id === 3) {
                this.currentStage.handlePrivateChat(task.task);
            } else if (task.id === 4) {
                this.currentStage.handleAllianceChat(task.task);
            }
        }
    };

    Webgl.prototype.handleUnitUpdates = function(data) {
        this.currentStage.handleUnitUpdates(data);
    };


    Webgl.prototype.handlePlayerUpdates = function(data) {
        this.currentStage.handlePlayerUpdates(data);
    };


    Webgl.prototype.handlePrivateChat = function(data) {
        this.currentStage.handlePrivateChat(data);
    };


    Webgl.prototype.handleAllianceChat = function(data) {
        this.currentStage.handleAllianceChat(data);
    };
})();
