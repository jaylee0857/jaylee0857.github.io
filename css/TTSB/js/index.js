"use strict";

if ($("#banner .swiper-slide").length == 1) {
	$('#banner .swiper-wrapper').addClass("disabled");
	$('#banner .swiper-pagination').addClass("disabled");
	$('#banner .banner-button-next').addClass("disabled");
	$('#banner .banner-button-prev').addClass("disabled");
}

// banner swiper
var banner_swiper = new Swiper('#banner', {
	navigation: {
		nextEl: '#banner .banner-button-next',
		prevEl: '#banner .banner-button-prev'
	},
	pagination: {
		el: '#banner .swiper-pagination'
	}
});

var banner_swiper = new Swiper('#mb_banner', {
	navigation: {
		nextEl: '#mb_banner .banner-button-next',
		prevEl: '#mb_banner .banner-button-prev'
	},
	pagination: {
		el: '#mb_banner .swiper-pagination'
	}
});


$(window).resize(function () {
	var window_width = $(window).width();

	if (window_width <= 768) {
		if (safety_swiper) {
			safety_swiper.destroy();
			safety_swiper = undefined;
		}
	} else {
		if (safety_swiper) {
			return;
		} else {
			// 國際運安swiper
			var safety_swiper = new Swiper('#safety', {
				slidesPerView: 4,
				slidesPerColumn: 2,
				spaceBetween: 20,
				navigation: {
					nextEl: '.country .button-next',
					prevEl: '.country .button-prev'
				}
			});
		}
	}
});
var window_width = $(window).width();

if (window_width > 768) {
	// 國際運安swiper
	var safety_swiper = new Swiper('#safety', {
		slidesPerView: 4,
		slidesPerColumn: 2,
		spaceBetween: 15,
		navigation: {
			nextEl: '.country .button-next',
			prevEl: '.country .button-prev',
		},
		breakpoints: {

			// when window width is <= 480px
			480: {
				slidesPerView: 1,
				spaceBetween: 15
			},
			// when window width is <= 640px
			640: {
				slidesPerView: 3,
				spaceBetween: 20
			}
		}
	});
} // 底部logo


var swiper = new Swiper('#logo', {
	slidesPerView: 4,
	slidesPerColumn: 1,
	spaceBetween: 20,
	navigation: {
		nextEl: '.logos .logo-button-next',
		prevEl: '.logos .logo-button-prev'
	},
	breakpoints: {
		// when window width is <= 480px
		480: {
			slidesPerView: 1,
			spaceBetween: 15
		},
		// when window width is <= 640px
		640: {
			slidesPerView: 3,
			spaceBetween: 20
		}
	}
}); // navbar按鈕效果

var buttons = document.getElementById('navCard');
var banner = document.getElementById('banner-content').offsetHeight;
var bannerBottom = banner - buttons.offsetHeight - 46;

init_navbar(window_width);

window.onscroll = function () {
	var window_width = $(window).outerWidth();
	init_navbar(window_width);
};

$(window).resize(function () {
	var window_width = $(window).outerWidth();
	init_navbar(window_width);
});

function init_navbar(window_width) {
	if (window_width > 1200) {
		if (document.body.scrollTop > bannerBottom || document.documentElement.scrollTop > bannerBottom) {
			$('#navButton').addClass('dispersion');
			$('#index_navbar').addClass('bg');
			$('#main-nav').show();
			$('#sub-nav').hide();
			$('#index_navbar .logo').addClass('small');
			$('#navbar-collapse').addClass('fixed_top');
			$('#navButton').addClass('small');
		} else {
			$('#navButton').removeClass('dispersion');
			$('#index_navbar').removeClass('bg');
			$('#main-nav').hide();
			$('#sub-nav').show();
			$('#index_navbar .logo').removeClass('small');
			$('#navbar-collapse').removeClass('fixed_top');
			$('#navButton').removeClass('small');
		}
	} else if (window_width < 1201) {
		if (document.body.scrollTop > bannerBottom - 15 || document.documentElement.scrollTop > bannerBottom - 15) {
			$('#navButton').addClass('dispersion');

			$('#main-nav').hide();
			$('#sub-nav').hide();
			$('#navbar-collapse').removeClass('fixed_top');
		} else {
			$('#navButton').removeClass('dispersion');

			$('#main-nav').hide();
			$('#sub-nav').hide();
			$('#navbar-collapse').removeClass('fixed_top');
		}
	}
}


var len = 50; // 超過50個字以"..."取代

var string = document.getElementById('info').innerHTML;

if (string.length > len) {
	var text = string.substring(0, len - 1) + "...";
	document.getElementById('info').innerHTML = text;
}


// related-data
$('.related-data .icons a:first-child').addClass("active");

$('.related-data .icons a').on('click', function (e) {
	e.preventDefault()
	var a_href = $(this).attr('href');
	$('.related-data .icons a').removeClass("active");
	$('.related-data .tab-content .tab-pane').removeClass('active');
	$(a_href).addClass('active');
	$(this).addClass('active');

	$('.data-number').each(function () {
		$(this).html(0);
		var $this = $(this),
			countTo = $this.attr('data-number');
		$({ countNum: $this.text() }).animate({
			countNum: countTo
		}, {
			duration: 500,
			easing: 'linear',
			step: function () {
				$this.text(Math.floor(this.countNum));
			},
			complete: function () {
				$this.text(this.countNum);
			}
		});
	});
})

//手機板搜尋列

function dropSearch() {
	document.getElementById('mb_search').style.display = "block";
	document.getElementById('mb_close').style.display = "block";
	document.getElementById('mb_open').style.display = "none";
}

function CollapseSearch() {
	document.getElementById('mb_search').style.display = "none";
	document.getElementById('mb_close').style.display = "none";
	document.getElementById('mb_open').style.display = "block";
}


//2020-01-18-tab修改
//控制tab鍵移動
var shift_key_down = false;

$('body').keydown(function (shift) {
	if (shift.keyCode == 16) {
		shift_key_down = true

		$('.hiddens').css('display', 'none')
	}
})

$('body').keyup(function (shift) {
	if (shift.keyCode == 16) {
		shift_key_down = false

		$('.hiddens').css('display', 'block')
	}
})


	//新聞紀要最後一欄按下tab時 轉跳到調查中事故
	$('.tab-content-btn').keydown(function (event) {
		if (event.keyCode == 9) {
			$('.hidden1').focus();

			//標題顯示class移除
			$('#pills-home-tab').removeClass('active');
			$('#pills-home-tab').attr('aria-selected','false');
			

			//內容顯示class移除
			$('#pills-home').removeClass('show');
			$('#pills-home').removeClass('active');

			//下個標題加入顯示class
			$('#pills-profile-tab').addClass('active');
			$('#pills-profile-tab').attr('aria-selected','true');
			

			//下個內容加入顯示class
			$('#pills-profile').addClass('show');
			$('#pills-profile').addClass('active');
			
		}
	});

	//調查中事故最後一欄按下tab時 轉跳到已結案事故
	$('.profile-btn').keydown(function (event) {
		if (event.keyCode == 9) {
			$('.hidden2').focus()

				//標題顯示class移除
				$('#pills-profile-tab').removeClass('active');
				$('#pills-profile-tab').attr('aria-selected','false');
				
	
				//內容顯示class移除
				$('#pills-profile').removeClass('show');
				$('#pills-profile').removeClass('active');
	
				//下個標題加入顯示class
				$('#pills-contact-tab').addClass('active');
				$('#pills-contact-tab').attr('aria-selected','true');
				
	
				//下個內容加入顯示class
				$('#pills-contact').addClass('show');
				$('#pills-contact').addClass('active');
		}
	});

	//已結案事故最後一欄按下tab時 跳至更多內容
	$('.contact-btn').keydown(function (event) {
		if (event.keyCode == 9) {
			$('.hidden5').focus()
		}
	});

	//新聞紀要標題按下tab時 判斷是否有active來決定往內容轉跳 或 往調查中事故標題轉跳
	$('#pills-home-tab').keydown(function (event) {
		if(shift_key_down == false) {
			if (event.keyCode == 9) {
				if ($('#pills-home-tab').hasClass('active')) {
					$('.hidden3').focus()
				}
				else {
					$('.hidden1').focus()
				}
			}
		}
	})
	//調查中事故標題按下tab時 判斷是否有active來決定往內容轉跳 或 往已結案事故標題轉跳
	$('#pills-profile-tab').keydown(function (event) {
		if(shift_key_down == false) {
			if (event.keyCode == 9) {
				if ($('#pills-profile-tab').hasClass('active')) {
					$('.hidden4').focus()
				}
				else {
					$('.hidden2').focus()
				}
			}
		}else {
			//標題顯示class移除
			$('#pills-profile-tab').removeClass('active');
			$('#pills-profile-tab').attr('aria-selected','false');
			

			//內容顯示class移除
			$('#pills-profile').removeClass('show');
			$('#pills-profile').removeClass('active');

			//下個標題加入顯示class
			$('#pills-home-tab').addClass('active');
			$('#pills-home-tab').attr('aria-selected','true');
			

			//下個內容加入顯示class
			$('#pills-home').addClass('show');
			$('#pills-home').addClass('active');
		}

	});

	//已結案事故標題按下tab時 判斷是否有active來決定往內容轉跳 或 更多內容轉跳
	$('#pills-contact-tab').keydown(function (event) {
		if(shift_key_down == false) {
			if (event.keyCode == 9) {
				if ($('#pills-contact-tab').hasClass('active')) {
					$('.hidden4').focus()
				}
				else {
					$('.contact-btn').focus()
				}
			}
		}else {

			$('#pills-contact-tab').removeClass('active');
			$('#pills-contact-tab').attr('aria-selected','true');
			

			$('#pills-contact').removeClass('show');
			$('#pills-contact').removeClass('active');

			//下個標題加入顯示class
			$('#pills-profile-tab').addClass('active');
			$('#pills-profile-tab').attr('aria-selected','true');
			

			//下個內容加入顯示class
			$('#pills-profile').addClass('show');
			$('#pills-profile').addClass('active');
		}
	});
//2020-01-18-tab修改






