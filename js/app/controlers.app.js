(function() {
    'use strict';
    App.Controllers.App = function() {
        var webglController = new App.Controllers.Webgl($('.gs-viewport'));

        var eventLoop = new App.eventLoop(webglController);

        eventLoop.start();
        
    };
})();
