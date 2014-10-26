// to depend on a bower installed component:
// define(['vendor/componentName/file'])

define(['modules/main'], function(Game) {

  if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
    window.addEventListener("load", function() {
      setTimeout(function() {
        window.scrollTo(0, 0);
        document.body.setAttribute("orient", "landscape");
      }, 0);
    });
  }

  Game.run(document.getElementById('canvas'), document.getElementById('canvasContainer'));
});