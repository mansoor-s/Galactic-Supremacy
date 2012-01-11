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