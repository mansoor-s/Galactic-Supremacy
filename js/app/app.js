/*
$(document).ready(function() {
    
    var curr_level = 0;
    
    var max_zoomIn = 4;
    var max_zoomOut = 0;
    
    var $viewport = $('.gs-viewport');
    var $viewportCanvas = $('.gs-viewportCanvas');
    
    var offset = $viewportCanvas.offset();
    var canvasOffset = {
        left: offset.left * -1,
        top: offset.top * -1
    };
    
    var canvasSize = {
        width: $viewport.width(),
        height: $viewport.height()
    };
    
    //$viewportCanvas.html(populateLevel(canvasOffset, canvasSize, curr_level));
    
    
    //make tiles draggable
    $viewportCanvas.draggable({
        scroll: false,
        handle: '.tile'
    });
    
    
    var $blur = $('.blur');
    $blur.css({
        width: $viewport.width(),
        height: $viewport.height()
    });

    $viewport.bind('mousewheel', function(event, delta, deltaX, deltaY) {
        switch (deltaY) {
            case 1:
                //zoomin
                (function() {
                    if (curr_level === max_zoomIn) {
                        return;
                    }
                    $blur.fadeIn(500);
                    var tiles = populateLevel(canvasOffset, canvasSize, ++curr_level);
                    $viewportCanvas.html(tiles);
                    $blur.fadeOut();
                })();
                break;
            case -1:
                //zoom out
                (function() {
                    if (curr_level === max_zoomOut) {
                        return;
                    }
                    $blur.fadeIn(500);
                    var tiles = populateLevel(canvasOffset, canvasSize, --curr_level);
                    $viewportCanvas.html(tiles);
                    $blur.fadeOut();
                })();
                break;
        }
    });
    
});*/

function changeLevel(level) {
    
}

function populateLevel(parentOffset, canvasSize, level) {
    var horizontalExtra = 2;
    var verticalExtra = 2;
    var tileWidth = 200;
    var tileHeight = 200;
    var backgroundColor = 'gray';
    switch(level) {
        case 0:
            break;
        case 1:
            backgroundColor = 'red';
            break;
        case 2:
            backgroundColor = 'green';
            break;
        case 3:
            backgroundColor = 'blue';
            break;
        case 4:
            backgroundColor = 'yellow';
            break;
    }
    var tiles = '';
    
    var tilesX = (canvasSize.width / tileWidth >> 0);
    var tilesY = (canvasSize.height / tileHeight >> 0);
    
    var horizontalLength = tilesX + horizontalExtra;
    var verticlLength = tilesY + verticalExtra;
    
    var leftOffset = (horizontalExtra / 2) * tileWidth * -1;
    var topOffset = (verticalExtra / 2) * tileHeight * -1;
    for (var i = 0; i < horizontalLength; i++) {
        
        for (var j = 0; j < verticlLength; j++) {
            var leftPosition = (tileWidth * i) + leftOffset + parentOffset.left;
            var topPosition = (tileHeight * j) + topOffset + parentOffset.top;
            
            var tile = '<div class="tile" style="background:' + backgroundColor + ';left:' + leftPosition + 'px;top:' + topPosition +'px;">Zoom: ' + level + ' | tile: ' + i + 'X' + j + '</div>';
            tiles += tile;
        }
    }
    return tiles;
}

$(document).ready(function() {
    
    $('a').hover(function(e) {
        e.preventDefault();
    });
    
    
    $('.gs-menuMain').click(function() {
        $('.gs-subMenu').show();   
    });
    
    $('.gs-zoomSlider').draggable({
        containment: 'parent',
        grid: [0, 10],
        scroll: false
    });
    
    
    $('.gs-dialog').draggable({
        handle: $('.gs-dialogHeader')    
    });
    
});