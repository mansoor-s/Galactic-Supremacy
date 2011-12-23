App.Controllers.App = (function() {

    // modules which are active at this moment
    var activeModules = [];

    return {       


        /*
        Initialize the game
        */
        initialize: function() {
            //initializing everything
            App.Controllers.webgl.initialize($('.gs-viewport'));
            activeModules.push(App.Controllers.webgl);

            /* a sugestion
            Game.Controllers.ui.initialize();
            activeModules.push(Game.Controllers.ui);
            */
        }
    };
})();