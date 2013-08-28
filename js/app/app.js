$(document).ready(function() {
    
    // initialize game
   App.Res = new App.Resources(App.Controllers.App);

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
    }).show();
    
});