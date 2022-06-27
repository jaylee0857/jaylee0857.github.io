;(function () {
    // gotop
    function goTop() {
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
    }
    // 漢堡條
    function hamburger() {
        $('#hamburger').click(function () {
            $(this).toggleClass('open');
            $('.menu ul').toggleClass('active');
            $('.maskPhoneWhite').toggleClass('active');
            $('.maskPhoneBlack').toggleClass('active');
        });
        $('.maskPhoneBlack').click(function () {
            $('#hamburger').toggleClass('open');
            $('.menu ul').toggleClass('active');
            $('.maskPhoneWhite').toggleClass('active');
            $('.maskPhoneBlack').toggleClass('active');
        })
    }
    // 手機板電腦版切換
    function switchMedia() {
        let w = window.innerWidth;
        let x = $("#toggleSearch").is(':checked');

        if (w > 1200) {
            if (!x) {
                $('.subNav').removeClass('active');
                $('.searchStyle').removeClass('active');
                $('.search__close').removeClass('active');
                $('.search').css({"top":"50%","left":"50%","transform":"translate(-50%,-50%)"});
                $('.search__button.search__button--wrap').css({'box-shadow':'0 0 14px -7px black'})
                $('.search__button.search__button--submit').css({'box-shadow':'0 0 14px -7px black'})
            } else {
                $('.subNav').addClass('active');
                $('.searchStyle').addClass('active');
                $('.search__close').addClass('active');
                $('.search').css({"top":"100%","left":"100%","transform":"translate(calc(-100% + 89px),-100%)"});
                $('.search__button.search__button--wrap').css({'box-shadow':'0 0 0 0 white'})
                $('.search__button.search__button--submit').css({'box-shadow':'0 0 0 0 white'})
                console.log($('.search__button.search__button--submit').css('box-shadow'));
            }
        }else if (w < 768){
            $('.subNav').removeClass('active');
            if (!x) {
                $('.search').css({"left":"100%"});
                if($('.menu #hamburger').hasClass('open')){
                    $('.search').css({"left":"50%"});
                    $('.search__button.search__button--wrap').css({'box-shadow':'0 0 0 0 white'})
                    $('.search__button.search__button--submit').css({'box-shadow':'0 0 0 0 white'})
                }
            }
            else {
                
                $('.search').css({"left":"100%"});
            }
        }
        else if (w < 1200){
            $('.subNav').removeClass('active');
            if (!x) {
                $('.search').css({"left":"100%"});
                if($('.menu #hamburger').hasClass('open')){
                    $('.search').css({"left":"50%"});
                    $('.search__button.search__button--wrap').css({'box-shadow':'0 0 0 0 white'})
                    $('.search__button.search__button--submit').css({'box-shadow':'0 0 0 0 white'})
                }
            }
            else {
                
                $('.search').css({"left":"100%"});
            }
        }else if (w < 576){
            $('.subNav').removeClass('active');
            if (!x) {
                $('.search').css({"left":"100%"});
                if($('.menu #hamburger').hasClass('open')){
                    $('.search').css({"left":"50%"});
                    $('.search__button.search__button--wrap').css({'box-shadow':'0 0 0 0 white'})
                    $('.search__button.search__button--submit').css({'box-shadow':'0 0 0 0 white'})
                }
            }
            else {
                
                $('.search').css({"left":"100%"});
            }
        }
    }
    $(window).scroll(function () {
        goTop()
    })
    $(document).ready(function () {
        window.addEventListener('resize', switchMedia);
        window.addEventListener('click', switchMedia);
        hamburger();
        switchMedia();
        // aos  Initialization
        AOS.init();
        $('body').removeClass('loading');
    });


    
    //超過字數顯示...
    $(function () {
      var len = 20;
       // 超過32個字以"..."取代
  
      $(".modal-title").each(function (i) {
        $(this).text().trim()
        console.log($(this).text().trim());
        if ($(this).text().length > len) {
  
          // $(this).attr("title", $(this).text());
          var text = $(this).text().trim().substring(0, len - 1) + "...";
          $(this).text(text);
        }
      });
      
    });


})()

// search__close