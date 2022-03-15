$('.phone_style_option').on('change', function (e) {

    // document.querySelector('#pills-standby_power-tab').click()
    let trigger = $(this).val();
    console.log(trigger);
    document.querySelector('#'+trigger).click()
});

$('.phone_style_option select').on('change', function (e) {

    // document.querySelector('#pills-standby_power-tab').click()
    let trigger = $(this).val();
    console.log(trigger);
    document.querySelector('#'+trigger).click()
});

$(document).ready(function () {

    $(".gif_btn").mouseleave(function () {
        var url = $(this).children(".animation").css("background-image");
        url = url.substring(url.indexOf('url("') + 5, url.indexOf('")'));
        url = 'url("' + url.replace(/\?.*$/, "") + "?x=" + Math.random() + '")';
        $(this).children(".animation").css("background-image", url);
    });
});