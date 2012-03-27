(function() {
    "use strict";
    
    var Network = App.Controllers.Network = function() {
        var port = App.Settings.Network.port ? ':' + port : ''; 
        var sockServer = 'ws://' + App.Settings.Network.host + port + App.Settings.Network.path;
        this.socket = new WebSocket(sockServer);

        this.socket.onopen = this.onConnect;
        this.socket.onmessage = this.onRecv;
    };

    Network.prototype.onConnect = function(fn) {

    };

    Network.prototype.onRecv = function(fn) {

    };


    Network.prototype.send = function(fn) {

    };

    Network.prototype.close = function(fn) {

    };


})();