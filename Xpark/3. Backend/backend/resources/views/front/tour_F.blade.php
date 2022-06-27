@extends('layouts/nav')

@section('css')
    <!-- swiper -->
    <link rel="stylesheet" href="https://unpkg.com/swiper/swiper-bundle.min.css">
    <!-- page css -->
    <link rel="stylesheet" href="/css/tour_F.css">
@endsection

@section('content')
    <section id="tour_F">
        <h1 class="title">館內導覽</h1>

        <div class="left">
        <img class="floor_f" src="/img/material/tour_f/floor_pic-01.svg" alt="">
        <div class="floors">

            <div class="img">
            <img class="f_1" src="/img/material/tour_f/floor_pic-01.svg" alt="">
            </div>

            <div class="img">
            <img class="f_2" src="/img/material/tour_f/floor_pic-02.svg" alt="">
            </div>

            <div class="img">
            <img class="f_3" src="/img/material/tour_f/floor_pic-03.svg" alt="">
            </div>

        </div>
        </div>

        <div class="guided">
        <div class="right_f1">
            <div class="swiper-container">
            <div class="swiper-wrapper">
                <div class="swiper-slide">
                <h3>與眾同樂</h3>
                <img src="/img/material/tour_f/1-1.jpg" alt="">
                <h4>生物驚奇檔案，等您來蒐集</h4>
                <p>大自然中的生物充滿了許多小祕密，您知道熊狸擁有強壯的尾巴，上廁所時會飄出陣陣爆米花香味?海獅的前腳鰭狀肢裡面的骨頭跟人類居然很相像？！更多的生物驚奇檔案，等您來和Xpark一起發現。</p>
                </div>

                <div class="swiper-slide">
                <h3>世外桃源</h3>
                <img src="/img/material/tour_f/1-2.jpg" alt="">
                <h4>蜿蜒的通道，通往另一個平行世界</h4>
                <p>難以被發現的小徑，通往另一個平行時空。經過飼育人員的用心細心的照護之下，讓動物做好準備，輕鬆自在的表現出自然的的一面。</p>
                </div>

                <div class="swiper-slide">
                <h3>潮間戲灘</h3>
                <img src="/img/material/tour_f/1-3.jpg" alt="">
                <h4>繽紛小魚圍繞，忘情進入大海懷抱</h4>
                <p>海岸一天當中會經歷兩次潮起潮落，居住在潮間帶的生物及鮮豔小魚，Xpark創造了一個潮間帶生態，您無需擔心潮汐的時間、岸邊嬉戲潛在的危險，只要洗淨雙手與雙腳，您也能輕鬆忘情的享有潮間帶探索之旅。</p>
                </div>

                <div class="swiper-slide">
                <h3>漫步叢林</h3>
                <img src="/img/material/tour_f/1-4.jpg" alt="">
                <h4>台灣上中下游生態，一次收集</h4>
                <p>現實中，我們很難飛去野生叢林散步。但在Xpark，欣賞台灣樹林在您眼前茁壯，不用爬山便看盡河川上中下游的特殊生態與河中住民，沿岸兩棲類生物也熱烈的向您招手，我們可以盡情享受微型叢林的氣氛與環境，漫步自然。</p>
                </div>
            </div>
            <!-- Add Scrollbar -->
            <div class="swiper-scrollbar"></div>
            </div>
        </div>

        <div class="right_f2">
            <div class="swiper-container">
            <div class="swiper-wrapper">
                <div class="swiper-slide">
                <h3>福爾摩沙</h3>
                <img src="/img/material/tour_f/2-1.jpg" alt="">
                <h4>走進海中，一睹壯闊之美</h4>
                <p>台灣被台灣海峽、巴士海峽、太平洋及東海圍繞著，是名符其實的海島國家。
                    周圍海水溫暖，豐富多樣的魚種、變化萬千的海底地形，福爾摩沙完整呈現了這樣的生存環境，宛如走進海中，一睹壯闊之美。</p>
                </div>

                <div class="swiper-slide">
                <h3>癒見水母</h3>
                <img src="/img/material/tour_f/2-2.jpg" alt="">
                <h4>漫游萬花筒，與水母翩翩起舞</h4>
                <p>各色虹光灑在透明的水母身上，無邊鏡面創造奇幻氛圍，顏色各異的水母在您身邊悠遊，讓您的心情一起翩翩起舞。</p>
                </div>

                <div class="swiper-slide">
                <h3>企鵝奇遇</h3>
                <img src="/img/material/tour_f/2-3.jpg" alt="">
                <h4>輕鬆來去陸地與海域，企鵝與您奇妙相遇</h4>
                <p>初次亮相的麥哲倫企鵝與國王企鵝一同居住在這裡，企鵝到陸地休憩社交；進入水域中嬉戲覓食。各種可愛姿態，與您展開迷人的邂逅回憶。</p>
                </div>

            <div class="swiper-scrollbar"></div>
            </div>
        </div>
        </div>

        <div class="right_f3">
            <div class="swiper-container">
            <div class="swiper-wrapper">

                <div class="swiper-slide">
                <h3>珊瑚潛行</h3>
                <img src="/img/material/tour_f/3-1.jpg" alt="">
                <h4>絕對迫力，邀您潛入絢爛的珊瑚之海</h4>
                <p>珊瑚礁由無數的珊瑚蟲所組成，無色的石珊瑚蟲能分泌碳酸鈣骨骼，珊瑚蟲身上因居住有色共生藻才擁有了斑斕色彩。
                    歷經數千萬年的堆積，時間造就珊瑚礁各式各樣的樣貌，與湛藍的海水形成強烈的對比，180度環景設計，大自然巧奪天工的設計盡享眼前。</p>
                </div>

                <div class="swiper-slide">
                <h3>暖海生機</h3>
                <img src="/img/material/tour_f/3-2.jpg" alt="">
                <h4>生命的搖籃，孕育無限生機</h4>
                <p>看似平靜的溫暖海洋中，有著生命搖籃之稱的鰻草吸引著新手爸媽們來這裡孕育下一代，為了在大海中誕下並使新生命茁壯，生物們有著各自特別的繁衍方法，為了生活也發展出不同的生活方式，更有異物種間的相互合作，共榮共存的努力找到生存之道，盈滿了活力更有無限生機。</p>
                </div>

                <div class="swiper-slide">
                <h3>雨林探險</h3>
                <img src="/img/material/tour_f/3-3.jpg" alt="">
                <h4>豐饒之地，熱帶雨林探險之旅</h4>
                <p>溫暖又潮濕的氣候，孕育了一片欣欣向榮的巨大雨林，迷濛的霧氣增添了神祕感，形形色色的生物在樹上、陸上、水中棲息生活，千奇百怪的生物在這片雨林中成家，展現出朝氣蓬勃的生命力。</p>
                </div>

                <div class="swiper-slide">
                <h3>寒帶行凍</h3>
                <img src="/img/material/tour_f/3-4.jpg" alt="">
                <h4>冰寒舞台，跟著海豹及昆布暢遊搖擺</h4>
                <p>寒冷的海域交織著冷空氣的流動，360度透明隧道窺看海豹敏捷穿梭、恣意地游過頭頂，與浮冰伴舞展現優雅姿態。
                    巨大昆布組成的海洋森林，在急浪拍打湧動之下隨波搖擺。魚類居民卻是相當淡定，彷彿這風起雲湧並不在他的世界掀起一絲風浪，一動一靜，令人莞爾又充滿驚奇。</p>
                </div>

                <div class="swiper-slide">
                <h3>深海尋秘</h3>
                <img src="/img/material/tour_f/3-5.jpg" alt="">
                <h4>未知的幽暗秘境，探索深海神秘生物</h4>
                <p>「高壓」、「冰冷」、「黑暗」是嚴酷無情的深海寫實的環境描述，在這充滿未知的秘境中，生物演化出獨特的樣貌，看巨大的甘氏巨螯蟹伸展纖細關節；無光的世界演化出放棄視覺的盲鰻；眼前飄動美麗又脆弱的海雪正閃閃發亮，充分表達了這片嚴苛又淒美的海域，滿足人類無法抵達深海的好奇心。</p>
                </div>

                <div class="swiper-slide">
                <h3>虛實互動</h3>
                <img src="/img/material/tour_f/3-6.jpg" alt="">
                <h4>親子同樂，暢游科技之海</h4>
                <p>驅動先進的多媒體設備，發揮想像力，像DNA一般自由組合繪出特的海洋生物。在有趣的虛實互動中，透過體感科技手腦並用拯救海洋，與想像力一同奔馳在無邊無際的Xpark海域，學習海洋保育觀念。</p>
                </div>

            </div>
            <div class="swiper-scrollbar"></div>
            </div>
        </div>
        </div>

        <div class="child">
        <img class="head" src="/img/material/child/child_part-06.svg" alt="">
        <img class="eye_l" src="/img/material/child/child_part-07.svg" alt="">
        <img class="eye_r" src="/img/material/child/child_part-08.svg" alt="">
        <!-- <img class="hand" src="./material/child/child_part-05.svg" alt=""> -->
        </div>

    </section>
@endsection

@section('js')
  <script src="https://unpkg.com/swiper/swiper-bundle.js"></script>
  <!-- Initialize Swiper -->
  <script>
    var swiper1 = new Swiper('.right_f1 .swiper-container', {
      scrollbar: {
        el: '.swiper-scrollbar',
        hide: true,
      },
    });

    var swiper2 = new Swiper('.right_f2 .swiper-container', {
      scrollbar: {
        el: '.swiper-scrollbar',
        hide: true,
      },
    });

    var swiper3 = new Swiper('.right_f3 .swiper-container', {
      scrollbar: {
        el: '.swiper-scrollbar',
        hide: true,
      },
    });


    //換按鈕圖片
    $(".f_1").click(function () {
      // console.log("1321654")
      $(this).attr("src", "/img/material/tour_f/floor-11.svg")
        .css("width", "100px")
      $(".f_2").attr("src", "/img/material/tour_f/floor-09.svg")
        .css("width", "80px")
      $(".f_3").attr("src", "/img/material/tour_f/floor-10.svg")
        .css("width", "80px")

      $(".floor_f").attr("src", "/img/material/tour_f/floor_pic-01.svg")
      $('.right_f1').show()
      $('.right_f2').hide()
      $('.right_f3').hide()

      swiperUpdata()
    })

    $(".f_2").click(function () {
      // console.log("1321654")
      $(this).attr("src", "/img/material/tour_f/floor-12.svg")
        .css("width", "100px")
      $(".f_1").attr("src", "/img/material/tour_f/floor-08.svg")
        .css("width", "80px")
      $(".f_3").attr("src", "/img/material/tour_f/floor-10.svg")
        .css("width", "80px")

      $(".floor_f").attr("src", "/img/material/tour_f/floor_pic-02.svg")
      $('.right_f2').show()
      $('.right_f1').hide()
      $('.right_f3').hide()
      swiperUpdata()
    })

    $(".f_3").click(function () {
      // console.log("1321654")
      $(this).attr("src", "/img/material/tour_f/floor-13.svg")
        .css("width", "100px")
      $(".f_1").attr("src", "/img/material/tour_f/floor-08.svg")
        .css("width", "80px")
      $(".f_2").attr("src", "/img/material/tour_f/floor-09.svg")
        .css("width", "80px")

      $(".floor_f").attr("src", "/img/material/tour_f/floor_pic-03.svg")
      $('.right_f3').show()
      $('.right_f1').hide()
      $('.right_f2').hide()
      swiperUpdata()
    })

    function swiperUpdata() {
      swiper1.update();
      swiper2.update();
      swiper3.update();
    }

    $(document).ready(function () {
      $(".f_1").click()
    })


  </script>

  <script>
    $(window).mousemove(function (evt) {
      var x = evt.pageX;
      var y = evt.pageY;


      if (x < $(window).width() / 2 - 100) {
        $(".eye_l").css("left", "30%")
                   .css("top","52%");
        $(".eye_r").css("left", "56%")
                   .css("top","53%");
      } else if (x > $(window).width() / 2 + 100) {
        $(".eye_l").css("left", "34%")
                   .css("top","51%")
        $(".eye_r").css("left", "60%")
                   .css("top","52%");
      } else {
        $(".eye_l").css("left", "32%")
                   .css("top","50%")
        $(".eye_r").css("left", "58%")
                   .css("top","51%");
      }
    });


  </script>

  <script>
    // phone version navbar
    var bars = document.querySelector(".bars")
    var menu = document.querySelector(".phoneVersion")

    bars.onclick = function () {
        console.log(123)
        bars.classList.toggle("fa-times")
        menu.classList.toggle("active")
    }
  </script>
@endsection
