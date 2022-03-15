; (function () {
  // 背景小icon動畫

  var boxI = document.querySelectorAll('.boxI')
  var leftN = Math.floor(Math.random() * 100);
  var boxN = Math.floor(Math.random() * boxI.length);

  boxI[boxN].classList.add('show');
  boxI[boxN].style['left'] = `${leftN}%`;
  setTimeout(function () {
    boxI[boxN].classList.remove('show')
  }, 20000)


  var gogo = function zzzz () {
    var leftN = Math.floor(Math.random() * 100);
    var boxN = Math.floor(Math.random() * boxI.length);
    if (boxI[boxN].classList.contains('show') == true) {
      zzzz()
    } else {
      boxI[boxN].classList.add('show')
      boxI[boxN].style['left'] = `${leftN}%`;
      setTimeout(function () {
        boxI[boxN].classList.remove('show')
      }, 20000)
    }


  }
  $(window).resize(function () {
    if ($(window).width() < 1366) {
      boxI.forEach(i => {
        i.classList.remove('show')
      });
    }
  })
  setInterval(gogo, "2000")


//假區塊
$('.filter-slide').html($('.filter-slide').html()+(`
<div class="btnbox"></div>
<div class="btnbox"></div>
<div class="btnbox"></div>
`))


if($('.filterBelt').hasClass('filterBelt')){
  console.log('YES');
  
}else{
  console.log('NO');
  $('.filter-slide').addClass('active')
}


  var swiper2 = new Swiper('#banner-swiper-container .swiper-container', {
    navigation: {
      nextEl: '.banner_next',
      prevEl: '.banner_prev',
    },
    pagination: {
      el: '.swiper-pagination',
    },
    autoplay: {
      delay: 5000,
    },
    speed: 1000,
    loop: true,
  });


  function modalBackdropMask() {
    let modalBackdrop = document.querySelectorAll('.modal-backdrop')
    console.log(modalBackdrop[1]);
    let widthWindow = window.innerWidth;


    if (widthWindow >= 1200) {
      modalBackdrop[1].setAttribute("style", "z-index: 1045;");
    }
    else if (widthWindow > 576 && widthWindow < 1200) {
      modalBackdrop[0].style.zIndex = '900';
      modalBackdrop[1].setAttribute("style", "z-index: 1045; height: calc( 100vh - 155px)");
    } else if (widthWindow < 576) {
      modalBackdrop[1].setAttribute("style", "z-index: 1045; height: calc( 100vh - 77px)");
    }
  }


  document.addEventListener('click', modalBackdropMask);
  document.addEventListener('resize', modalBackdropMask);



  $('.modal-backdrop.fade.show').click(function () {
    console.log('123');
    $('.downloadBtnGroup li button').removeClass('active')
  })

  $('#downloadModal .modal').click(function () {
    if ($('.downloadBtnGroup li button').has('.active')) {
      $('.downloadBtnGroup li button').removeClass('active')
    }
  })

  // 中低高年級框點擊加陰影
  $('.filterWrapper ul li').click(function () {
    $('.filterWrapper ul li').removeClass('active')
    $(this).addClass('active')
  });
  // $(document).ready(function () {
  //   changeBelt();
  // });

 //超過字數顯示...
 $(function () {

  var len3 = 40; 
  // 超過40個字以"..."取代
  
  
  $(".leftText").children().each(function (i) {
    $(this).text().trim()
    console.log($(this).text().trim());
    if ($(this).text().length > len3) {
     
      
      // $(this).attr("title", $(this).text());
      var text = $(this).text().trim().substring(0, len3 - 1) + "...";
      $(this).text(text);
    }
  });
  
});



})()