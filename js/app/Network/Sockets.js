(function() {
    "use strict";
    
    var Sockets = App.Network.Sockets = function(host, port, path, useQueue) {
        var port = port ? ':' + port : ''; 
        var sockServer = 'ws://' + host + port + path;
        this.socket = new WebSocket(sockServer);

        this.socket.onopen = this.onConnect;
        this.socket.onmessage = this._onMessage;

        this._recvArr = [];
        this._sendArr = [];
        this._useQueue = useQueue;

        this._recvFn;
        tjis._closeFn
    };

    Sockets.prototype.onConnect = function(fn) {

    };

    Sockets.prototype._onMessage = function(data) {
        var dat;
        try {
            dat = JSON.parse(data);
        } cath(e) {
            dat = data;
        }
        if (this._useQueue) {
            this._recvArr.push(dat); 
        } else {
            this._recvFn()
        }
        
    };

    Sockets.prototype.onRecv(fn) {
        this._recvFn = fn;
    }

    Sockets.prototype.recv(fn) {
        return this._recvArr;
    };

    Sockets.prototype.send = function(data) {
        var dat;
        try {
            dat = JSON.stringify(data);
        } catch(e) {
            dat = data;
        }

        this._sendArr.push(dat);
    };

    Sockets.prototype.flush = function() {
        //empty recv queue
        this._recvArr = [];

        //send out the send queue
        for(var i = 0, len = this._sendArr; i < len; ++i) {
            this.socket.send(this._sendArr[i]);
        }

        this._sendArr = [];
    };

    Sockets.prototype.close = function(fn) {
        this.socket.close();
    };

    Sockets.prototype._onClose = function() {
        if(this._closeFn) {
            this._closeFn();
        }
    };

    Sockets.prototype.onClick(fn) {
        this._closeFn = fn;
    };


})();