function createStars() {
    var spiralTransformations = {
        x: 1.7,
        y: 1.7
    }
	var zRandomOffsetRange = 200;
    var starsPerArm = 50000;
    var randomOffsetRange = 650;
    var A = 2500;
    xTransform = spiralTransformations.x || 2;  // "zoom factor. higher = more zoomed in"
    yTransform = spiralTransformations.y || 2;
    
    var spirals = [
        {
            xDirection: 1,
            yDirection: -1
        },
        {
            xDirection: -1,
            yDirection: 1
        },
        {
            xDirection: -1,
            yDirection: 1,
            xAngle: 30,
            yAngle: 30
        },
        {
            xDirection: 1,
            yDirection: -1,
            xAngle: -30,
            yAngle: -30
        }
    ];
    
    var a = A;
    var stars = [];
    
    var spiralOdd = true;
    for (var i = 0; i < spirals.length; i++) {
        var spiral = spirals[i];
        
        var xAngle = spiral.xAngle >>> 0;
        var yAngle = spiral.yAngle >>> 0;
        
        var s = 0;
        var odd = true;
        for (var j = 0; j < starsPerArm; j++) {
                var t = f_inv(a, s);
                var x = calc_x(a, t, xTransform);
                var y = calc_y(a, t, yTransform);
                
                var yTemp = rotateY(x, y, yAngle);
                var x = rotateX(x, y, xAngle);
                var y = yTemp;
                
               var left, top;
               // y direction is reverse of a cart. graph
                if (spiralOdd) {
                    left = x + middleBiasedRand(randomOffsetRange);
                    top = -y + middleBiasedRand(randomOffsetRange);
                    spiralOdd = false
                } else {
                    left = -x + middleBiasedRand(randomOffsetRange);
                    top = y + middleBiasedRand(randomOffsetRange);
					
                    spiralOdd = true;
                }
				
				var depth = middleBiasedRand(zRandomOffsetRange);
				
                stars.push({
                    x: left,
                    y: top,
					z: depth
                });
                
            s += 1;
        }
        
    }
    
    return stars;
}
/*    
    x(t) = a t cos(t)
    y(t) = a t sin(t)
*/
function calc_x(a, t, z) {
    var x = a * z * t * Math.cos(t) * .17;
    return x;
}


function calc_y(a, t, z) {
    var y = a * z * t * Math.sin(t) * .17;
    return y;
}

function find_center() {
    var top = $elem.height() / 2 ;
    var left = $elem.width() / 2;
    var center = {top: 0, left: 0};

    return center;
}


function arch_length(a, t) {
    //s(t) = 1/2 a (sqrt(t^2+1) t+sinh^(-1)(t))
    return .5 * a * Math.sqrt(Math.pow(t,2) + 1) * t + arsinh(t);
}

function sinh(arg) {
    return (Math.exp(arg) - Math.exp(-arg)) / 2;
}

function arsinh(arg) {
    //sinh^(-1)(x) = log(x+sqrt(1+x^2))
    return Math.log(arg + Math.sqrt(Math.pow(arg, 2) + 1));
}


function df(a, t) {
    return a * Math.sqrt(t*t + 1.0);
}


function f_inv(a, s) {
    var eps = 1.0e-10;
    var t = 0.0;
    while(true) {
        t = t - (arch_length(a, t) - s) / df(a, t);
        if ((Math.abs(arch_length(a, t) - s)) < eps) {
            return t;
        }
    }
}


function rand(min, max) {
    return Math.random() * (max - min) + min;
}

function middleBiasedRand(maxOffset) {
    var sudoRand = Math.round(Math.random());
    var rand;
    if (sudoRand === 1) {
        rand =  -1 * Math.pow(Math.random(), 1.75) * maxOffset;
    } else {
        rand = Math.pow(Math.random(), 1.75) * maxOffset;
    }
    
    return rand;
}

function rotateX(x, y, angle) {
    //x = x * cos(angle) - y * sin(angle)
    return x * Math.cos(angle) - y * Math.sin(angle);
}

function rotateY(x, y, angle) {
    //ynew = y * cos(angle) + x * sin(angle)
    return y * Math.cos(angle) + x * Math.sin(angle);
}


/* $(document).ready(function() {
draw();
});

function zoomOut($viewport, deltaX, deltaY) {
    spiralTransformations.x -= .5;
    spiralTransformations.y -= .5;
    draw();
}

function zoomIn($viewport, deltaX, deltaY) {
    spiralTransformations.x += .5;
    spiralTransformations.y += .5;
    //draw();
    
     var $elements = $viewport.children();
    var center = find_center($viewport);
    // center event area
    $('.center').css({
        'top': center.top ,
        'left': center.left
    });
    $elements.each(function() {
        var $element = $(this);
        var offset = $element.offset();
        var newTop = center.top + ((offset.top - center.top) * 1.5);
        var newLeft = center.left + ((offset.left - center.left) * 1.5);
        $element.css({
            top: newTop + 'px',
            left: newLeft + 'px'
        });    
    });
   
    
}

function find_center($elem) {
    var offset = $elem.offset();
    var top = $elem.height() / 2;
    var left = $elem.width() / 2;
    var center = {top: top, left: left};

    return center;
}
 
 
var spiralTransformations = {
    x: 1,
    y: 1
}
function draw() {
    var $viewport = $('.gs-viewport');
    $viewport.html('');
    var center = find_center($viewport);
    var starsPerArm = 1000;
    var randomOffsetRange = 80;
    var A = 70;
    xTransform = spiralTransformations.x || 2;  // "zoom factor. higher = more zoomed in"
    yTransform = spiralTransformations.y || 2;
    
    var spirals = [
        {
            xDirection: 1,
            yDirection: -1
        },
        {
            xDirection: -1,
            yDirection: 1
        },
        {
            xDirection: -1,
            yDirection: 1,
            xAngle: 30,
            yAngle: 30
        },
        {
            xDirection: 1,
            yDirection: -1,
            xAngle: -30,
            yAngle: -30
        }
    ];
    
    var a = A;
    var stars = '';
    
    var spiralOdd = true;
    for (var i = 0; i < spirals.length; i++) {
        var spiral = spirals[i];
        
        var xAngle = spiral.xAngle >>> 0;
        var yAngle = spiral.yAngle >>> 0;
        
        var s = 0;
        var odd = true;
        for (var j = 0; j < starsPerArm; j++) {
                var t = f_inv(a, s);
                var x = calc_x(a, t, xTransform);
                var y = calc_y(a, t, yTransform);
                
                var yTemp = rotateY(x, y, yAngle);
                var x = rotateX(x, y, xAngle);
                var y = yTemp;
                
               var left, top;
               // y direction is reverse of a cart. graph
                if (spiralOdd) {
                    left = center.left + x + middleBiasedRand(randomOffsetRange);
                    top = center.top - y + middleBiasedRand(randomOffsetRange);
                    spiralOdd = false
                } else {
                    left = center.left - x + middleBiasedRand(randomOffsetRange);
                    top = center.top + y + middleBiasedRand(randomOffsetRange);
                    spiralOdd = true;
                }
                
                stars += '<div class="star" style="left:' + left + 'px; top:' + top + 'px;"></div>'; 
            s += 1;
        }
        
    }
    
    $viewport.append(stars);
}   



//    x(t) = a t cos(t)
//    y(t) = a t sin(t)
function calc_x(a, t, z) {
    var x = a * z * t * Math.cos(t);
    return x;
}


function calc_y(a, t, z) {
    var y = a * z * t * Math.sin(t);
    return y;
}

function find_center($elem) {
    var offset = $elem.offset();
    var top = $elem.height() / 2 ;
    var left = $elem.width() / 2;
    var center = {top: top, left: left};

    return center;
}


function arch_length(a, t) {
    //s(t) = 1/2 a (sqrt(t^2+1) t+sinh^(-1)(t))
    return .5 * a * Math.sqrt(Math.pow(t,2) + 1) * t + arsinh(t);
}

function sinh(arg) {
    return (Math.exp(arg) - Math.exp(-arg)) / 2;
}

function arsinh(arg) {
    //sinh^(-1)(x) = log(x+sqrt(1+x^2))
    return Math.log(arg + Math.sqrt(Math.pow(arg, 2) + 1));
}


function df(a, t) {
    return a * Math.sqrt(t*t + 1.0);
}


function f_inv(a, s) {
    var eps = 1.0e-10;
    var t = 0.0;
    while(true) {
        t = t - (arch_length(a, t) - s) / df(a, t);
        if ((Math.abs(arch_length(a, t) - s)) < eps) {
            return t;
        }
    }
}


function rand(min, max) {
    return Math.random() * (max - min) + min;
}

function middleBiasedRand(maxOffset) {
    var sudoRand = Math.round(Math.random());
    var rand;
    if (sudoRand === 1) {
        rand =  -1 * Math.pow(Math.random(), 1.75) * maxOffset;
    } else {
        rand = Math.pow(Math.random(), 1.75) * maxOffset;
    }
    
    return rand;
}

function rotateX(x, y, angle) {
    //x = x * cos(angle) - y * sin(angle)
    return x * Math.cos(angle) - y * Math.sin(angle);
}

function rotateY(x, y, angle) {
    //ynew = y * cos(angle) + x * sin(angle)
    return y * Math.cos(angle) + x * Math.sin(angle);
}
 */