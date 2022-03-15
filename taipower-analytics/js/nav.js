function nav_bar_area_active_control() {
    let window_scrollTop = $(window).scrollTop();

    if (window_scrollTop > 30) {
        $('#nav_bar_area').removeClass('hidden')

    } else {
        $('#nav_bar_area').addClass('hidden')
    }
}
$(window).scroll(function () {
    nav_bar_area_active_control();
});


$(window).resize(function () {
    nav_bar_area_active_control();

});

$(document).ready(function () {
    nav_bar_area_active_control();

});