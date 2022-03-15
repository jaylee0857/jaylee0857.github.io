$(document).ready(function () {
    $('.font-size-change-box button').click(function (e) {
        e.preventDefault();
        var fontSize = $(this).data('size');
        $('html,body').css('font-size', fontSize);
        $('.font-size-change-box button').removeClass("active");
        $(this).addClass("active");
    });

    $(".mobile-toggle-btn").click(function (e) {
        e.preventDefault();
        $("#navbar-collapse").toggleClass("active");
        $(".mobile-toggle-btn").toggleClass("active");

        $('#main-nav').show();
        $('#sub-nav').show();
    });

    $(".mobile-toggle-btn.active").click(function (e) {
        $('#main-nav').hide();
        $('#sub-nav').hide();
    });


    $('a[data-toggle="dp-collapse"]').click(function (e) {
        //check window size if ismobile e.preventDefault();
        var window_width = $(window).width();
        if (window_width < 576) {
            e.preventDefault();
            var toggleid = $(this).data("toggleid");
            $(this).find("p").toggleClass("active");
            $(".content[data-toggleid=" + toggleid + "]").toggleClass("active");
        }
    });

    $("#left-menu span").click(function (e) {
        e.preventDefault();
        $(this).toggleClass("active");
        $("#left-menu ul").toggleClass("active");
    });
});




//卡片收起效果
function closed() {
    document.getElementById('card').style.right = (document.getElementById('card').offsetWidth * -1) + "px";
    document.getElementById('closed').style.display = "none";
    document.getElementById('open').style.display = "block";
}

function opened() {
    document.getElementById('card').style.right = "0"
    document.getElementById('open').style.display = "none"
    document.getElementById('closed').style.display = "block"
}

// GoTop 顯示隱藏
$(window).scroll(function () {
    var gotop = $(window).scrollTop();
    if (gotop > 300) {
        $('#GoTop').addClass('show');
    }
    if (gotop < 300) {
        $('#GoTop').removeClass('show');
    }
});

