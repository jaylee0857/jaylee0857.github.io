
$(window).scroll(function () {
    let window_width = window.innerWidth;
    let window_scrollTop = $(window).scrollTop();
    if (window_scrollTop > 50) {
        $('#goTop').css({
            "opacity": "1",
            "pointer-events": "auto"
        })
    } else {
        $('#goTop').css({
            "opacity": "0",
            "pointer-events": "none"
        })
    }

})


$(document).ready(function () {
    $('.nav_hamburger').click(function () {
        $(this).toggleClass('open');
        $('.phone_style_absolute').toggleClass('active')
        $('.mask').toggleClass('active');
    });
});

$('.mask').click(function () {
    $(this).removeClass('active')
    $('.nav_hamburger').removeClass('open')
    $('.phone_style_absolute').removeClass('active')
})

$(window).resize(function () {
    $('main').css("min-height", window.innerHeight - $('footer').height() )
});
