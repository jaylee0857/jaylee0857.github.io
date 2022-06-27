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

$('.explore').hover(function () {
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

$('.support').hover(function () {
  $('.support-list').addClass('active')
}, function () {
  $('.support-list').removeClass('active')
})

$('.support-list').hover(function () {
  $('.support-list').addClass('active')
}, function () {
  $('.support-list').removeClass('active')
})

//cookie
const closeBtn = document.querySelector('.closeBtn')
const acceptBtn = document.querySelector('.acceptBtn')
const darkScreen = document.querySelector('.darkScreen')
const x = document.cookie.split('; ');

//設置cookie
function doCookieSetup(name, value) {
  var expires = new Date()
  //(有效時間保存 2 天*365 )=> (2 * 24 * 60 * 60 * 1000)*365 = 兩年
  expires.setTime(expires.getTime() + (172800000*365))
  document.cookie = name + "=" + value + ";SameSite=Strict;expires=" + expires.toGMTString()
}

//清除cookie
function delCookie(key) {
  var date = new Date();
  date.setTime(date.getTime() - 1000);
  document.cookie = key + "='';expires=" + date.toGMTString();
}

if(x.includes('AeonFitnessAccpetCookie=1')){
  darkScreen.classList.add('hide')
}

closeBtn.addEventListener('click',()=>{
  //隱藏黑屏
  darkScreen.classList.add('hide')
})
acceptBtn.addEventListener('click',()=>{
  //隱藏黑屏
  darkScreen.classList.add('hide')
  doCookieSetup('AeonFitnessAccpetCookie',1)
})




//漢堡條動畫
$(document).ready(function () {
  $('#nav-icon1').click(function () {
    $('body').toggleClass('overflow_hidden')
    $(this).toggleClass('open');
    $('.mobile-list').toggleClass('mb_active');
  });
});