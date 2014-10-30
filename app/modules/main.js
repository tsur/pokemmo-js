define(['jquery', 'config/init', './connection'], function($, settings, Connection, Game, GameState, Map, Chat, TitleScreen, UI, Renderer, EReg) {

  // Class main
  var Main = function() {};

  Main.__name__ = ["pokemmo", "Main"];
  Main.isPhone = null;
  Main.screenWidth = null;
  Main.screenHeight = null;
  Main.onScreenCanvas = null;
  Main.onScreenCtx = null;
  Main.tmpCanvas = null;
  Main.tmpCtx = null;
  Main.mapCacheCanvas = null;
  Main.mapCacheCtx = null;
  Main.canvas = null;
  Main.ctx = null;
  Main.container = null;

  Main.init = function() {

    Main.isPhone = new EReg("(iPhone|iPod)", "i").match(window.navigator.userAgent);
    Main.screenWidth = Main.isPhone ? 480 : 800;
    Main.screenHeight = Main.isPhone ? 320 : 600;
  };

  Main.tick = function() {
    UI.tick();
    if (Game.state === GameState.ST_MAP) {
      if (Game.curmain != null) {
        Game.curmain.tick();
      }
    }
    Renderer.render();
  };

  Main.run = function(canvas_, container_) {

    Main.init();

    Main.container = container_;

    Main.onScreenCanvas = canvas_;
    Main.onScreenCtx = Main.onScreenCanvas.getContext("2d");

    Main.canvas = document.createElement("canvas");
    Main.ctx = Main.canvas.getContext("2d");

    Main.tmpCanvas = document.createElement("canvas");
    Main.tmpCtx = Main.tmpCanvas.getContext("2d");

    Main.mapCacheCanvas = document.createElement("canvas");
    Main.mapCacheCtx = Main.mapCacheCanvas.getContext("2d");

    $(window).mousemove(function(e) {
      var offset = $(Main.onScreenCanvas).offset();
      UI.mouseX = e.pageX - offset.left;
      UI.mouseY = e.pageY - offset.top;
    });

    $(window).resize(function() {

      if (Main.isPhone) {

        Main.canvas.width = $(window).width();
        Main.canvas.height = $(window).height();

      } else {

        Main.canvas.width = 800;
        Main.canvas.height = 600;
        Main.container.style.top = "50%";
        Main.container.style.left = "50%";
        Main.container.style.position = "fixed";
        Main.container.style.marginTop = "-300px";
        Main.container.style.marginLeft = "-400px";
      }

      Main.container.width = Main.mapCacheCanvas.width = Main.tmpCanvas.width = Main.onScreenCanvas.width = Main.canvas.width;

      Main.container.height = Main.mapCacheCanvas.height = Main.tmpCanvas.height = Main.onScreenCanvas.height = Main.canvas.height;

      if (Game.curmain != null && Map.getCurMap() != null) {
        Map.getCurMap().cacheMap = null;
      }

      Renderer.render();

    }).resize();

    $(window).bind("orientationchange", function() {
      window.scrollTo(0, 0);
    });

    UI.setup();
    Game.setup();
    Connection.setup();
    Renderer.setup();
    Chat.setup();
    TitleScreen.setup();
    TitleScreen.init();

    Game.state = GameState.ST_TITLE;

    setInterval(Main.tick, 1000 / 30);
  };

  Main.printDebug = function() {
    var w = window.open("", "Debug Info");
    w.document.body.innerHTML = "";
    w.document.write(JSON.stringify({
      version: {
        major: settings.Version.major,
        minor: settings.Version.minor,
        build: settings.Version.build
      }
    }));
  };

  Main.resolveObject = function(obj, path) {
    var arr = path.split(".");
    while (arr.length) {
      obj = obj[arr.shift()];
    }
    return obj;
  };

  Main.setTimeout = function(func, delay) {
    setTimeout(func, delay);
  };

  Main.setInterval = function(func, delay) {
    setInterval(func, delay);
  };

  Main.clearTmpCanvas = function() {
    Main.tmpCtx.clearRect(0, 0, Main.tmpCanvas.width, Main.tmpCanvas.height);
  };

  Main.prototype.__class__ = Main;

  return Main;
});