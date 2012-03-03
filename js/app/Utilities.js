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