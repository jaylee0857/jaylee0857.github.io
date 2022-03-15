@extends('layouts/nav')

@section('css')
    <!-- page css -->
    <link rel="stylesheet" href="/css/FAQ.css">
    <!-- swiper -->
    <link rel="stylesheet" href="https://unpkg.com/swiper/swiper-bundle.min.css">
    <!-- bootstrap -->
    <link rel="stylesheet" href="./node_modules/bootstrap/dist/css/">
@endsection


@section('content')
    <section id="FAQ">
        <h1 class="title">FAQ</h1>
        <!-- <img class="title_wave" src="/img/material/waves/wave-34.svg" alt=""> -->

        <div class="common">

            <div class="type">
                <div class="box_l" id="l1">
                    <h2>交通問題</h3>
                </div>
                <div class="box_r" id="r1">
                    <h3>1平假日營業時間？過年會休館嗎？</h3>
                    <p>全年無休，平日為10:00-21:00；假日(含國定假日)為10:00-22:00。
                        最後入館時間為閉店前一小時，若遇特殊狀況請依官方網站或粉絲專頁公告為主。</p>
                    <hr>
                    <h3>是否有吸菸室？</h3>
                    <p>館內並未設有吸菸室，且所有區域全面禁菸，敬請配合。</p>
                    <hr>
                    <h3>若有相關的合作提案，可以與誰聯繫呢？</h3>
                    <p>請將您的提案寄至pr@xpark.com.tw，若有需要會主動與您聯繫。</p>
                    <hr>
                    <h3>我是外籍旅客，購票或購物後是否可以退稅？</h3>
                    <p>Xpark無提供退稅之服務。</p>
                </div>
            </div>

            <div class="type">
                <div class="box_l" id="l2">
                    <h2>營業相關</h3>
                </div>
                <div class="box_r" id="r2">
                    <h3>2平假日營業時間？過年會休館嗎？</h3>
                    <p>全年無休，平日為10:00-21:00；假日(含國定假日)為10:00-22:00。
                        最後入館時間為閉店前一小時，若遇特殊狀況請依官方網站或粉絲專頁公告為主。</p>
                    <hr>
                    <h3>是否有吸菸室？</h3>
                    <p>館內並未設有吸菸室，且所有區域全面禁菸，敬請配合。</p>
                    <hr>
                    <h3>若有相關的合作提案，可以與誰聯繫呢？</h3>
                    <p>請將您的提案寄至pr@xpark.com.tw，若有需要會主動與您聯繫。</p>
                    <hr>
                    <h3>我是外籍旅客，購票或購物後是否可以退稅？</h3>
                    <p>Xpark無提供退稅之服務。</p>

                </div>
            </div>

            <div class="type">
                <div class="box_l" id="l3">
                    <h2>票務問題</h3>
                </div>
                <div class="box_r" id="r3">
                    <h3>3平假日營業時間？過年會休館嗎？</h3>
                    <p>全年無休，平日為10:00-21:00；假日(含國定假日)為10:00-22:00。
                        最後入館時間為閉店前一小時，若遇特殊狀況請依官方網站或粉絲專頁公告為主。</p>
                    <hr>
                    <h3>是否有吸菸室？</h3>
                    <p>館內並未設有吸菸室，且所有區域全面禁菸，敬請配合。</p>
                    <hr>
                    <h3>若有相關的合作提案，可以與誰聯繫呢？</h3>
                    <p>請將您的提案寄至pr@xpark.com.tw，若有需要會主動與您聯繫。</p>
                    <hr>
                    <h3>我是外籍旅客，購票或購物後是否可以退稅？</h3>
                    <p>Xpark無提供退稅之服務。</p>
                </div>
            </div>

            <div class="type">
                <div class="box_l" id="l4">
                    <h2>參觀及服務</h3>
                </div>
                <div class="box_r active-block" id="r4">
                    <h3>4平假日營業時間？過年會休館嗎？</h3>
                    <p>全年無休，平日為10:00-21:00；假日(含國定假日)為10:00-22:00。
                        最後入館時間為閉店前一小時，若遇特殊狀況請依官方網站或粉絲專頁公告為主。</p>
                    <hr>
                    <h3>是否有吸菸室？</h3>
                    <p>館內並未設有吸菸室，且所有區域全面禁菸，敬請配合。</p>
                    <hr>
                    <h3>若有相關的合作提案，可以與誰聯繫呢？</h3>
                    <p>請將您的提案寄至pr@xpark.com.tw，若有需要會主動與您聯繫。</p>
                    <hr>
                    <h3>我是外籍旅客，購票或購物後是否可以退稅？</h3>
                    <p>Xpark無提供退稅之服務。</p>
                    <h3>4平假日營業時間？過年會休館嗎？</h3>
                    <p>全年無休，平日為10:00-21:00；假日(含國定假日)為10:00-22:00。
                        最後入館時間為閉店前一小時，若遇特殊狀況請依官方網站或粉絲專頁公告為主。</p>
                    <hr>
                    <h3>是否有吸菸室？</h3>
                    <p>館內並未設有吸菸室，且所有區域全面禁菸，敬請配合。</p>
                    <hr>
                    <h3>若有相關的合作提案，可以與誰聯繫呢？</h3>
                    <p>請將您的提案寄至pr@xpark.com.tw，若有需要會主動與您聯繫。</p>
                    <hr>
                    <h3>我是外籍旅客，購票或購物後是否可以退稅？</h3>
                    <p>Xpark無提供退稅之服務。</p>
                </div>
            </div>

        </div>


        <div class="dialog">
            <div class="dialogBox">
                <div class="dia_area_1">
                    <img class="dia_1" src="/img/material/FAQ/dialog-07.svg" alt="">
                    <div class="block_1">有其他問題？提問來幫您解決 <br>ヽ༼⊙_⊙༽ﾉ</div>
                </div>

            </div>
            <div id="issueBox">
                <input id="issue" type="text" placeholder="你ㄉ問題??">
                <i class="fas fa-reply"></i>
            </div>
        </div>


        <img class="fish_1" src="/img/material/FAQ/fish-01.svg" alt="">
        <img class="fish_2" src="/img/material/FAQ/fish-02.svg" alt="">
        <img class="fish_3" src="/img/material/FAQ/fish-03.svg" alt="">
        <img class="fish_4" src="/img/material/FAQ/fish-04.svg" alt="">
        <img class="fish_5" src="/img/material/FAQ/fish-05.svg" alt="">
        <img class="fish_6" src="/img/material/FAQ/fish-06.svg" alt="">


    </section>
@endsection

@section('js')
    <script src="https://unpkg.com/swiper/swiper-bundle.js"></script>
    <!-- Initialize Swiper -->
    <script src="./node_modules/bootstrap/dist/js/bootstrap.bundle.js"></script>
    <script>
        console.log($(window).width());

        // 左側點擊時
        $('#l1').on('click', function(){
            $('#r2,#r3,#r4').removeClass('active-block')
            $('#r1').addClass('active-block')
            // $('.box_r').addClass('active-block')
        })

        $('#l2').on('click', function(){
            $('#r1,#r3,#r4').removeClass('active-block')
            $('#r2').addClass('active-block')
            // $('.box_r').addClass('active-block')
        })

        $('#l3').on('click', function(){
            $('#r2,#r1,#r4').removeClass('active-block')
            $('#r3').addClass('active-block')
            // $('.box_r').addClass('active-block')
        })

        $('#l4').on('click', function(){
            $('#r2,#r3,#r1').removeClass('active-block')
            $('#r4').addClass('active-block')
            // $('.box_r').addClass('active-block')
        })

        // QA板

        $('.fas.fa-reply').click(function () {
            QABot()
        })

        $('#issue').on('keydown', function (e) {

            if (e.keyCode == '13') {
                QABot()

            }
        })

        function QABot() {
            var userIssue = $('#issue').val()
            $('.dialogBox').append(`
                <div class="dia_area_2">
                    <img class="dia_2" src="/img/material/FAQ/dialog-08.svg" alt="">
                    <div class="block_2">${userIssue}</div>
                </div>
            `)
            $('#issue').val('')
            $('.dialogBox').append(`
                <div class="dia_area_1">
                    <img class="dia_1" src="/img/material/FAQ/dialog-07.svg" alt="">
                    <div class="block_1">你說的我都不會啦 <br>ಠ_ಠ　</div>
                </div>
            `)
        }
    </script>

@endsection
