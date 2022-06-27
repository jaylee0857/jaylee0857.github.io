@extends('layouts/nav')

@section('css')
    <!-- page css -->
    <link rel="stylesheet" href="/css/tour_0.css">
@endsection

@section('content')
    <section id="tour_0">

        <h1 class="title">館內導覽</h1>

        <div class="left">
            <img class="pic" src="/img/material/tour_0/photo_xpark.jpg" alt="" />
            <div class="floors">
                <a href="/tour_F">
                    <img class="f_3" src="/img/material/tour_0/floor-03.svg" alt="">
                </a>
                <a href="/tour_F">
                    <img class="f_2" src="/img/material/tour_0/floor-02.svg" alt="">
                </a>
                <a href="/tour_F">
                    <img class="f_1" src="/img/material/tour_0/floor-01.svg" alt="">
                </a>
            </div>
        </div>

        <div class="right">
            <div class="fish_area_1">
                <img class="fish1" src="/img/material/lifes/life-01.svg" alt="" />
                <p class="area"></p>
            </div>

            <div class="fish_area_2">
                <img class="fish2" src="/img/material/lifes/life-02.svg" alt="" />
                <p>：3</p>
            </div>

            <div class="fish_area_3">
                <img class="fish3" src="/img/material/lifes/life-03.svg" alt="" />
                <p>...</p>
            </div>

            <div class="fish_area_4">
                <img class="fish4" src="/img/material/lifes/life-04.svg" alt="" />
                <p>？？</p>
            </div>

            <div class="fish_area_5">
                <img class="fish5" src="/img/material/lifes/life-05.svg" alt="" />
            </div>

            <img class="wave1" src="/img/material/waves/wave-33.svg" alt="">
            <img class="wave2" src="/img/material/waves/wave-34.svg" alt="">
            <img class="wave3" src="/img/material/waves/wave-35.svg" alt="">
        </div>

    </section>

@endsection

@section('js')
    <script>

        setTimeout(function () {
            $(".fish_area_2 p").css("opacity", "1");
        }, 1500);
        setTimeout(function () {
            $(".fish_area_3 p").css("opacity", "1");
        }, 2500);
        setTimeout(function () {
            $(".fish_area_4 p").css("opacity", "1");
        }, 3000);

        $(".f_1").hover(function () {
            $(this).attr("src", "/img/material/tour_0/floor-04.svg")
            $(".f_2").attr("src", "/img/material/tour_0/floor-02.svg")
            $(".f_3").attr("src", "/img/material/tour_0/floor-03.svg")
        })

        $(".f_2").hover(function () {
            $(this).attr("src", "/img/material/tour_0/floor-05.svg")
            $(".f_1").attr("src", "/img/material/tour_0/floor-01.svg")
            $(".f_3").attr("src", "/img/material/tour_0/floor-03.svg")
        })

        $(".f_3").hover(function () {
            $(this).attr("src", "/img/material/tour_0/floor-06.svg")
            $(".f_1").attr("src", "/img/material/tour_0/floor-01.svg")
            $(".f_2").attr("src", "/img/material/tour_0/floor-02.svg")
        })

        var app;

        $(document).ready(function () {
            return app.init();
        });

        app = {
            text: "大家請跟我往這邊走",
            index: 0,
            chars: 0,
            speed: 100,
            container: ".area",
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
