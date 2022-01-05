// 字幕
$(function () {
  var bLazy = new Blazy({
    breakpoints: [
      {
        width: 600, // max-width
        src: "data-src-small"
      }
    ]
  });
});


$(document).ready(function () {
  // scrollmagic
  var controller = new ScrollMagic.Controller();
  $(".image-wrapper").each(function () {
    var typeIndvScene = new ScrollMagic.Scene({
      triggerElement: this,
      triggerHook: 0.6,

    })
      .setClassToggle(this, "zap")
      .addTo(controller);

  });
  scene = scene.destroy();

});


// 愛心
const el = document.querySelector('.heart');
const heart = $('.heart svg');
let tl = new TimelineMax({ paused: true });
let timeline = new mojs.Timeline();

tl.add(
  TweenMax.to(heart, 0.15, {
    scaleX: .4,
    scaleY: .2,
    ease: Back.easeOut.config(4)
  })
);
tl.add(
  TweenMax.to(heart, 0.25, {
    scaleX: 1,
    scaleY: 1,
    ease: Back.easeOut.config(4)
  })
);

const burst = new mojs.Burst({
  parent: el,
  count: 10,
  radius: { 0: 80 },
  duration: 1500,
  children: {
    radius: { 15: 0 },
    easing: 'cubic.out',
    degreeShift: 'rand(-50,50)',
  }
});

const burst2 = new mojs.Burst({
  parent: el,
  count: 15,
  radius: { 0: 60 },
  children: {
    shape: 'line',
    stroke: 'white',
    fill: 'none',
    scale: 1,
    scaleX: { 1: 0 },
    easing: 'cubic.out',
    duration: 1000,
    degreeShift: 'rand(-50, 50)',
  }
});

const bubbles = new mojs.Burst({
  parent: el,
  radius: 50,
  count: 5,
  timeline: { delay: 200 },
  children: {
    stroke: 'white',
    fill: 'none',
    scale: 1,
    strokeWidth: { 8: 0 },
    radius: { 0: 'rand(6, 10)' },
    degreeShift: 'rand(-50, 50)',
    duration: 400,
    delay: 'rand(0, 250)',
  }
});

const circ_opt = {
  parent: el,
  radius: { 0: 50 },
  duration: 750,
  shape: 'circle',
  fill: 'none',
  stroke: '#FF4136',
  strokeWidth: 1,
  opacity: { 1: 0 }
}

const circ = new mojs.Shape({
  ...circ_opt
});

const circ2 = new mojs.Shape({
  ...circ_opt,
  delay: 100
});

timeline.add(circ, circ2);


// when clicking the button start the timeline/animation:
$(el).on('click', function () {
  if ($(el).hasClass('active')) {
    $(el).toggleClass('active');
    $('#canvas').toggleClass('active');
    $('#pink .text').toggleClass('active');
  } else {
    $(el).toggleClass('active');
    $('#canvas').toggleClass('active');
    $('#pink .text').toggleClass('active');
    tl.restart();
    burst
      .generate()
      .replay();
    burst2
      .generate()
      .replay();
    bubbles
      .generate()
      .replay();
    timeline.replay();
  }
});

// Text Animation

// 粉紅背景
// SVG HEART ANIMATION USING d3 and GSAP
var paper = d3.select("#canvas");
var wsvg = $("#canvas").width();
var hsvg = $("#canvas").height();

var d = Math.ceil((Math.floor(Math.random() * 700) + 100) / 10) * 10;
var count = 0;

function rNumTime() {
  d = Math.ceil((Math.floor(Math.random() * 600) + 100) / 10) * 10;
}

setInterval(function () {
  count++;
  var x = Math.floor(Math.random() * (wsvg - 100)) + 50;
  var y = Math.floor(Math.random() * (hsvg - 100)) + 50;
  var b = paper.append("use").attr("xlink:href", "#heart").attr("id", "h" + count).attr("transform", "translate(" + x + ", " + y + ")");
  setTimeLine();
  rNumTime();
}, d);

function setTimeLine() {
  var s = (Math.random() * (0.7 - 0.2) + 0.5).toFixed(1);
  var heart = $("#h" + count);

  var tl = new TimelineMax({ repeat: 1, yoyo: true });

  tl.from(heart, 0.7, { scale: 0, transformOrigin: "50% 50%" })
    .to(heart, 0.7, { scale: s, transformOrigin: "50% 50%" })
    .to(heart, 0.3, { scale: 1, transformOrigin: "50% 50%", opacity: 0 });
  // Tried an onComplete here but it wasn't working properly, this was just the easier know-how
  setTimeout(function () {
    remove(heart);
  }, 1700);
}

function remove(h) {
  h.remove();
}

$(window).on("resize", function () {
  wsvg = $("#canvas").width();
  hsvg = $("#canvas").height();
});

// # 灰色背景
(function() {

  var Base, Particle, canvas, colors, context, draw, drawables, i, mouseX, mouseY, mouseVX, mouseVY, rand, update, click, min, max, colors, particles;

  min = 1;
  max = 8;
  particles = 200;
  colors = ["64, 32, 0", "250, 64, 0", "64, 0, 0", "200, 200, 200"];

  rand = function(a, b) {
    return Math.random() * (b - a) + a;
  };

  Particle = (function() {
    function Particle() {
      this.reset();
    }

    Particle.prototype.reset = function() {
      this.color = colors[~~(Math.random()*colors.length)];
      this.radius = rand(min, max);
      this.x = rand(0, canvas.width);
      this.y = rand(-20, canvas.height*0.5);
      this.vx = -5 + Math.random()*10;
      this.vy = 0.7 * this.radius;
      this.valpha = rand(0.02, 0.09);
      this.opacity = 0;
      this.life = 0;
      this.onupdate = undefined;
      this.type = "dust";
    };

    Particle.prototype.update = function() {
      this.x = (this.x + this.vx/3);
      this.y = (this.y + this.vy/3);

      if(this.opacity >=1 && this.valpha > 0) this.valpha *=-1;
      this.opacity += this.valpha/3;
      this.life += this.valpha/3;

      if(this.type === "dust")
        this.opacity = Math.min(1, Math.max(0, this.opacity));
      else
        this.opacity = 1;

      if(this.onupdate) this.onupdate();
      if(this.life < 0 || this.radius <= 0 || this.y > canvas.height){
        this.onupdate = undefined;
        this.reset();
      }
    };

    Particle.prototype.draw = function(c) {
      c.strokeStyle = "rgba(" + this.color + ", " + Math.min(this.opacity, 0.85) + ")";
      c.fillStyle = "rgba(" + this.color + ", " + Math.min(this.opacity, 0.65) + ")";
      c.beginPath();
      c.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
      c.fill();
      c.stroke();
    };

    return Particle;

  })();

  mouseVX = mouseVY = mouseX = mouseY = 0;

  canvas = document.getElementById("bg");
  context = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  drawables = (function() {
    var _i, _results;
    _results = [];
    for (i = _i = 1; _i <= particles; i = ++_i) {
      _results.push(new Particle);
    }
    return _results;
  })();

  draw = function() {
    var d, _i, _len;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    context.clearRect(0, 0, canvas.width, canvas.height)

    for (_i = 0, _len = drawables.length; _i < _len; _i++) {
      d = drawables[_i];
      d.draw(context);
    }
  };

  update = function() {
    var d, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = drawables.length; _i < _len; _i++) {
      d = drawables[_i];
      _results.push(d.update());
    }
    return _results;
  };

  document.onmousemove = function(e) {
    mouseVX = mouseX;
    mouseVY = mouseY;
    mouseX = ~~e.pageX;
    mouseY = ~~e.pageY;
    mouseVX = ~~((mouseVX - mouseX)/2);
    mouseVY = ~~((mouseVY - mouseY)/2);

  };

  window.addEventListener('resize', draw, false);
  setInterval(draw, 1000 / 30);
  setInterval(update, 1000 / 60);
}).call(this);