define(['jquery', 'socket', 'config/init', 'config/logger'], function(ImageResource, UI, Renderer, TitleScreen, Game, GameState, Connection, Transitions) {

  var NewGameScreen = function() {};

  NewGameScreen.__name__ = ["pokemmo", "NewGameScreen"];
  NewGameScreen.starters = null;
  NewGameScreen.chars = null;
  NewGameScreen.charsImage = null;
  NewGameScreen.startersFollowerImage = null;
  NewGameScreen.startersSpriteImage = null;
  NewGameScreen.border128 = null;
  NewGameScreen.arrows = null;
  NewGameScreen.curChar = null;
  NewGameScreen.curStarter = null;
  NewGameScreen.confirmBtn = null;
  NewGameScreen.cancelBtn = null;
  NewGameScreen.arrowPokLeft = null;
  NewGameScreen.arrowPokRight = null;
  NewGameScreen.arrowCharLeft = null;
  NewGameScreen.arrowCharRight = null;

  NewGameScreen.init = function(starters, chars) {

    var _g, i;

    NewGameScreen.starters = starters;
    NewGameScreen.chars = chars;
    NewGameScreen.pendingLoad = starters.length * 2 + chars.length;
    NewGameScreen.startersFollowerImage = [];
    NewGameScreen.startersSpriteImage = [];
    NewGameScreen.charsImage = [];
    NewGameScreen.curChar = Math.floor(Math.random() * chars.length);
    NewGameScreen.curStarter = Math.floor(Math.random() * starters.length);

    ++NewGameScreen.pendingLoad;

    NewGameScreen.border128 = new ImageResource("resources/ui/border_128.png", NewGameScreen.onImageLoad, NewGameScreen.onImageError);

    ++NewGameScreen.pendingLoad;

    NewGameScreen.arrows = new ImageResource("resources/ui/arrows.png", NewGameScreen.onImageLoad, NewGameScreen.onImageError);

    _g = 0;

    while (_g < starters.length) {

      i = starters[_g];

      ++_g;

      NewGameScreen.startersFollowerImage.push(new ImageResource("resources/followers/" + i + ".png", NewGameScreen.onImageLoad, NewGameScreen.onImageError));

      NewGameScreen.startersSpriteImage.push(new ImageResource("resources/sprites/" + i + ".png", NewGameScreen.onImageLoad, NewGameScreen.onImageError));
    }

    _g = 0;

    while (_g < chars.length) {

      i = chars[_g];

      ++_g;

      NewGameScreen.charsImage.push(new ImageResource("resources/chars/" + i + ".png", NewGameScreen.onImageLoad, NewGameScreen.onImageError));
    }

    NewGameScreen.confirmBtn = new UI.UIButton(340, 490, 130, 30);

    NewGameScreen.confirmBtn.drawIdle = function(ctx) {
      ctx.drawImage(TitleScreen.titleButtons.obj, 200, 0, 150, 50, NewGameScreen.confirmBtn.x - 15, NewGameScreen.confirmBtn.y - 15, 150, 50);
    };

    NewGameScreen.confirmBtn.drawHover = function(ctx) {
      ctx.drawImage(TitleScreen.titleButtons.obj, 200, 50, 150, 50, NewGameScreen.confirmBtn.x - 15, NewGameScreen.confirmBtn.y - 15, 150, 50);
    };

    NewGameScreen.confirmBtn.drawDown = function(ctx) {
      ctx.drawImage(TitleScreen.titleButtons.obj, 200, 100, 150, 50, NewGameScreen.confirmBtn.x - 15, NewGameScreen.confirmBtn.y - 15, 150, 50);
    };

    NewGameScreen.confirmBtn.drawDisabled = function(ctx) {
      ctx.drawImage(TitleScreen.titleButtons.obj, 200, 150, 150, 50, NewGameScreen.confirmBtn.x - 15, NewGameScreen.confirmBtn.y - 15, 150, 50);
    };

    NewGameScreen.confirmBtn.onSubmit = NewGameScreen.onConfirm;

    UI.inputs.push(NewGameScreen.confirmBtn);

    var createArrow = function(x, y, dir, func) {

      var arrow = new UI.UIButton(x, y, 32, 32);

      arrow.drawIdle = function(ctx) {
        ctx.drawImage(NewGameScreen.arrows.obj, dir * 32, 0, 32, 32, arrow.x, arrow.y, 32, 32);
      };

      arrow.drawHover = function(ctx) {
        ctx.drawImage(NewGameScreen.arrows.obj, dir * 32, 32, 32, 32, arrow.x, arrow.y, 32, 32);
      };

      arrow.drawDown = function(ctx) {
        ctx.drawImage(NewGameScreen.arrows.obj, dir * 32, 64, 32, 32, arrow.x, arrow.y, 32, 32);
      };

      arrow.onSubmit = func;
      UI.inputs.push(arrow);
      return arrow;
    };

    NewGameScreen.arrowPokLeft = createArrow(260, 430, 1, function() {
      if (--NewGameScreen.curStarter < 0) {
        NewGameScreen.curStarter += starters.length;
      }
    });

    NewGameScreen.arrowPokRight = createArrow(305, 430, 3, function() {
      if (++NewGameScreen.curStarter >= starters.length) {
        NewGameScreen.curStarter -= starters.length;
      }
    });

    NewGameScreen.arrowCharLeft = createArrow(468, 430, 1, function() {
      if (--NewGameScreen.curChar < 0) {
        NewGameScreen.curChar += chars.length;
      }
    });

    NewGameScreen.arrowCharRight = createArrow(513, 430, 3, function() {
      if (++NewGameScreen.curChar >= chars.length) {
        NewGameScreen.curChar -= chars.length;
      }
    });
  };

  NewGameScreen.onImageLoad = function() {
    --NewGameScreen.pendingLoad;
    if (NewGameScreen.pendingLoad === 0) {
      Renderer.startTransition(new Transitions.FadeIn(10));
    }
  };

  NewGameScreen.onImageError = function() {};

  NewGameScreen.onConfirm = function() {

    Renderer.startTransition(new Transitions.FadeOut(10)).onComplete = function() {
      NewGameScreen.destroy();
      Game.state = GameState.ST_LOADING;
      Connection.socket.emit("newGame", {
        starter: NewGameScreen.starters[NewGameScreen.curStarter],
        character: NewGameScreen.chars[NewGameScreen.curChar]
      });
    };

  };

  NewGameScreen.destroy = function() {

    UI.removeInput(NewGameScreen.confirmBtn);
    UI.removeInput(NewGameScreen.arrowPokLeft);
    UI.removeInput(NewGameScreen.arrowPokRight);
    UI.removeInput(NewGameScreen.arrowCharLeft);
    UI.removeInput(NewGameScreen.arrowCharRight);
  };

  NewGameScreen.render = function(ctx) {

    if (NewGameScreen.pendingLoad > 0) {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "12pt Courier New";
      ctx.fillText("Loading... " + NewGameScreen.pendingLoad, 10, 30);
      return;
    }

    ctx.save();
    ctx.drawImage(TitleScreen.titleLogo.obj, 117, 80);
    ctx.fillStyle = "#000000";
    ctx.font = "21px Font3";
    ctx.textAlign = "center";
    ctx.fillText("Choose your character and starter Pokémon", 400, 250);
    ctx.drawImage(NewGameScreen.border128.obj, 200, 250);
    ctx.drawImage(NewGameScreen.border128.obj, 408, 250);
    ctx.drawImage(NewGameScreen.startersSpriteImage[NewGameScreen.curStarter].obj, 232, 282);
    ctx.drawImage(NewGameScreen.startersFollowerImage[NewGameScreen.curStarter].obj, 192, Math.floor(Renderer.numRTicks % 10 / 5) * 64, 64, 64, 449, 302, 64, 64);
    ctx.drawImage(NewGameScreen.charsImage[NewGameScreen.curChar].obj, 96, Math.floor((Renderer.numRTicks + 3) % 20 / 5) * 64, 32, 64, 508, 302, 32, 64);
    ctx.restore();
  };

  NewGameScreen.prototype.__class__ = NewGameScreen;

  return NewGameScreen;
});