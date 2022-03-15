        
        var swiper = new Swiper('.swiper-container', {
            simulateTouch:false
        });
        
        console.log(swiper);
        
        $('.previous_question span').click(function(){
            swiper.slidePrev(1000, true);
        })

        $('.options').click(function(){
            swiper.slideNext(1000, true);
            $(this).parents().children('.options').removeClass('active')
            $(this).addClass('active')
            let answer = $(this).children('.border_box').children('span').text()
            let name = $(this).parents().attr('data-answer')
            $('.answer'+name).val(answer)
        })

        