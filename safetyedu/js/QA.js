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
  

  function modalBackdropMask() {
    let modalBackdrop = document.querySelectorAll('.modal-backdrop')
    let widthWindow = window.innerWidth;


    if(widthWindow >= 1200){
      modalBackdrop[1].setAttribute("style", "z-index: 1045;");
    }
    else if(widthWindow > 576 && widthWindow < 1200) {
      modalBackdrop[0].style.zIndex = '900';
      modalBackdrop[1].setAttribute("style", "z-index: 1045; height: calc( 100vh - 155px)");
    }else if(widthWindow < 576){
      modalBackdrop[1].setAttribute("style", "z-index: 1045; height: calc( 100vh - 77px)");
    }
  }


  document.addEventListener('click', modalBackdropMask);
  document.addEventListener('resize', modalBackdropMask);

  	
  $('.downloadBtnGroup li button').click(function(){
    $('.downloadBtnGroup li button').removeClass('active')
    $(this).addClass('active')
  })

  $('.modal-backdrop.fade.show').click(function(){
    console.log('123');
    $('.downloadBtnGroup li button').removeClass('active')
  })

  $('#downloadModal .modal').click(function(){
      if($('.downloadBtnGroup li button').has('.active')){
        $('.downloadBtnGroup li button').removeClass('active')
      }
  })
  

  // 中低高年級框點擊加陰影
 
})()