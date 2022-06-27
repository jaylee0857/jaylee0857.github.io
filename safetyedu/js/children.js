; (function () {
    // Init




    var plugins = {
        customCarousel: document.querySelector('.circle-carousel')
    }
    document.addEventListener('DOMContentLoaded', function () {
        var carousel = initCarousel({
            node: plugins.customCarousel,
            speed: 10000,
            autoplay: 10000
        });

    });
    function initCarousel(options) {
        function CustomCarousel(options) {
            this.init(options);
            this.addListeners();
            return this;

        }

        CustomCarousel.prototype.init = function (options) {
            this.node = options.node; //circle-carousel (圓圈外層)
            this.node.slider = this;
            this.slides = this.node.querySelector('.slides').children;
            this.slidesN = this.slides.length;
            this.pagination = this.node.querySelector('.pagination');
            this.pagTransf = 'translate( -50%, 0% )';
            this.dots = this.pagination.children;
            this.dotsN = this.dots.length;
            this.step = -360 / this.dotsN;
            this.angle = 0;
            this.next = this.node.querySelector('.next');
            this.prev = this.node.querySelector('.prev');
            this.activeN = options.activeN || 0;
            this.prevN = this.activeN;
            this.speed = options.speed || 300;
            this.autoplay = options.autoplay || false;
            this.autoplayId = null;
            this.setSlide(this.activeN);
            this.arrangeDots();
            this.pagination.style.transitionDuration = this.speed + 'ms';
            this.pagination.style.transitionTimingFunction = 'linear';
            if (this.autoplay) this.startAutoplay();
            setInterval(function () {
                var pagination = document.querySelector('.pagination')
                pagination.classList.remove('active')
            }, 10000);
        }





        CustomCarousel.prototype.addListeners = function () {
            var slider = this;

            if (this.next) {
                this.next.addEventListener('click', function () {
                    this.node = options.node;
                    this.pagination = this.node.querySelector('.pagination');
                    this.autoplay = 1000;
                    this.pagination.style.transitionDuration = '1000ms';
                    slider.setSlide(slider.activeN + 1, "1000ms");
                    setTimeout(() => {
                        this.autoplay = options.autoplay;
                        this.pagination.style.transitionDuration = options.speed + 'ms';

                    }, 20);
                });
            }

            if (this.prev) {
                this.prev.addEventListener('click', function () {
                    this.node = options.node;
                    this.pagination = this.node.querySelector('.pagination');
                    this.autoplay = 1000;
                    this.pagination.style.transitionDuration = '1000ms';
                    slider.setSlide(slider.activeN - 1, "1000ms");
                    setTimeout(() => {
                        this.autoplay = options.autoplay;
                        this.pagination.style.transitionDuration = options.speed + 'ms';
                    }, 20);
                });
            }
            for (var i = 0; i < this.dots.length; i++) {
                this.slides[i].addEventListener('click', function (i) {
                    return function () {
                        this.node = options.node;
                        this.pagination = this.node.querySelector('.pagination');
                        this.autoplay = 1000;
                        this.pagination.style.transitionDuration = '1000ms';
                        slider.setSlide(i, "1000ms");
                        setTimeout(() => {
                            this.autoplay = options.autoplay;
                            this.pagination.style.transitionDuration = options.speed + 'ms';
                        }, 20);
                    }
                }(i));
            }




            window.onresize = function () {
                setTimeout(() => {
                    this.node = options.node;
                    this.pagination = this.node.querySelector('.pagination');
                    this.autoplay = 0;
                    this.pagination.style.transitionDuration = '0ms';
                    slider.setSlide(slider.activeN - 0, "0ms");
                    setTimeout(() => {
                        this.autoplay = options.autoplay;
                        this.pagination.style.transitionDuration = options.speed + 'ms';
                    }, -100);
                }, 1)
            }

            document.addEventListener('visibilitychange', function () {
                if (document.visibilityState == 'hidden') {//切离该页面时执行
                    slider.stopAutoplay();
                    console.log('OK');
                } else if (document.visibilityState == 'visible') {//切换到该页面时执行
                    slider.startAutoplay();
                    console.log('NO');
                }
            })


            if (this.autoplay) {
                this.node.addEventListener('mouseenter', function () {
                    slider.stopAutoplay();
                });

                this.node.addEventListener('mouseleave', function () {
                    if (bodyclass.classList == 'modal-open') {
                        slider.stopAutoplay();
                    } else {
                        slider.startAutoplay();
                    }
                });
            }


            var bodyclass = document.querySelector('body');

            $('.btn-primary').click(function () {
                setTimeout(() => {
                    if (bodyclass.classList == 'modal-open') {
                        slider.stopAutoplay();
                    } else {
                        slider.startAutoplay();
                    }
                }, 20)

            });


        };

        CustomCarousel.prototype.setSlide = function (slideN, dot_speed) {
            this.slides[this.activeN].classList.remove('active');
            if (this.dots[this.activeN]) this.dots[this.activeN].classList.remove('active');

            this.prevN = this.activeN;
            this.activeN = slideN;
            if (this.activeN < 0) this.activeN = this.slidesN - 1;
            else if (this.activeN >= this.slidesN) this.activeN = 0;

            this.slides[this.activeN].classList.toggle('active');
            if (this.dots[this.activeN]) this.dots[this.activeN].classList.toggle('active');
            this.rotate(dot_speed);
        };

        CustomCarousel.prototype.rotate = function (dot_speed) {

            if (this.activeN < this.dotsN) {
                this.angle += function (dots, next, prev, step) {
                    var inc, half = dots / 2;
                    if (prev > dots) prev = dots - 1;
                    if (Math.abs(inc = next - prev) <= half) return step * inc;
                    if (Math.abs(inc = next - prev + dots) <= half) return step * inc;
                    if (Math.abs(inc = next - prev - dots) <= half) return step * inc;
                }(this.dotsN, this.activeN, this.prevN, this.step)


                this.pagination.style.transform = this.pagTransf + 'rotate(' + this.angle + 'deg)';



                for (var i = 0; i < this.dotsN; i++) {
                    this.dots[i].childNodes[1].style.transitionDuration = dot_speed ? dot_speed : '10000ms';//圈圈
                    this.dots[i].childNodes[1].style.transitionTimingFunction = 'linear';
                    this.dots[i].childNodes[1].style.transform = 'rotate(' + (-this.angle + -10 * this.dotsN * (i)) + 'deg)';
                }
                var slide = document.querySelectorAll('.slide')
                var slideACT = document.querySelector('.slide.active')


                slide.forEach(i => {

                    i.classList.remove('activeB');
                    if (i = slideACT) {
                        var activeR = slide[$.inArray(slideACT, slide) + 1];
                        var activeS = slide[0];
                        var activeM = slide[5];

                        if ($.inArray(slideACT, slide) - 1 < 0) {
                            activeR.classList.add('activeB');
                            activeM.classList.add('activeB');
                        } else
                            if ($.inArray(slideACT, slide) + 1 > 5) {
                                var activeL = slide[$.inArray(slideACT, slide) - 1];
                                activeL.classList.add('activeB');
                                activeS.classList.add('activeB');
                            } else {
                                var activeL = slide[$.inArray(slideACT, slide) - 1];
                                activeR.classList.add('activeB');
                                activeL.classList.add('activeB');
                            }
                    }
                });
            }


        };

        CustomCarousel.prototype.startAutoplay = function () {
            var slider = this;
            var FerrW = document.querySelector('.FerrisWheel')
            if (FerrW.classList == "FerrisWheel") {
                
                setTimeout(() => {
                    FerrW.classList.add("active");
                    slider.setSlide(slider.activeN + 1);
                }, 2000)
            }

            this.autoplayId = setInterval(function () {
                slider.setSlide(slider.activeN + 1);
            }, this.autoplay);
        };

        CustomCarousel.prototype.stopAutoplay = function () {
            clearInterval(this.autoplayId);
            var FerrW = document.querySelector('.FerrisWheel')
        };

        CustomCarousel.prototype.arrangeDots = function () {
            for (var i = 0; i < this.dotsN; i++) {
                this.dots[i].style.transform = 'rotate(' + 360 / this.dotsN * i + 'deg)';
                this.dots[i].childNodes[1].style.transform = 'rotate(' + -10 * this.dotsN * i + 'deg)';
            }

        };

        return new CustomCarousel(options);



    }










  



})()

