$(document).ready(function(){
    $('body').append('<div id="toTop">Наверх</div>');
    $(window).bind('scroll', function () {
        if ($(this).scrollTop() != 0) {
            $('#toTop').fadeIn();
        } else {
            $('#toTop').fadeOut();
        }
    });
    $('#toTop').bind('click', function(){
        $("html, body").animate({ scrollTop: 0 }, 500);
        return false;
    });
});