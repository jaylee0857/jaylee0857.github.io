$(window).scroll(function () {

    var window_scrollTop = $(window).scrollTop();

    if (window_scrollTop > 50) {
        $('#gotop').css({
            "opacity": "1",
            "pointer-events": "unset"
        })

    } else {
        $('#gotop').css({
            "opacity": "0",
            "pointer-events": "none"
        })
    }

})

function back() {
    history.back(1)
}

$(".hamburgerBar").click(function () {
    $(".hamburgerBarItemArea").toggleClass('active')
    $(this).toggleClass('active')
})