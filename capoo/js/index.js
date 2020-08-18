(function () {
    AOS.init();

    $(".active").click(function () {
        $(".hamburger ul").toggle();
    })

    $(".mobile ul li").click(function (){
        $(".hamburger ul").toggle();
    })

    var swiper = new Swiper('.swiper-container', {
        lazy: true,
        loop: true,
        effect: 'cube',
        grabCursor: true,
        cubeEffect: {
            shadow: true,
            slideShadows: true,
            shadowOffset: 20,
            shadowScale: 0.94,
        },
        pagination: {
            el: '.swiper-pagination',
        },
    });
    mySwiper.lazy.load();
})()

