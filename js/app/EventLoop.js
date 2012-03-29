(function() {
    'use strict';
    
    var EventLoop = App.EventLoop = function(webglController) {
        this.sockets = new App.Network.Sockets;

        this._webglController = webglController;
        this._interval;
    };

    EventLoop.prototype.start = function() {
        this._interval = setInterval(this._getEventLoop(), 250);
    };

    EventLoop.prototype._getEventLoop = function() {
        var self = this;
        return function() {
            var tasks = self.sockets.recv();
            self.sockets.flush();


            //route the tasks

            for(var i = 0, len = tasks.length; i < len; ++i) {
                var task = tasks[i];
                
                if (task.id === 0 || task.id === 1) {
                    self._webglController.handleUnitUpdates(task);
                } else if (task.id === 2) {
                    self._webglController.handlePlayerUpdates(task);
                } else if (task.id === 3) {
                    self._webglController.handlePrivateChat(task);
                } else if (task.id === 4) {
                    self._webglController.handleAllianceChat(task);
                }
            }

        };
    };

})();


/*

unitOrders: {
    0: move      specify vector, distance, speed
    1: stop      
    3: rotate    specify x, y and z
    4: fire      specify target location

}

tasks: [

    {
        id: 0,
        task: {
            order: 0
            destinaion: {
                x:
                y:
                z:
                v:
            }
        }
    }
]
*/

/*

    task ids:

    0 - unit movement
    1 - unit position update
    2 - player/infrustrcuture updates
    3 - private chat
    4 - alliance chat

*/