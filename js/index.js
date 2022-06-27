console.log('start');
var width = window.innerWidth;
var height = window.innerHeight
console.log(height)
offset = 500;

var itemAbout = $('.item-about');
var itemPortfolio = $('.item-portfolio');
var itemResume = $('.item-resume');
var itemSkills = $('.item-skills');

var inItem = "";

itemAbout.on('mouseenter', function() {
  TweenMax.to($('.about-torso'), .2, {
    fill: "#27ae60",
    delay: 0
  });
  TweenMax.to($('.about-head'), .2, {
    fill: "rgb(178, 157, 129)",
    delay: 0
  });
  TweenMax.to($('.about-eye-left'), .2, {
    fill: "#000",
    delay: 0
  });
  TweenMax.to($('.about-eye-right'), .2, {
    fill: "#000",
    delay: 0
  });
  TweenMax.to($('.text-about'), .2, {
    fill: "#27ce60",
    delay: 0
  });
})
itemAbout.on('mouseleave', function() {
  if (inItem != 'about') {
    TweenMax.to($('.about'), .2, {
      fill: "#E64C3C",
      delay: 0
    });
    TweenMax.to($('.text-about'), .2, {
      fill: "#E64C3C",
      delay: 0
    });
  }
})

itemPortfolio.on('mouseenter', function() {
  TweenMax.to($('.portfolio1'), .2, {
    stroke: "rgb(102, 81, 54)",
    delay: 0
  });
  TweenMax.to($('.portfolio0'), .2, {
    fill: "#2980b9",
    delay: 0
  });
  TweenMax.to($('.text-portfolio'), .2, {
    fill: "#29b0f9",
    delay: 0
  });
})
itemPortfolio.on('mouseleave', function() {
  TweenMax.to($('.portfolio0'), .2, {
    fill: "#E64C3C",
    delay: 0
  });
  TweenMax.to($('.portfolio1'), .2, {
    stroke: "#E64C3C",
    delay: 0
  });
  TweenMax.to($('.text-portfolio'), .2, {
    fill: "#E64C3C",
    delay: 0
  });
})

itemSkills.on('mouseenter', function() {
  TweenMax.to($('.skills-screw-shaft'), .2, {
    fill: "#bdc3c7",
    delay: 0
  });
  TweenMax.to($('.skills-screw-handle'), .2, {
    fill: "#8e44ad",
    delay: 0
  });
  TweenMax.to($('.skills-wrench'), .2, {
    fill: "#7f8c8d",
    delay: 0
  });
  TweenMax.to($('.text-skills'), .2, {
    fill: "rgb(120, 100, 0)",
    delay: 0
  });
})
itemSkills.on('mouseleave', function() {
  if (inItem != "skills") {
    TweenMax.to($('.skills'), .2, {
      fill: "#E64C3C",
      delay: 0
    });
    TweenMax.to($('.text-skills'), .2, {
      fill: "rgb(241, 196, 15)",
      delay: 0
    });
  }
})

itemResume.on('mouseenter', function() {
  TweenMax.to($('.resume'), .2, {
    fill: "#ffffff",
    delay: 0
  });
  TweenMax.to($('.text-resume'), .2, {
    fill: "#bcb0b1",
    delay: 0
  });
})

itemResume.on('mouseleave', function() {
  if (inItem != "resume") {
    TweenMax.to($('.resume'), .2, {
      fill: "#E64C3C",
      delay: 0
    });
    TweenMax.to($('.text-resume'), .2, {
      fill: "#E64C3C",
      delay: 0
    });
  }
})

itemSkills.on('click', function() {
  inItem = "skills";
  $('body').css('overflow-y','scroll');
  TweenMax.to($('.skills'), .2, {
      fill: "#E64C3C",
      delay: 3
    });
    TweenMax.to($('.text-skills'), .2, {
      fill: "rgb(241, 196, 15)",
      delay: 3
    });
  
  TweenMax.to('.back', .1, {
              left: "5px",
    delay:2
   });
  TweenMax.to('.text-skills', .1, {
    opacity: 0,
    delay: 0
  });
  TweenMax.to('.wrench', .5, {
    scale: 5,
    x: -185,
    y: 30,
    rotation: -30,
    delay: 0
  });
  /*TweenMax.to('.wrench', .5,{rotation:-60,x:-150,y:75,delay:.5, ease:Power2.easeOut});*/
  TweenMax.to('.flex-hor', .5, {
    rotation: -90,
    delay: .5,
    ease: Power2.easeOut
  });
  TweenMax.to('.flex-hor', .5, {
    x: "-100%",
    delay: 1.2,
    ease: Power2.easeOut
  });
  TweenMax.to('.skills-container', .5, {
    x: "-105%",
    delay: 1.2,
    ease: Power2.easeOut
  });

  /* TweenMax.to('.wrench', 2,{css:{scale:3, rotation:360}, delay:0})*/
  ;
})

itemResume.on('click', function() {
  inItem = "resume";
  //  TweenMax.to('.resume',0.01,{fill:"#ecf0f1"});
  TweenMax.to('.text', .1, {
    opacity: 0,
    delay: 0
  });

  TweenMax.to('.resume', .5, {
    scale: 6,
    x: -215,
    y: -460,
    delay: 0
  });
  TweenMax.to('.wand', .5, {
    x: -205,
    y: offset,
    rotation: -90,
    delay: .6,
    ease: Power2.easeOut
  });
  TweenMax.to('.wand', 1, {
    y: height + offset,
    delay: 1,
    /*ease: Power2.easeInOut*/
  });
  $('.resume-doc').toggleClass("resume-doc-click");
    TweenMax.to('.back', .1, {
              left: "5px",
    delay:2
   });
  // TweenMax.to('.resume-doc',1,{clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', ease: Power2.easeOut});
  ;

  /*TweenMax.to('.wrench', .5,{rotation:-60,x:-150,y:75,delay:.5, ease:Power2.easeOut});*/

  //TweenMax.to('.flex-hor', .5,{y:"-100%",delay:.5, ease:Power2.easeOut});
  /*TweenMax.to('.flex-hor', .5,{x:"-100%",delay:1.2, ease:Power2.easeOut});*/
  /* TweenMax.to('.skills-container', .5,{x:"-105%",delay:1.2, ease:Power2.easeOut});*/
  /* TweenMax.to('.wrench', 2,{css:{scale:3, rotation:360}, delay:0})*/
  ;
})
$('.resume-doc').on('click',function(){
   window.open('DavidBakerResume.pdf','_blank');
})
itemPortfolio.on('click',function(){
  window.open('../portfolio','_blank');
})


itemAbout.on('click', function() {
  console.log(inItem);
  // if already in the item, go back
  if (inItem == "about") {
    TweenMax.to('.flex-hor', .5, {
      x: 0,
      delay: 0,
      ease: Power2.easeOut
    });
    TweenMax.to('.item-about', .5, {
      left: 0,
      x: 0,
      delay: 0,
      ease: Power2.easeOut
    });
     TweenMax.to('.text', .1, {
      opacity: 1,
      delay: 0
    });
            TweenMax.to('.about-container', .5, {
      left: '100%',
      //x: (0.3) * width,
      delay: 0,
      ease: Power2.easeOut
    });
    
    inItem = "";
  } else {
    inItem = "about";
    TweenMax.to('.flex-hor', .5, {
      x: (-0.8 * width),
      delay: 0,
      ease: Power2.easeOut
    });
    TweenMax.to('.item-about', .5, {
      left: 0,
      x: (0.4) * width,
      delay: 0,
      ease: Power2.easeOut
    });
        TweenMax.to('.about-container', .5, {
      left: 0,
      x: (0.3) * width,
      delay: 0,
      ease: Power2.easeOut
    });
    
    //  TweenMax.to('.resume',0.01,{fill:"#ecf0f1"});
    TweenMax.to('.text', .1, {
      opacity: 0,
      delay: 0
    });
  }
  console.log("bottom" + inItem);
})

$('.back').on('click', function() {
  console.log("inItem: " + inItem);
  if (inItem == "skills") {
    inItem = "";
    $('body').css('overflow-y','hidden');
    window.scroll(0,0);

    TweenMax.to('.back', .1, {
    left: "-50px",
    delay: 0
   });
  TweenMax.to('.text-skills', .1, {
    opacity: 1,
    delay: 0
  });
  TweenMax.to('.wrench', .5, {
    scale: 1,
    x: 0,
    y: 0,
    rotation: 0,
    delay: 0
  });

  TweenMax.to('.flex-hor', .5, {
    rotation: 0,
    delay: 0,
    ease: Power2.easeOut
  });
  TweenMax.to('.flex-hor', .5, {
    x: "0%",
    delay: 0,
    ease: Power2.easeOut
  });
  TweenMax.to('.skills-container', .5, {
    x: "105%",
    delay: 0,
    ease: Power2.easeOut
  });
  }
  
  
  if (inItem == "resume") {
     inItem = "";
    TweenMax.to($('.resume'), .2, {
      fill: "#E64C3C",
      delay: 1
    });
    TweenMax.to($('.text-resume'), .2, {
      fill: "#E64C3C",
      delay: 1
    });
  //  TweenMax.to('.resume',0.01,{fill:"#ecf0f1"});
  TweenMax.to('.text', .1, {
    opacity: 1,
    delay: 1.5
  });

  TweenMax.to('.resume', .5, {
    scale: 1,
    x: 0,
    y:  0,
    delay: 0.6
  });
  TweenMax.to('.wand', .5, {
    x: 0,
    y: 0,
    rotation: -90,
    delay: .6,
    ease: Power2.easeOut
  });
  TweenMax.to('.wand', .6, {
    y: 0,
    delay: 0
    /*ease: Power2.easeInOut*/
  });
  $('.resume-doc').toggleClass("resume-doc-click");
    TweenMax.to('.back', .1, {
              left: "-50px",
    delay:0
   });
  }
})

// have eyes follow mouse
$(document).on('mousemove', function(e) {

  var mouse = "'" + e.clientX + " " + e.clientY + "'";
  var mouseX = "'" + e.clientX + "'";

  var eyeX = (e.clientX - width / 2) / 100;
  var eyeY = (e.clientY - height / 2) / 100;
  TweenMax.to($(".about-eye-left"), 0.1, {
    x: eyeX,
    y: eyeY
  })
  TweenMax.to($(".about-eye-right"), 0.1, {
    x: eyeX,
    y: eyeY
  })
})

$(window).on("resize", function() {
  width = window.innerWidth;
  height = window.innerHeight;
//  console.log(height)
})