App.Controllers.App = (function() {

    // modules which are active at this moment
    var activeModules = [];

    return {       


        /*
        Initialize the game
        */
        initialize: function() {
            _.bindAll( this, "animate", "render", "update" );
            //initializing everything
            App.Controllers.webgl.initialize();
            activeModules.push(Game.Controllers.webgl);

            /* a sugestion
            Game.Controllers.ui.initialize();
            activeModules.push(Game.Controllers.ui);
            */
        }
    };
})();