; (function () {


  var c = 0;
      if (c==0) {
          c = 1;
          swiperfun() 
      }
  

  function swiperfun() {
    var swiper = new Swiper('.swiper-container', {
      slidesPerView: 4,
      spaceBetween: 5,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        1200: {
          slidesPerView: 3,
        },        
        960: {
          slidesPerView: 2,
        },
        767: {
          slidesPerView: 1,
        },
      }
    });
  }
 

  window.onresize = function () {
    setTimeout(() => {
      swiperfun() 
    }, 500)
  }

  // 開啟其他按鈕開關
  X = false;
  Y = false;
  $('.btncover').click(function () {
      $('.downloadbox').removeClass('active');
      $('.btncover').removeClass('active')
      $('.sharebox').removeClass('active');
      $('.download ').removeClass('active');
      $('.share').removeClass('active');
      X = false;
      Y = false;
  })




  $('.download').click(function () {
      if (X == false) {
          X = true;
          Y = false;
          $('.sharebox').removeClass('active');
          $('.downloadbox').addClass('active');
          $('.btncover').addClass('active');
          $('.download ').addClass('active');
          $('.share').removeClass('active');
      } else {
          X = false;
          Y = false;
          $('.sharebox').removeClass('active');
          $('.downloadbox').removeClass('active');
          $('.btncover').removeClass('active');
          $('.download ').removeClass('active');
          $('.share').removeClass('active');
      }
  })

  $('.share').click(function () {
      if (Y == false) {
          Y = true;
          X = false;
          $('.downloadbox').removeClass('active');
          $('.sharebox').addClass('active');
          $('.btncover').addClass('active');
          $('.share').addClass('active');
          $('.download ').removeClass('active');
      } else {
          Y = false;
          X = false;
          $('.downloadbox').removeClass('active');
          $('.sharebox').removeClass('active');
          $('.btncover').removeClass('active');
          $('.share').removeClass('active');
          $('.download ').removeClass('active');
      }
  })




  $(function () {

    var len2 = 12;
    // 超過12個字以"..."取代

    $(".cavertext").each(function (i) {
      $(this).text().trim()
      console.log($(this).text().trim());
      if ($(this).text().length > len2) {

        // $(this).attr("title", $(this).text());
        var text = $(this).text().trim().substring(0, len2 - 1) + "...";
        $(this).text(text);
      }
    });
  });


})()

