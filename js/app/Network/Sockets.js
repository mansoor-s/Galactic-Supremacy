(function() {
    "use strict";
    
    /*
        Function: Sockets
            Scokets object constructor. Abstracts WebSockets

        Parameters:

            host - {String} WS server host
            port - {String} WS server port
            path - {String} Path to the WS server. (Optional)
            start - {Boolean} true to start server on object initialization otherwise, 
                Socket.opoen() must be called manually
            useQueue - {Boolean} Flag to indicate whether or not to save incoming messages 
                in a queue and not call user specified event handler. (Optional)
    */
    var Sockets = App.Network.Sockets = function(host, port, path, start, useQueue) {
        path = path || '';
        var port = port ? ':' + port : ''; 
        var sockServer = 'ws://' + host + port + path;

        this.socket;
        this.connected = false;

        this._recvArr = [];
        this._useQueue = useQueue === undefined ? true : false;

        this._recvFn;
        this._closeFn;
        this._openFn;
    };


    /*
        Function: open
            Initialize the WebSockets object and start connection with the server
    */
    Sockets.prototype.open = function() {
        if (!this._connected) {
            this.socket = new WebSocket(sockServer);
            this.socket.onopen = this._onOpen;
            this.socket.onmessage = this._onMessage;
            this.socket.onclose = this._onClose;
            this._connected = true;
        }
        this._connected = true;
    }


    /*
        Function: onOpen
            Attach a listener for connection open event

        Parameters:
            fn - {Function} callback function
    */
    Sockets.prototype.onOpen = function(fn) {
        this._openFn = fn;
    };


    /*
        Function: _onOpen
            Private. Event listene for onopen event.
    */
    Scokets.prototype._onOpen = function() {
        if (typeof this._openFn === 'function') {
            this._openFn();
        }
    };


    /*
        Function: _onMessage
            Private. Event listene for onmessage event. Parses to Object if data is valid JSON

        Parameters:
            data - {Straing} data recieved from server
    */
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
            this._recvFn(data)
        }
        
    };

    /*
        Function: onRecv
            Attach a listener for connection onmesssage event

        Parameters:
            data - {Straing} data recieved from server
    */
    Sockets.prototype.onRecv = function(fn) {
        this._recvFn = fn;
    };


    /*
        Function: recv
            Returns queued data from the WS server. This function will return 
                an empty array if `useQueue` is passed in as false in the constructor.

        Parameters:
            data - {Straing} data recieved from server

        Returns:
            {Array} Array containing all of the data (Should be Objects) recieved from the WS server

        See Also:
            <flush>
    */
    Sockets.prototype.recv = function() {
        return this._recvArr;
    };


    /*
        Function: flush
            Empty message queue.

        See Also:
            >recv>
    */
    Sockets.prototype.flush = function() {
        //empty recv queue
        this._recvArr = [];
    };


    /*
        Function: send
            Send a message to the WS server

        Parameters:
            data - {Object} data object to send to the server
    */
    Sockets.prototype.send = function(data) {
        var dat;
        try {
            dat = JSON.stringify(data);
        } catch(e) {
            dat = data;
        }

        this.socket.send(dat);
    };

    
    /*
        Function: close
            Close the WS connection
    */
    Sockets.prototype.close = function() {
        if (this._connected) {
            this.socket.close();
        }
        this._connected = false;
    };


    /*
        Function: onClose
            Attach an even handler for connection closing.
    */
    Sockets.prototype.onClose = function(fn) {
        this._closeFn = fn;
    };


    /*
        Function: _onClose
            Private. Event listener for onclose event.
    */
    Sockets.prototype._onClose = function() {
        if(typeof this._closeFn === 'function') {
            this._closeFn();
        }
    };

})();