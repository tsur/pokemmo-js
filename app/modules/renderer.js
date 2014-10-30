define(['jquery', 'socket', 'config/init', 'config/logger'], function(Game, Main, Chat, UI, GameState, TitleScreen, RegisterScreen, NewGameScreen, Battle) {

  var Renderer = function() {};

  Renderer.__name__ = ["pokemmo", "Renderer"];
  Renderer.willRender = null;
  Renderer.cameraX = null;
  Renderer.cameraY = null;
  Renderer.renderHooks = null;
  Renderer.gameRenderHooks = null;
  Renderer.curTransition = null;

  Renderer.setup = function() {
    Renderer.resetHooks();
  };

  Renderer.render = function() {

    var func;

    if (Renderer.willRender) {
      return;
    }

    Renderer.willRender = true;

    func = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.webkitRequestAnimationFrame || window.oRequestAnimationFrame;

    if (func == null) {

      func = function() {
        setTimeout(Renderer.realRender, 1);
      };
    }

    func(Renderer.realRender);
  };

  Renderer.getOffsetX = function() {
    return Math.floor(Game.curGame.map.tilewidth * -Renderer.cameraX);
  };

  Renderer.getOffsetY = function() {
    return Math.floor(Game.curGame.map.tileheight * -Renderer.cameraY);
  };

  Renderer.hookRender = function(func) {

    if (Renderer.renderHooks.indexOf(func) !== -1) {
      return;
    }

    Renderer.renderHooks.push(func);
  };

  Renderer.unHookRender = function(func) {

    var i = Renderer.renderHooks.indexOf(func);

    if (i !== -1) {
      Renderer.renderHooks.splice(i, 1);
    }
  };

  Renderer.resetHooks = function() {

    Renderer.renderHooks = [];
    Renderer.gameRenderHooks = [];

  };

  Renderer.realRender = function() {

    var ctx = Main.ctx;
    var canvas = Main.canvas;
    var onScreenCtx = Main.onScreenCtx;
    var onScreenCanvas = Main.onScreenCanvas;
    // var tmpCtx = Main.tmpCtx;
    // var tmpCanvas = Main.tmpCanvas;
    var g = Game.curGame;

    var map;
    var chr;
    var hk;
    var _g;
    var _g1;
    var arr;
    var i;
    var func;
    var step;

    Renderer.willRender = false;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#66BBFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    switch ((Game.state)[1]) {

      case 0:

        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        break;

      case 2:

        if (g == null) {
          return;
        }

        map = g.map;

        if (map == null) {
          throw "No map in memory";
        }

        chr = g.getPlayerChar();

        if (chr != null) {
          Renderer.cameraX = chr.getRenderPosX() / map.tilewidth + 1 - Main.screenWidth / map.tilewidth / 2;
          Renderer.cameraY = chr.getRenderPosY() / map.tileheight - Main.screenHeight / map.tileheight / 2;
        }

        map.render(ctx);
        map.renderAnimated(ctx);
        Game.curGame.renderObjects(ctx);
        map.renderOver(ctx);

        _g = 0;
        _g1 = Renderer.gameRenderHooks;

        while (_g < _g1.length) {
          hk = _g1[_g];
          ++_g;
          hk();
        }

        Chat.renderBubbles(ctx);

        if (g.inBattle && g.battle.step !== Battle.BATTLE_STEP.BATTLE_STEP_TRANSITION) {
          g.battle.render(ctx);
        }

        Chat.render(ctx);

        if (!g.inBattle) {
          UI.renderPokemonParty(ctx);
        }

        if (Renderer.renderHooks.length > 0) {

          arr = Renderer.renderHooks.copy();
          _g1 = 0;
          _g = arr.length;

          while (_g1 < _g) {
            i = _g1++;
            arr[i]();
          }
        }

        break;

      case 1:

        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "12pt Courier New";

        if (Game.loadError) {

          ctx.fillText("Failed loading files", 10, 30);
        } else if (Game.pendingLoad === 0) {

          Game.state = GameState.ST_MAP;

          step = 0;
          func = null;

          func = function() {
            ctx.fillStyle = "#000000";
            ctx.globalAlpha = 1 - step / 8;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = 1;
            ++step;
            if (step >= 8) {
              Renderer.unHookRender(func);
            }
          };

          Renderer.hookRender(func);
          Renderer.render();

        } else {
          ctx.fillText("Loading... " + Game.pendingLoad, 10, 30);
        }
        break;

      case 3:

        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "12pt Courier New";
        ctx.fillText("Disconnected from the server", 10, 30);
        break;

      case 4:

        TitleScreen.render(ctx);
        break;

      case 6:

        RegisterScreen.render(ctx);
        break;

      case 5:

        NewGameScreen.render(ctx);
        break;

    }

    UI.render(ctx);

    if (Renderer.curTransition != null) {
      Renderer.curTransition.render(ctx);
    }

    onScreenCtx.clearRect(0, 0, onScreenCanvas.width, onScreenCanvas.height);
    onScreenCtx.drawImage(canvas, 0, 0);
    ++Renderer.numRTicks;
  };

  Renderer.drawOverlay = function(ctx, x, y, width, height, drawFunc) {

    var tmpCtx = Main.tmpCtx;
    var overlayWidth = width + 4;
    var overlayHeight = height + 4;

    tmpCtx.clearRect(0, 0, overlayWidth, overlayHeight);
    tmpCtx.save();

    tmpCtx.fillStyle = "#FFFF00";
    tmpCtx.fillRect(0, 0, overlayWidth, overlayHeight);
    tmpCtx.globalCompositeOperation = "destination-atop";

    drawFunc(tmpCtx);

    tmpCtx.restore();

    ctx.drawImage(Main.tmpCanvas, 0, 0, width, height, x - 2, y, width, height);
    ctx.drawImage(Main.tmpCanvas, 0, 0, width, height, x, y - 2, width, height);
    ctx.drawImage(Main.tmpCanvas, 0, 0, width, height, x, y + 2, width, height);
    ctx.drawImage(Main.tmpCanvas, 0, 0, width, height, x + 2, y, width, height);
  };

  Renderer.drawShadowText2 = function(ctx, str, x, y, color, shadowColor) {

    ctx.fillStyle = shadowColor;
    ctx.fillText(str, x + 2, y);
    ctx.fillText(str, x, y + 2);
    ctx.fillText(str, x + 2, y + 2);
    ctx.fillStyle = color;
    ctx.fillText(str, x, y);
  };

  Renderer.startTransition = function(t) {

    Renderer.curTransition = t;
    return t;

  };

  Renderer.stopTransition = function() {

    Renderer.curTransition = null;

  };

  Renderer.isInTransition = function() {

    return Renderer.curTransition != null;

  };

  Renderer.prototype.__class__ = Renderer;

  return Renderer;

});