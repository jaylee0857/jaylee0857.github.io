$(document).ready(function () {
  $(".inside_border").mouseenter(function () {
    $(this).children("video")[0].play();
  });


  $(".photo_box").mouseenter(function () {
    $(this).children("video")[0].play();

  });
  $(".gif_btn").mouseleave(function () {
    var url = $(this).children(".animation").css("background-image");
    url = url.substring(url.indexOf('url("') + 5, url.indexOf('")'));
    url = 'url("' + url.replace(/\?.*$/, "") + "?x=" + Math.random() + '")';
    $(this).children(".animation").css("background-image", url);
  });
  setTimeout(function () {
    $("html").click();
  }, 300);

});

// $(document).ready(function () {

//     var animations = document.querySelectorAll('.animation');
//     var animate=[];

//     for( var i = 0 ; i < animations.length ; i++ ){
//         let name = animations[i].getAttribute("data-name")
//         let data_path = animations[i].getAttribute("data-path")
//         let loop ;
//         if(data_path == './json/01-Polar_bear/01-Polar_bear.json'){
//             loop = true;
//         }else if(data_path == './json/00-Home/Home.json'){
//             loop = true;
//         }else if(data_path == './json/05-Footer/05-Footer.json'){
//             loop = true;
//         }else{
//             loop = false;
//         }

//         animate[name] = lottie.loadAnimation({
//             container: animations[i], // the dom element that will contain the animation
//             renderer: 'svg',
//             loop: loop,
//             autoplay: loop,
//             path: data_path // the path to the animation json
//         });
//     }

//     // animations.forEach(function(animation,index){
//     //     let name = animation.getAttribute("data-name")
//     //     let data_path = animation.getAttribute("data-path")
//     //     let loop ;
//     //     console.log(data_path);

//     //     if(data_path == './json/01-Polar_bear/01-Polar_bear.json'){
//     //         loop = true;

//     //     }else if(data_path == './json/00-Home/Home.json'){
//     //         loop = true;
//     //     }else if(data_path == './json/05-Footer/05-Footer.json'){
//     //         loop = true;
//     //     }
//     //     else{
//     //         loop = false;
//     //     }
//     //     animate[name] = lottie.loadAnimation({
//     //         container: animation, // the dom element that will contain the animation
//     //         renderer: 'svg',
//     //         loop: loop,
//     //         autoplay: loop,
//     //         path: data_path // the path to the animation json
//     //     });

//     // })

//     $(".test_btn").mouseenter(function(){
//         animate[$(this).children(".animation").attr("data-name")].goToAndPlay(1, true);
//     });
//     $(".test_btn").mouseleave(function(){
//         animate[$(this).children(".animation").attr("data-name")].stop();
//     });
//     $(".billing_service_btn").mouseenter(function(){

//         animate[$(this).children(".animation").attr("data-name")].goToAndPlay(1, true);
//     });
//     $(".billing_service_btn").mouseleave(function(){
//         animate[$(this).children(".animation").attr("data-name")].stop();
//     });
//     $(".analysis_btn").mouseenter(function(){

//         animate[$(this).children(".animation").attr("data-name")].goToAndPlay(1, true);
//     });
//     $(".analysis_btn").mouseleave(function(){
//         animate[$(this).children(".animation").attr("data-name")].stop();
//     });
//     $(".shop a").mouseenter(function(){

//         animate[$(this).children(".photo_box").children(".animation").attr("data-name")].goToAndPlay(1, true);
//     });
//     $(".shop a").mouseleave(function(){
//         animate[$(this).children(".photo_box").children(".animation").attr("data-name")].stop();
//     });
//     $(".service a").mouseenter(function(){

//         animate[$(this).children(".photo_box").children(".animation").attr("data-name")].goToAndPlay(1, true);
//     });
//     $(".service a").mouseleave(function(){
//         animate[$(this).children(".photo_box").children(".animation").attr("data-name")].stop();
//     });
//     $(".manufacture a").mouseenter(function(){

//         animate[$(this).children(".photo_box").children(".animation").attr("data-name")].goToAndPlay(1, true);
//     });
//     $(".manufacture a").mouseleave(function(){
//         animate[$(this).children(".photo_box").children(".animation").attr("data-name")].stop();
//     });
//     $(".treasure_btn_area").mouseenter(function(){

//         animate[$(this).children(".inside_border").children(".animation").attr("data-name")].goToAndPlay(1, true);
//     });
//     $(".treasure_btn_area").mouseleave(function(){

//         animate[$(this).children(".inside_border").children(".animation").attr("data-name")].stop();

//     });

// });
