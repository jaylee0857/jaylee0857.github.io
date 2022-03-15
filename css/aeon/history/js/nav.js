        //選單hover效果
        $('.product').hover(function () {
            $('.product-list').addClass('active')
        }, function () {
            $('.product-list').removeClass('active')
        })

        $('.product-list').hover(function () {
            $('.product-list').addClass('active')
        }, function () {
            $('.product-list').removeClass('active')
        })

        $('.news-list').hover(function () {
            $('.news-list').addClass('active')
        }, function () {
            $('.news-list').removeClass('active')
        })

        $('.expere').hover(function () {
            $('.news-list').addClass('active')
        }, function () {
            $('.news-list').removeClass('active')
        })

        $('.language').hover(function () {
            $('.lang-list').addClass('active')
        }, function () {
            $('.lang-list').removeClass('active')
        })

        $('.lang-list').hover(function () {
            $('.lang-list').addClass('active')
        }, function () {
            $('.lang-list').removeClass('active')
        })



        //漢堡條動畫
        $(document).ready(function () {
            $('#nav-icon1').click(function () {
                $('body').toggleClass('overflow_hidden')
                $(this).toggleClass('open');
                $('.mobile-list').toggleClass('mb_active');
            });
        });