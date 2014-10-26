// to depend on a bower installed component:
// define(['vendor/componentName/file'])

define(['jquery', 'modules/game'], function($, Game) {

  if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
    window.addEventListener("load", function() {
      setTimeout(function() {
        window.scrollTo(0, 0);
        document.body.setAttribute("orient", "landscape");
      }, 0);
    });
  }

  Game.init(document.getElementById('canvas'), document.getElementById('canvasContainer'));
});