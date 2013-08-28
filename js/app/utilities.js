(function() {
    'use strict';
    var Utill = App.Utill = {};

    Utill.degreesToRadians = function(degrees) {
        return (degrees) * (Math.PI / 180);
    };

    Utill.radiansToDegrees = function(radians){
        return (radians) * (180 / Math.PI);
    };

    //prepares a matrix for the postoscreen function
    Utill.posToScreenPrepare = function(camera){
        var matrix = new THREE.Matrix4();
        return matrix.multiply( camera.projectionMatrix, camera.matrixWorldInverse );
    };

    //pos to screen returns a {x,y} value from -1 to 1,
    //0 being the center of the viewport
    Utill.posToScreen = function(position,matrix) {
        var pos = position.clone();
        matrix.multiplyVector3( pos );
        return pos;
    };

})();

