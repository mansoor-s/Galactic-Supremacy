(function() {
    "use strict";
    
    var Sockets = App.Controllers.Sockets = function() {
        var port = App.Settings.Sockets.port ? ':' + port : ''; 
        var sockServer = 'ws://' + App.Settings.Sockets.host + port + App.Settings.Sockets.path;
        this.socket = new WebSocket(sockServer);

        this.socket.onopen = this.onConnect;
        this.socket.onmessage = this.onRecv;
    };

    Sockets.prototype.onConnect = function(fn) {

    };

    Sockets.prototype.onRecv = function(fn) {

    };


    Sockets.prototype.send = function(fn) {

    };

    Sockets.prototype.close = function(fn) {

    };


})();