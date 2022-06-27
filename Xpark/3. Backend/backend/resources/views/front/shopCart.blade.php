@extends('layouts/nav')

@section('css')
    <title>Shop</title>
    <!-- swiper -->
    <link rel="stylesheet" href="https://unpkg.com/swiper/swiper-bundle.css">
    <!-- page css -->
    <link rel="stylesheet" href="/css/shopCart.css">
@endsection


@section('content')
    <h1 class="title">紀念品店</h1>

    <section id="tabGroup">
        <div class="gift">伴手禮</div>
        <div class="essential">生活用品</div>
    </section>

    <!-- Swiper -->
    <section class="page" id="page1">
        <div class="swiper-container">
            <div class="swiper-wrapper">
                <div class="swiper-slide">
                    <img class="pic" src="/img/material/cart/shop_1.jpg" alt="">
                    <h2 class="item">巧克力球</h2>
                    <h4 class="price">NTD500</h4>
                    <p class="info">近年日本更是推出頂級巧克力球，殊不知，這風靡大人小孩的點心最早其實起源於英國！</p>
                    <button class="more">了解更多</button>
                </div>
                <div class="swiper-slide">
                    <img class="pic" src="/img/material/cart/shop_2.jpg" alt="">
                    <h2 class="item">巧克力棒</h2>
                    <h4 class="price">NTD500</h4>
                    <p class="info">近年日本更是推出頂級巧克力球，殊不知，這風靡大人小孩的點心最早其實起源於英國！</p>
                    <button class="more">了解更多</button>
                </div>
                <div class="swiper-slide">
                    <img class="pic" src="/img/material/cart/shop_3.jpg" alt="">
                    <h2 class="item">法式鳳梨酥</h2>
                    <h4 class="price">NTD500</h4>
                    <p class="info">近年日本更是推出頂級巧克力球，殊不知，這風靡大人小孩的點心最早其實起源於英國！</p>
                    <button class="more">了解更多</button>
                </div>
                <div class="swiper-slide">
                    <img class="pic" src="/img/material/cart/shop_4.jpg" alt="">
                    <h2 class="item">sousou 聯名托特包</h2>
                    <h4 class="price">NTD500</h4>
                    <p class="info">近年日本更是推出頂級巧克力球，殊不知，這風靡大人小孩的點心最早其實起源於英國！</p>
                    <button class="more">了解更多</button>
                </div>
                <div class="swiper-slide">
                    <img class="pic" src="/img/material/cart/shop_5.jpg" alt="">
                    <h2 class="item">象印 聯名保溫瓶</h2>
                    <h4 class="price">NTD500</h4>
                    <p class="info">近年日本更是推出頂級巧克力球，殊不知，這風靡大人小孩的點心最早其實起源於英國！</p>
                    <button class="more">了解更多</button>
                </div>
                <div class="swiper-slide">
                    <img class="pic" src="/img/material/cart/shop_6.jpg" alt="">
                    <h2 class="item">WEAVISM聯名毛巾</h2>
                    <h4 class="price">NTD500</h4>
                    <p class="info">近年日本更是推出頂級巧克力球，殊不知，這風靡大人小孩的點心最早其實起源於英國！</p>
                    <button class="more">了解更多</button>
                </div>
                <div class="swiper-slide">
                    <img class="pic" src="/img/material/cart/shop_7.jpg" alt="">
                    <h2 class="item">變色馬克杯</h2>
                    <h4 class="price">NTD500</h4>
                    <p class="info">近年日本更是推出頂級巧克力球，殊不知，這風靡大人小孩的點心最早其實起源於英國！</p>
                    <button class="more">了解更多</button>
                </div>
            </div>
        </div>

        <div class="arrowBox">
            <div><i class="fas fa-chevron-circle-left"></i></div>
            <div><i class="fas fa-chevron-circle-right"></i></div>
        </div>
    </section>

    <section class="page active" id="page2">
        <div class="swiper-container">
            <div class="swiper-wrapper">
                <div class="swiper-slide">
                    <img class="pic" src="/img/material/cart/shop_4.jpg" alt="">
                    <h2 class="item">sousou 聯名托特包</h2>
                    <h4 class="price">NTD500</h4>
                    <p class="info">近年日本更是推出頂級巧克力球，殊不知，這風靡大人小孩的點心最早其實起源於英國！</p>
                    <button class="more">了解更多</button>
                </div>
                <div class="swiper-slide">
                    <img class="pic" src="/img/material/cart/shop_5.jpg" alt="">
                    <h2 class="item">象印 聯名保溫瓶</h2>
                    <h4 class="price">NTD500</h4>
                    <p class="info">近年日本更是推出頂級巧克力球，殊不知，這風靡大人小孩的點心最早其實起源於英國！</p>
                    <button class="more">了解更多</button>
                </div>
                <div class="swiper-slide">
                    <img class="pic" src="/img/material/cart/shop_6.jpg" alt="">
                    <h2 class="item">WEAVISM聯名毛巾</h2>
                    <h4 class="price">NTD500</h4>
                    <p class="info">近年日本更是推出頂級巧克力球，殊不知，這風靡大人小孩的點心最早其實起源於英國！</p>
                    <button class="more">了解更多</button>
                </div>
                <div class="swiper-slide">
                    <img class="pic" src="/img/material/cart/shop_7.jpg" alt="">
                    <h2 class="item">變色馬克杯</h2>
                    <h4 class="price">NTD500</h4>
                    <p class="info">近年日本更是推出頂級巧克力球，殊不知，這風靡大人小孩的點心最早其實起源於英國！</p>
                    <button class="more">了解更多</button>
                </div>
                <div class="swiper-slide">
                    <img class="pic" src="/img/material/cart/shop_1.jpg" alt="">
                    <h2 class="item">巧克力球</h2>
                    <h4 class="price">NTD500</h4>
                    <p class="info">近年日本更是推出頂級巧克力球，殊不知，這風靡大人小孩的點心最早其實起源於英國！</p>
                    <button class="more">了解更多</button>
                </div>
                <div class="swiper-slide">
                    <img class="pic" src="/img/material/cart/shop_2.jpg" alt="">
                    <h2 class="item">巧克力棒</h2>
                    <h4 class="price">NTD500</h4>
                    <p class="info">近年日本更是推出頂級巧克力球，殊不知，這風靡大人小孩的點心最早其實起源於英國！</p>
                    <button class="more">了解更多</button>
                </div>
                <div class="swiper-slide">
                    <img class="pic" src="/img/material/cart/shop_3.jpg" alt="">
                    <h2 class="item">法式鳳梨酥</h2>
                    <h4 class="price">NTD500</h4>
                    <p class="info">近年日本更是推出頂級巧克力球，殊不知，這風靡大人小孩的點心最早其實起源於英國！</p>
                    <button class="more">了解更多</button>
                </div>
            </div>
        </div>

        <div class="arrowBox">
            <div><i class="fas fa-chevron-circle-left"></i></div>
            <div><i class="fas fa-chevron-circle-right"></i></div>
        </div>


    </section>

    <div class="fish_area_1">
        <p class="fish1_text"></p>
        <img class="fish1" src="/img/material/lifes/life-11.svg" alt="">

    </div>

    <div class="fish_area_2">
        <p class="fish2_text">!</p>
        <img class="fish2" src="/img/material/lifes/life-08.svg" alt="">
    </div>

@endsection

@section('js')
<script src="https://unpkg.com/swiper/swiper-bundle.js"></script>
<!-- Initialize Swiper -->
    <script>
        var swiper1 = new Swiper('#page1 .swiper-container', {
            slidesPerView: 4,
            spaceBetween: 30,
            navigation: {
                nextEl: '.fa-chevron-circle-right',
                prevEl: '.fa-chevron-circle-left',
            },

            breakpoints: {
                320: {
                    slidesPerView: 1,
                    spaceBetween: 0,
                },
                576: {
                    slidesPerView: 2
                },
                768: {
                    slidesPerView: 4,
                    spaceBetween: 20,
                },

            }

        });

        var swiper2 = new Swiper('#page2 .swiper-container', {
            slidesPerView: 4,
            spaceBetween: 30,
            navigation: {
                nextEl: '.fa-chevron-circle-right',
                prevEl: '.fa-chevron-circle-left',
            },

            breakpoints: {
                320: {
                    slidesPerView: 1,
                    spaceBetween: 0,
                },
                576: {
                    slidesPerView: 2
                },
                768: {
                    slidesPerView: 4,
                    spaceBetween: 20,
                },

            }

        });

        $(".gift").click(function () {
            $("#page1").css("display", "block")
            $("#page2").css("display", "none")
            $(".gift").addClass('active')
            $(".essential").removeClass('active')
            swiper1.update();
            swiper2.update();
        })

        $(".essential").click(function () {
            $("#page1").css("display", "none")
            $("#page2").css("display", "block")
            $(".gift").removeClass('active')
            $(".essential").addClass('active')
            swiper1.update();
            swiper2.update();
        })


        setTimeout(function () {
            $(".fish_area_2 p").css("opacity", "1");
        }, 1500);



        var app;

        $(document).ready(function () {
            return app.init();
        });

        app = {
            text: "空手回家你來幹嘛",
            index: 0,
            chars: 0,
            speed: 100,
            container: ".fish_area_1 p",
            init: function () {
                this.chars = this.text.length;
                return this.write();
            },
            write: function () {
                $(this.container).append(this.text[this.index]);
                if (this.index < this.chars) {
                    this.index++;
                    return window.setTimeout(function () {
                        return app.write();
                    }, this.speed);
                }
            }
        };
    </script>
@endsection
