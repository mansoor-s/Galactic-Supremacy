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

        var x = 2780;
        var y = 50;
        var z = 50;

        var self = this;
        return function() {
            x -= 1;
            y -= 1;
            z -= 1;

            var tasks = self.sockets.recv();
            self.sockets.flush();

            tasks.push({
                id: 0,
                task: {
                    unitId: 0,
                    order: 0,
                    pos: {
                        x: x,
                        y: y,
                        z: z
                    }
                }

            });

            //route the tasks
            self._webglController.routeUpdateEvents(tasks);

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
            pos: {
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