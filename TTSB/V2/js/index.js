var bannerswiper = new Swiper('#banner', {
    loop: true,
    pagination: {
        el: '.swiper-pagination',
    },
    navigation: {
        nextEl: '.wrapper .button-next',
        prevEl: '.wrapper .button-prev',
    },
});

var swiper = new Swiper("#swiper-block", {

    slidesPerView: 1,
    spaceBetween: 30,
    coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: false
    },
    breakpoints: {
        576: {
            slidesPerView: 2,
            spaceBetween: 30,

        },
        768: {
            slidesPerView: 'auto',
            spaceBetween: 30,

        },
        1200: {
            slidesPerView: 4,
            spaceBetween: 20,
        },
    }

},
    $('.swiper-Area .swiper-button-next-custom').click(function () {
        swiper.slideNext();
    }),
    $('.swiper-Area .swiper-button-prev-custom').click(function () {
        swiper.slidePrev();
    })
);