$(function() {
    var bLazy = new Blazy({
      breakpoints: [
        {
          width: 600, // max-width
          src: "data-src-small"
        }
      ]
    });
  });
  
  
  $(document).ready(function() {
    // scrollmagic
    var controller = new ScrollMagic.Controller();
    $(".image-wrapper").each(function() {
      var typeIndvScene = new ScrollMagic.Scene({
        triggerElement: this,
        triggerHook: 0.6,
        
      })
        .setClassToggle(this, "zap")
        .addTo(controller);
        
    });
    scene = scene.destroy();
    
  });