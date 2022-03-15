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


  var gogo = function zzzz() {
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





  var menuobjA = document.querySelectorAll('.menuobjA')
  var menuobjAH = document.querySelector('.menuobjA')
  var menuobjB = document.querySelectorAll('.menuobjB')
  var menuobjBH = document.querySelector('.menuobjB')
  $('.btnA').click(function () {
    if (menuobjA.length > 5) {
      setTimeout(function () {
        $('.dropdown-menuA').addClass('active');
        $('.dropdown-menuA').css('height', `${menuobjAH.offsetHeight * 5}px`)
      }, 1);
    }
  })
  $('.btnB').click(function () {
    if (menuobjB.length > 5) {
      setTimeout(function () {
        $('.dropdown-menuB').addClass('active');
        $('.dropdown-menuB').css('height', `${menuobjBH.offsetHeight * 5}px`)
      }, 1);

    }
  })

  // 學制 下拉選單
  $('.phoneStyle .dropdown-item').click(function () {
    $('.phoneStyleT').val(this.text)
    setTimeout(i => {
      $('.phoneStyle .nav-link')[0].text = this.text
      // $('form').submit()
    }, 1)
  })

  //時間排序 下拉選單
  $('.menuobjA').click(function () {
    $('.menuobjA').removeClass('active')
    $('.inputText').val(this.text)
    setTimeout(i => {
      this.classList.add('active')
      $('.btnA')[0].text = this.text
      // $('form').submit()
    }, 1)
  })

  $('.menuobjB').click(function () {
    $('.sortlabelbox').html(`
    <div class="sortlabel">${this.innerText}
    <a class="del" href="###">
    </a>
    </div>`)
    addactiv()
    $('.del').click(function () {
      $(this).parent().remove()
      addactiv()
    })
  })

  $('.del').click(function () {
    $(this).parent().remove()
    addactiv()
  })
  function addactiv() {
    if ($('.sortlabel').hasClass('sortlabel')) {
      $('#filterContent').addClass('active')
    } else {
      $('#filterContent').removeClass('active')
    }
  }
  addactiv()



  //假區塊
  $('.filter-slide').html($('.filter-slide').html() + (`
<div class="btnbox"></div>
<div class="btnbox"></div>
<div class="btnbox"></div>
`))


  if ($('.filterBelt').hasClass('filterBelt')) {
    console.log('YES');

  } else {
    console.log('NO');
    $('.filter-slide').addClass('active')
  }
  // swiper

  // var swiper = new Swiper('.swiper-container', {
  //   pagination: {
  //     el: '.swiper-pagination',
  //     clickable: true,
  //     renderBullet: function (index, className) {
  //       return '<span class="' + className + '">' + (index + 1) + '</span>';
  //     },
  //   },
  //   navigation: {
  //     nextEl: '.swiper-button-next,.next',
  //     prevEl: '.swiper-button-prev,.prev',
  //   },
  //   on: {
  //     slideChange: function () {
  //       changeBelt();
  //     },
  //   },
  // });

  // function changeBelt() {

  //   let swiper_pagination_bullet_active = document.querySelector('.swiper-pagination-bullet-active');
  //   let swiper_pagination_bullet = document.querySelectorAll('.swiper-pagination-bullet');

  //   if (swiper_pagination_bullet_active.getAttribute('aria-label') === 'Go to slide 1' || swiper_pagination_bullet_active.getAttribute('aria-label') === 'Go to slide 2' || swiper_pagination_bullet_active.getAttribute('aria-label') === 'Go to slide 3' || swiper_pagination_bullet_active.getAttribute('aria-label') === 'Go to slide 4' || swiper_pagination_bullet_active.getAttribute('aria-label') === 'Go to slide 5') {
  //     console.log('1-5顯示,6-9關閉,..10');
  //     swiper_pagination_bullet[0].style.display = 'inline-block';
  //     swiper_pagination_bullet[1].style.display = 'inline-block';
  //     swiper_pagination_bullet[2].style.display = 'inline-block';
  //     swiper_pagination_bullet[3].style.display = 'inline-block';
  //     swiper_pagination_bullet[4].style.display = 'inline-block';
  //     swiper_pagination_bullet[5].style.display = 'none';
  //     swiper_pagination_bullet[6].style.display = 'none';
  //     swiper_pagination_bullet[7].style.display = 'none';
  //     swiper_pagination_bullet[8].style.display = 'none';
  //     swiper_pagination_bullet[swiper_pagination_bullet.length - 1].setAttribute("style", "margin-right: 0px; margin-left: auto;display: inline-block;");
  //   } else if (swiper_pagination_bullet_active.getAttribute('aria-label') === 'Go to slide 6' || swiper_pagination_bullet_active.getAttribute('aria-label') === 'Go to slide 7' || swiper_pagination_bullet_active.getAttribute('aria-label') === 'Go to slide 8' || swiper_pagination_bullet_active.getAttribute('aria-label') === 'Go to slide 9' || swiper_pagination_bullet_active.getAttribute('aria-label') === 'Go to slide 10') {
  //     console.log('6-10顯示,2-5關閉,...1');
  //     swiper_pagination_bullet[0].style.display = 'inline-block';
  //     swiper_pagination_bullet[1].style.display = 'none';
  //     swiper_pagination_bullet[2].style.display = 'none';
  //     swiper_pagination_bullet[3].style.display = 'none';
  //     swiper_pagination_bullet[4].style.display = 'none';
  //     swiper_pagination_bullet[5].style.display = 'inline-block';
  //     swiper_pagination_bullet[6].style.display = 'inline-block';
  //     swiper_pagination_bullet[7].style.display = 'inline-block';
  //     swiper_pagination_bullet[8].style.display = 'inline-block';
  //     swiper_pagination_bullet[swiper_pagination_bullet.length - 1].setAttribute("style", "margin-right: 0; margin-left: 0;display: inline-block;");
  //   }
  // }

  function modalBackdropMask() {
    let modalBackdrop = document.querySelectorAll('.modal-backdrop')
    let widthWindow = window.innerWidth;


    // if (widthWindow >= 1200) {
    //   modalBackdrop[1].setAttribute("style", "z-index: 1045;");
    // }
    // else if (widthWindow > 576 && widthWindow < 1200) {
    //   modalBackdrop[0].style.zIndex = '900';
    //   modalBackdrop[1].setAttribute("style", "z-index: 1045; height: calc( 100vh - 155px)");
    // } else if (widthWindow < 576) {
    //   modalBackdrop[1].setAttribute("style", "z-index: 1045; height: calc( 100vh - 77px)");
    // }
  }


  document.addEventListener('click', modalBackdropMask);
  document.addEventListener('resize', modalBackdropMask);


  $('.downloadBtnGroup li button').click(function () {
    $('.downloadBtnGroup li button').removeClass('active')
    $(this).addClass('active')
  })

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

  var collapse = document.querySelector('.collapse')
  var btnPrimary = document.querySelector('.btn-primary')

  btnPrimary.addEventListener('click', function () {
    setTimeout(function () {
      if (collapse.classList == 'collapse show') {
        btnPrimary.classList.add('active')
      } else {
        btnPrimary.classList.remove('active')
      }
    }, 370);
  })
 
  //超過字數顯示...
  $(function () {
    var len = 32;
     // 超過32個字以"..."取代

    $(".maskText").each(function (i) {
      $(this).text().trim()
      console.log($(this).text().trim());
      if ($(this).text().length > len) {

        // $(this).attr("title", $(this).text());
        var text = $(this).text().trim().substring(0, len - 1) + "...";
        $(this).text(text);
      }
    });
    
    var len2 = 12; 
    // 超過12個字以"..."取代

    $(".btnMsgArea").each(function (i) {
      $(this).text().trim()
      console.log($(this).text().trim());
      if ($(this).text().length > len2) {

        // $(this).attr("title", $(this).text());
        var text = $(this).text().trim().substring(0, len2 - 1) + "...";
        $(this).text(text);
      }
    });
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
  

function pagenumber() {
  var FPB = document.querySelectorAll(".filter-pagination-bullet")
  var FPBA = document.querySelector('.filter-pagination-bullet.active')
  var FPBB = document.querySelectorAll('.filter-pagination-bullet.activeB')

  
  if (FPB.length>=3) {
    console.log(">3");
    if (FPB.length>7 && window.innerWidth >= 768) {
      console.log('>7');
      if(FPB[0].classList.contains('active')){
        FPBA.nextElementSibling.classList.add('activeB');
        FPBA.nextElementSibling.nextElementSibling.classList.add('activeB');
        FPBA.nextElementSibling.nextElementSibling.nextElementSibling.classList.add('activeB');
        FPBA.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.classList.add('activeB');
        FPBA.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.classList.add('activeB');
        FPBA.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.classList.add('activeB');
        
      }else if(FPB[1].classList.contains('active')){
        FPBA.previousElementSibling.classList.add('activeB');
        FPBA.nextElementSibling.classList.add('activeB');
        FPBA.nextElementSibling.nextElementSibling.classList.add('activeB');
        FPBA.nextElementSibling.nextElementSibling.nextElementSibling.classList.add('activeB');
        FPBA.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.classList.add('activeB');
        FPBA.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.classList.add('activeB');
      }else if(FPB[2].classList.contains('active')){
        FPBA.previousElementSibling.previousElementSibling.classList.add('activeB');
        FPBA.previousElementSibling.classList.add('activeB');
        FPBA.nextElementSibling.classList.add('activeB');
        FPBA.nextElementSibling.nextElementSibling.classList.add('activeB');
        FPBA.nextElementSibling.nextElementSibling.nextElementSibling.classList.add('activeB');
        FPBA.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.classList.add('activeB');
      }else if(FPB[FPB.length-3].classList.contains('active')){
        FPBA.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.classList.add('activeB');
        FPBA.previousElementSibling.previousElementSibling.previousElementSibling.classList.add('activeB');
        FPBA.previousElementSibling.previousElementSibling.classList.add('activeB');
        FPBA.previousElementSibling.classList.add('activeB');
        FPBA.nextElementSibling.classList.add('activeB');
        FPBA.nextElementSibling.nextElementSibling.classList.add('activeB');
      }
      else if(FPB[FPB.length-2].classList.contains('active')){
        FPBA.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.classList.add('activeB');
        FPBA.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.classList.add('activeB');
        FPBA.previousElementSibling.previousElementSibling.previousElementSibling.classList.add('activeB');
        FPBA.previousElementSibling.previousElementSibling.classList.add('activeB');
        FPBA.previousElementSibling.classList.add('activeB');
        FPBA.nextElementSibling.classList.add('activeB');
      }
      else if(FPB[FPB.length-1].classList.contains('active')){
        FPBA.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.classList.add('activeB');
        FPBA.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.classList.add('activeB');
        FPBA.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.classList.add('activeB');
        FPBA.previousElementSibling.previousElementSibling.previousElementSibling.classList.add('activeB');
        FPBA.previousElementSibling.previousElementSibling.classList.add('activeB');
        FPBA.previousElementSibling.classList.add('activeB');
      }else{
        FPBA.previousElementSibling.previousElementSibling.previousElementSibling.classList.add('activeB');
        FPBA.previousElementSibling.previousElementSibling.classList.add('activeB');
        FPBA.previousElementSibling.classList.add('activeB');
        FPBA.nextElementSibling.classList.add('activeB');
        FPBA.nextElementSibling.nextElementSibling.classList.add('activeB');
        FPBA.nextElementSibling.nextElementSibling.nextElementSibling.classList.add('activeB');
     
      }
      
    }else if (window.innerWidth < 768){
      console.log('<768');
      FPB.forEach(i => {
        i.classList.remove('activeB')
      });
      
      if(FPB[0].classList.contains('active')){
        FPBA.nextElementSibling.classList.add('activeB');
        FPBA.nextElementSibling.nextElementSibling.classList.add('activeB');
      }else if(FPB[FPB.length-1].classList.contains('active')){
        FPBA.previousElementSibling.previousElementSibling.classList.add('activeB');
        FPBA.previousElementSibling.classList.add('activeB');
      }else{
        FPBA.previousElementSibling.classList.add('activeB');
        FPBA.nextElementSibling.classList.add('activeB');
      }
    }
    else{
      console.log(window.innerWidth);
      console.log('>8>3');
      FPB.forEach(i => {
        i.classList.add('activeB')
      });
    }

  }
}

pagenumber()

$(window).resize(function() {
  pagenumber()
  btnPrimary.classList.remove('active')
  collapse.classList.remove('show')
});


})()
