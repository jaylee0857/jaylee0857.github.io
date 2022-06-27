@extends('layouts/nav_tamplate')

@section('css')
     <link rel="stylesheet" href="/css/what's_on.css">
     <!-- Link Swiper's CSS -->
     <link rel="stylesheet" href="https://unpkg.com/swiper/swiper-bundle.css">
     <title>What's on</title>
@endsection


@section('content')
<div class="container">
    <div class="title_group">
         <div class="title_box">
              <h1 id="title_news">最新消息</h1>
         </div>
         <span>
              <div id="tab1" class="tab-btn">．新聞報導</div>
              <div id="tab2" class="tab-btn">．近期活動</div>
         </span>
    </div>
    <div class="content">
         <div id="news" class="content_group">
             @foreach ($news_ch_list as $news_ch)
             <div class="news_list">
                <div class="news">
                     <div class="news_title">{{$news_ch->title}}</div>
                     <div class="news_date">{{$news_ch->date}}</div>
                </div>
                <div class="icon fas fa-minus-circle"></div>
           </div>
           <div class="news_info">
                <div class="img"><img src="{{$news_ch->image}}" alt=""></div>
                <div class="text">
                    {!!$news_ch->info!!}
                </div>
           </div>
             @endforeach
         </div>

         <div id="activities" class="content_group">
              <!-- Swiper -->
              <div class="swiper-container">
                   <div class="swiper-wrapper">
                        <div class="swiper-slide">
                             <p><b class="event_title">小企鵝誕生</b><br>Xpark麥哲倫家有喜事，小企鵝健康誕生！邀請你一起幫小企鵝取名，有機會拿到Xpark專屬小禮物！</br><b
                                       class="event_date">2020.10.20</b></p>
                             <div class="img"><img src="/img/events_penguin.jpg" alt=""></div>
                        </div>
                        <div class="swiper-slide">
                             <p><b class="event_title">浪漫特調咖啡</b><br>期間限定開催！Xpark夜間入場獨享浪漫企鵝戀人拿鐵</br><b
                                       class="event_date">2020.10.10</b></p>
                             <div class="img"><img src="/img/events_coffee.jpg" alt=""></div>
                        </div>
                        <div class="swiper-slide">
                             <p><b class="event_title">當季特展</b><br>海洋因塑（素）聯合展</br><b
                                       class="event_date">2020.10.01</b></p>
                             <div class="img"><img src="/img/events_plastic.jpg" alt=""></div>
                        </div>
                        <div class="swiper-slide">
                             <p><b class="event_title">當季特展</b><br>海洋生態攝影巡迴展</br><b
                                       class="event_date">2020.9.20</b></p>
                             <div class="img"><img src="/img/events_sea.jpg" alt=""></div>
                        </div>
                        <div class="swiper-slide">
                             <p><b class="event_title">我們開幕囉!</b><br>台灣獨創「Xpark x UNIQLO
                                  T恤入場券」歡慶Xpark開幕！</br><b class="event_date">2020.10.10</b></p>
                             <div class="img"><img src="/img/event_uniqlo.jpg" alt=""></div>
                        </div>
                   </div>
              </div>
              <!-- Add Pagination -->
              <div class="swiper-pagination"></div>
              <div class="activities_info">
                   <i class="fas fa-times-circle"></i>
                   <p>Xpark誠摯的邀請台灣民眾參與小企鵝命名活動，還有機會獲得超稀有的小禮物唷！
                        活動辦法：

                        1.小企鵝命名提案募集日為2020/10/12-2020/10/26
                        2.命名中選者將可獲得〝超稀有〞禮物一份，還有其他小禮物喔！
                   </p>
              </div>
              <div class="activities_info">
                   <i class="fas fa-times-circle"></i>
                   <p>專屬夜晚的行程，如今又多加一項啦！

                        自10/1早上10:00起可在KKday訂購限定夜間雙人套票(18：00場次)，平日每日限量25組，即可於入場後兌換期間限定的企鵝戀人拉花拿鐵，戀人咖啡只送不賣，僅限網路上進行預購。

                        ●活動期間：2020/10/12~
                        2020/11/30
                        ●購票期間：2020/10/01 10：00~2020/11/29 14：59

                        讓溫暖的咖啡為兩人的愛情升溫，讓企鵝為你的回憶加分！</p>
              </div>
              <div class="activities_info">
                   <i class="fas fa-times-circle"></i>
                   <p>
                        本特展串連家、海洋、以及海洋廢棄物議題，包含從國立臺灣科學教育館移展的「海呀！我的家」特展，並規劃加入與國立臺灣師範大學、中國化學會合作辦理「化學元素週期表」特展，將生活中的化學元素概念，除了呈現垃圾過量而造成海洋甚至是地球所面臨的問題，也需讓觀展民眾了解海洋減塑問題外，化學元素於海洋與生活的關係，進而關心化學及海洋環境等議題。
                   </p>
              </div>
              <div class="activities_info">
                   <i class="fas fa-times-circle"></i>
                   <p>
                        本展以海生館豐富多樣的水下攝影作品及出版圖鑑收錄之海洋生態影像成果，做為本展資料基礎，展區分為「可愛小丑魚」、「珊瑚的線條」及海生館影像區，張張影像都代表了海生館在海洋生態保育的軌跡及海洋教育發展的歷程，並專區介紹臺灣周邊海域(墾丁、綠島、蘭嶼)的優質潛點，搭配展出水下攝影器材及潛水裝備，藉以宣導安全潛水。
                   </p>
              </div>
              <div class="activities_info"><i class="fas fa-times-circle"></i>
                   <p>
                        Xpark x UNIQLO桃園指定店舖滿額贈紀念T恤（含門票）活動。Xpark與UNIQLO共同開發獨創「Xpark x UNIQLO T恤入場券 (T-Shirt
                        Ticket)」。大人、小孩款為不同的Xpark獨創圖案設計，並於T恤上印有Xpark入場券QRCODE。顧客於UNIQLO指定店鋪，購買3,000元以上商品(需包含大人小孩商品)，即可獲得乙件。穿著/持有「Xpark
                        x UNIQLO T恤入場券 (T-Shirt Ticket)」，即可入場Xpark。
                   </p>
              </div>
         </div>
    </div>
</div>
 <!-- sea urchin svg -->
 <img class="sea_life" src="/svg/sea life.svg" alt="">

 <!-- ugly_fish -->
 <img class="ugly_fish" src="/svg/ugly_fish.svg" alt="">
 <div class="ugly_fish_text"></div>
@endsection

@section('js')
<script src="https://code.jquery.com/jquery-3.5.1.js"
integrity="sha256-QWo7LDvxbWT2tbbQ97B53yJnYU3WhH/C8ycbRAkjPDc=" crossorigin="anonymous">
</script>

<script>
var btns = document.querySelectorAll(".tab-btn")
// tab1 , tab2 按鈕
var contents = document.querySelectorAll(".content_group")
// tabs對應的區塊
var container = document.querySelector(".container")

// news
var icons = document.querySelectorAll(".icon")
var news_infos = document.querySelectorAll(".news_info")

//activites
var swipers = document.querySelectorAll(".swiper-slide")
var activities_infos = document.querySelectorAll(".activities_info")
var clears = document.querySelectorAll(".fa-times-circle")

tab1.classList.add("active")
news.classList.add("active")

//切換新聞報導與近期活動頁面
for (let index = 0; index < btns.length; index++) {
     const btn = btns[index];
     const content = contents[index]

     btn.onclick = function () {
          clearAllActive()
          btn.classList.add("active")
          content.classList.add("active")
          container.classList.toggle("change_border")

     }

     //展開與收合新聞內容
     icons[0].classList.add('fa-plus-circle')
     news_infos[0].classList.add('active')


     for (let index = 0; index < icons.length; index++) {
          const icon = icons[index];
          const news_info = news_infos[index]

          icon.onclick = function () {
               clearAllInfoActive()
               icon.classList.add('fa-plus-circle')
               news_info.classList.add('active')
          }
     }

     //swiper內點擊近期活動開啟與收和活動內容
     for (let index = 0; index < swipers.length; index++) {
          const swiper = swipers[index];
          const activities_info = activities_infos[index];

          swiper.onclick = function () {
               clearAllAcitiviesInfoActive()
               activities_info.classList.add("active")
          }
     }

     for (let index = 0; index < activities_infos.length; index++) {
          const activities_info = activities_infos[index];
          const clear = clears[index];

          clear.onclick = function () {
               clearAllAcitiviesInfoActive()
          }

     }


     function clearAllActive() {
          for (let index = 0; index < btns.length; index++) {
               btns[index].classList.remove("active")
               contents[index].classList.remove("active")
          }
     }

     function clearAllInfoActive() {
          for (let index = 0; index < icons.length; index++) {
               news_infos[index].classList.remove("active")
               icons[index].classList.remove("fa-plus-circle")
          }
     }

     function clearAllAcitiviesInfoActive() {
          for (let index = 0; index < swipers.length; index++) {
               activities_infos[index].classList.remove("active")
          }
     }
}

// phone version navbar
var bars = document.querySelector(".bars")
var menu = document.querySelector(".phoneVersion")

bars.onclick = function () {
     console.log(123)
     bars.classList.toggle("fa-times")
     menu.classList.toggle("active")
}


</script>

<!-- Swiper JS -->
<script src="https://unpkg.com/swiper/swiper-bundle.js"></script>
<script>
var swiper = new Swiper('.swiper-container', {
     slidesPerView: 3,
     loop: true,
     loopFillGroupWithBlank: true,
     centeredSlides: true,
     pagination: {
          el: '.swiper-pagination',
          clickable: true,
     },

     breakpoints: {
          320: {
               centeredSlides: true,
               slidesPerView: 1,
               spaceBetween: 10,
          },

          576: {
               centeredSlides: false,
               slidesPerView: 2,
               spaceBetween: 0,
          },

          768: {
               slidesPerView: 3,
               spaceBetween: 0,
          }
     }
});

var app;

$(document).ready(function () {
     return app.init();
});

app = {
     text: "小時候一定要讀書",
     index: 0,
     chars: 0,
     speed: 100,
     container: ".ugly_fish_text",
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

