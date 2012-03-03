//helpful functions
function degreesToRadians(degrees){
    return (eval(degrees))*(Math.PI/180);
};

function radiansToDegrees(radians){
    return (eval(radians))*(180/Math.PI);
};
Function.prototype.inheritsFrom = function( parentClassOrObject ){ 
    if ( parentClassOrObject.constructor == Function ) 
    { 
        //Normal Inheritance 
        this.prototype = new parentClassOrObject;
        this.prototype.constructor = this;
        this.prototype.parentClass = parentClassOrObject.prototype;
    } 
    else 
    { 
        //Pure Virtual Inheritance 
        this.prototype = parentClassOrObject;
        this.prototype.constructor = this;
        this.prototype.parentClass = parentClassOrObject;
    } 
    return this;
} 
//prepares a matrix for the postoscreen function
function posToScreenPrepare(camera){
    var matrix = new THREE.Matrix4();
   return matrix.multiply( camera.projectionMatrix, camera.matrixWorldInverse );
};
//pos to screen returns a {x,y} value from -1 to 1,
//0 being the center of the viewport
function posToScreen(position,matrix) {
    var pos = position.clone();
    matrix.multiplyVector3( pos );
    return pos;
};