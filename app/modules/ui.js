define(['jquery'], function($, $_, Main, Util, Chat, Game, GameState, Std, Renderer, EReg) {


  var UI = function() {};

  UI.__name__ = ["pokemmo", "UI"];

  UI.AButtonHooks = null;
  UI.BButtonHooks = null;
  UI.enterButtonHooks = null;
  UI.dirButtonHooks = null;
  UI.mouseX = null;
  UI.mouseY = null;
  UI.inputs = null;
  UI.selectedInput = null;
  UI.lastSelectedInput = null;
  UI.hiddenInput = null;

  UI.setup = function() {

    var w = window;

    UI.AButtonHooks = [];
    UI.BButtonHooks = [];
    UI.dirButtonHooks = [];
    UI.enterButtonHooks = [];
    UI.inputs = [];
    UI.mouseX = UI.mouseY = 0;

    UI.hiddenInput = document.createElement("input");
    UI.hiddenInput.type = "text";
    UI.hiddenInput.style.opacity = "0";
    UI.hiddenInput.style.position = "fixed";

    document.body.appendChild(UI.hiddenInput);

    $(w).keydown(function(e) {

      if (!Chat.inChat && e.keyCode === 68 && e.shiftKey && UI.selectedInput === null) {
        Main.printDebug();
        e.preventDefault();
        return;
      }

      if (e.keyCode === 13) {

        if (Game.state === GameState.ST_MAP) {

          if (!Chat.inChat && !Chat.justSentMessage) {
            Chat.inChat = true;
            Main.jq(Chat.chatBox).focus();
          }

        } else {

          UI.fireEnterHooks = true;
        }

        e.preventDefault();

      } else if (e.keyCode === 9) {

        UI.selectNextInput();
        e.preventDefault();
      }

      if (!Chat.inChat && !UI.keysDown[e.keyCode]) {

        UI.keysDown[e.keyCode] = true;

        if (e.keyCode === 90) {

          UI.uiAButtonDown = true;
          UI.fireAHooks = true;

        } else if (e.keyCode === 88) {

          UI.uiBButtonDown = true;
          UI.fireBHooks = true;

        } else if (e.keyCode === 37) {

          UI.arrowKeysPressed.push(1);

        } else if (e.keyCode === 40) {

          UI.arrowKeysPressed.push(0);

        } else if (e.keyCode === 39) {

          UI.arrowKeysPressed.push(3);

        } else if (e.keyCode === 38) {

          UI.arrowKeysPressed.push(2);
        }
      }

    });

    $(w).keyup(function(e) {

      UI.keysDown[e.keyCode] = false;

      if (e.keyCode === 13) {

        Chat.justSentMessage = false;

      } else if (e.keyCode === 90) {

        UI.uiAButtonDown = false;

      } else if (e.keyCode === 88) {

        UI.uiBButtonDown = false;
      }

      if (e.keyCode === 13 || e.keyCode === 32) {
        if (UI.selectedInput != null && Std["is"](UI.selectedInput, UI.UIButton)) {
          var b = UI.selectedInput;
          if (b.instantSubmit) {
            b.submit();
          }
        }
      }

    });

    $(w).blur(function() {
      var _g1 = 0,
        _g = UI.keysDown.length;

      while (_g1 < _g) {
        var i = _g1++;
        UI.keysDown[i] = false;
      }

      UI.mouseDown = false;

    });

    $(w).mousedown(function(e) {

      UI.mouseDownFuture = true;

      var selectedAny = false;
      var _g1 = 0,
        _g = UI.inputs.length;

      while (_g1 < _g) {
        var i = _g1++;
        if (UI.inputs[i].isUnderMouse()) {
          UI.inputs[i].select();
          selectedAny = true;
        }
      }

      if (!selectedAny && UI.selectedInput != null) {
        UI.lastSelectedInput = UI.selectedInput;
        UI.selectedInput.blur();
      }

      e.preventDefault();

    });

    $(w).mouseup(function() {

      UI.mouseDownFuture = false;

      if (UI.selectedInput != null && UI.selectedInput.isUnderMouse() && Std["is"](UI.selectedInput, UI.UIButton)) {
        var b = UI.selectedInput;
        if (b.instantSubmit) {
          b.submit();
        }
      }

    });
  };

  UI.selectNextInput = function() {

    var i, j, _g1, _g;

    if (UI.inputs.length <= 1) {
      return;
    }

    if (UI.selectedInput != null) {

      UI.inputs[(UI.inputs.indexOf(UI.selectedInput) + 1) % UI.inputs.length].select();

    } else if (UI.lastSelectedInput != null) {

      UI.inputs[(UI.inputs.indexOf(UI.lastSelectedInput) + 1) % UI.inputs.length].select();

    } else if (UI.inputs.length > 0) {

      UI.inputs[0].select();
    }

    if (UI.selectedInput != null && UI.selectedInput.disabled) {

      i = UI.inputs.indexOf(UI.selectedInput);
      _g1 = i;
      _g = UI.inputs.length;

      while (_g1 < _g) {

        j = _g1++;

        if (!UI.inputs[j].disabled) {
          return UI.inputs[j].select();
        }
      }

      _g = 0;

      while (_g < i) {

        j = _g++;

        if (!UI.inputs[j].disabled) {
          return UI.inputs[j].select();
        }
      }
    }

  };

  UI.tick = function() {

    var _g1, _g, _g3, _g2, i, j, arr, e;

    Main.onScreenCanvas.style.cursor = "auto";

    UI.mouseWasDown = UI.mouseDown;
    UI.mouseDown = UI.mouseDownFuture;

    if (UI.hiddenInput.selected) {

      UI.hiddenInput.selectionStart = UI.hiddenInput.value.length;
      UI.hiddenInput.selectionEnd = UI.hiddenInput.value.length;
    }

    _g1 = 0;
    _g = UI.inputs.length;

    while (_g1 < _g) {
      i = _g1++;
      UI.inputs[i].tick();
    }

    if (UI.fireAHooks) {

      UI.fireAHooks = false;
      arr = UI.AButtonHooks.copy();
      UI.AButtonHooks = [];

      if (!Renderer.curTransition) {

        _g = 0;

        while (_g < arr.length) {

          e = arr[_g];
          ++_g;
          e();
        }
      }
    }

    if (UI.fireBHooks) {

      UI.fireBHooks = false;
      arr = UI.BButtonHooks.copy();
      UI.BButtonHooks = [];

      if (!Renderer.curTransition) {

        _g = 0;

        while (_g < arr.length) {
          e = arr[_g];
          ++_g;
          e();
        }
      }

    }

    if (UI.fireEnterHooks) {

      UI.fireEnterHooks = false;
      arr = UI.enterButtonHooks.copy();
      UI.enterButtonHooks = [];

      if (!Renderer.curTransition) {

        _g = 0;

        while (_g < arr.length) {

          e = arr[_g];
          ++_g;
          e();
        }
      }

    }

    if (!Renderer.curTransition) {

      _g1 = 0;
      _g = UI.arrowKeysPressed.length;

      while (_g1 < _g) {

        i = _g1++;
        _g3 = 0;
        _g2 = UI.dirButtonHooks.length;

        while (_g3 < _g2) {
          j = _g3++;
          UI.dirButtonHooks[j](UI.arrowKeysPressed[i]);
        }
      }
    }

    UI.arrowKeysPressed = [];
  };

  UI.render = function(ctx) {

    var _g1, _g, i;

    _g1 = 0;
    _g = UI.inputs.length;

    while (_g1 < _g) {
      i = _g1++;
      UI.inputs[i].render(ctx);
    }
  };

  UI.hookAButton = function(func) {
    UI.AButtonHooks.push(func);
  };

  UI.hookBButton = function(func) {
    UI.BButtonHooks.push(func);
  };

  UI.hookEnterButton = function(func) {
    UI.enterButtonHooks.push(func);
  };

  UI.unHookAButton = function(func) {
    UI.AButtonHooks.remove(func);
  };

  UI.unHookBButton = function(func) {
    UI.BButtonHooks.remove(func);
  };

  UI.unHookABButtons = function() {
    UI.AButtonHooks = [];
    UI.BButtonHooks = [];
  };

  UI.unHookAllAButton = function() {
    UI.BButtonHooks = [];
  };

  UI.unHookAllBButton = function() {
    UI.BButtonHooks = [];
  };

  UI.unHookEnterButton = function(func) {
    UI.AButtonHooks.remove(func);
  };

  UI.hookDirButtons = function(func) {
    UI.dirButtonHooks.push(func);
  };

  UI.unHookDirButtons = function(func) {
    UI.dirButtonHooks.remove(func);
  };

  UI.isKeyDown = function(n) {
    return !!UI.keysDown[n];
  };

  UI.isMouseInRect = function(x1, y1, x2, y2) {
    return UI.mouseX >= x1 && UI.mouseY >= y1 && UI.mouseX < x2 && UI.mouseY < y2;
  };

  UI.renderPokemonParty = function(ctx) {

    if (Main.isPhone) {
      return;
    }
    Main.tmpCtx.clearRect(0, 0, Main.tmpCanvas.width, Main.tmpCanvas.height);
    var x = 10;
    var y = 10;
    var deltaY = 48;
    var pokemonParty = Game.pokemonParty;
    var tmpCtx = Main.tmpCtx;
    var tmpCanvas = Main.tmpCanvas;
    if (!pokemonParty) {
      return;
    }
    var drawStyleText = function(str, x_, y_) {
      tmpCtx.fillStyle = "rgb(0, 0, 0)";
      tmpCtx.fillText(str, x + x_ + 2, y + y_ + 2);
      tmpCtx.fillStyle = "rgb(255, 255, 255)";
      tmpCtx.fillText(str, x + x_, y + y_);
    };
    var _g1 = 0,
      _g = pokemonParty.length;
    while (_g1 < _g) {
      var i = _g1++;
      tmpCtx.save();
      tmpCtx.shadowOffsetX = 4;
      tmpCtx.shadowOffsetY = 4;
      tmpCtx.shadowBlur = 0;
      tmpCtx.shadowColor = "rgba(0, 0, 0, 0.5)";
      tmpCtx.drawImage(Game.res["uiPokemon"].obj, x, y);
      tmpCtx.restore();

      if (pokemonParty[i].icon.loaded) {
        tmpCtx.drawImage(pokemonParty[i].icon.obj, x + 8, y + 8);
      }

      tmpCtx.font = "12pt Font1";
      tmpCtx.fillStyle = "rgb(255, 255, 255)";
      drawStyleText(Util.getPokemonDisplayName(pokemonParty[i]), 45, 21);
      var lvWidth = tmpCtx.measureText("Lv " + pokemonParty[i].level).width;
      drawStyleText("Lv " + pokemonParty[i].level, 45, 35);
      tmpCtx.font = "12pt Font1";
      var hp = pokemonParty[i].hp + "/" + pokemonParty[i].maxHp;
      var barWidth = Math.ceil(tmpCtx.measureText(hp).width);
      drawStyleText(hp, 280 - barWidth, 35);
      var sx = x + 60 + lvWidth;
      tmpCtx.save();
      tmpCtx.translate(-0.5, -0.5);
      tmpCtx.lineWidth = 2;
      tmpCtx.save();
      tmpCtx.beginPath();
      tmpCtx.moveTo(0, y + 32);
      tmpCtx.lineTo(tmpCanvas.width, y + 32);
      tmpCtx.lineTo(tmpCanvas.width, y + 45);
      tmpCtx.lineTo(0, y + 45);
      tmpCtx.lineTo(0, y + 32);
      tmpCtx.clip();
      tmpCtx.strokeStyle = "rgb(0, 0, 0)";
      tmpCtx.fillStyle = "rgb(0, 0, 0)";
      tmpCtx.fillRect(sx + 5, y + 30, 190 - barWidth - lvWidth, 5);
      tmpCtx.fillStyle = "rgb(64,200,248)";
      tmpCtx.fillRect(sx + 5, y + 30, Math.ceil((190 - barWidth - lvWidth) * (pokemonParty[i].experience / pokemonParty[i].experienceNeeded)), 5);
      tmpCtx.strokeRect(sx + 5, y + 30, 190 - barWidth - lvWidth, 5);
      tmpCtx.restore();
      tmpCtx.fillStyle = "rgb(0, 200, 0)";
      tmpCtx.strokeStyle = "rgb(0, 0, 0)";
      tmpCtx.fillRect(sx, y + 27, Math.ceil((200 - barWidth - lvWidth) * (pokemonParty[i].hp / pokemonParty[i].maxHp)), 5);
      tmpCtx.strokeRect(sx, y + 27, 200 - barWidth - lvWidth, 5);
      tmpCtx.restore();
      y += deltaY;
    }
    ctx.globalAlpha = 0.8;
    ctx.drawImage(tmpCanvas, 480, 0);
    ctx.globalAlpha = 1;
  };

  UI.createTextInput = function(x, y, width) {
    var ti = new UI.TextInput(x, y, width);
    UI.inputs.push(ti);
    return ti;
  };

  UI.pushInput = function(i) {
    UI.inputs.push(i);
  };

  UI.removeInput = function(i) {
    if (UI.selectedInput === i) {
      i.blur();
    }
    UI.inputs.remove(i);
  };

  UI.removeAllInputs = function() {
    while (UI.inputs.length > 0) {
      UI.removeInput(UI.inputs[0]);
    }
  };

  UI.setCursor = function(str) {
    Main.onScreenCanvas.style.cursor = str;
  };

  UI.prototype.__class__ = UI;

  UI.keysDown = [];
  UI.uiAButtonDown = false;
  UI.uiBButtonDown = false;
  UI.mouseDown = false;
  UI.mouseWasDown = false;
  UI.mouseDownFuture = false;
  UI.fireAHooks = false;
  UI.fireBHooks = false;
  UI.fireEnterHooks = false;
  UI.arrowKeysPressed = [];

  UI.UIInput = function(x, y) {
    if (x === $_) {
      return;
    }
    this.x = x;
    this.y = y;
    this.disabled = false;
  };

  UI.UIInput.__name__ = ["pokemmo", "ui", "UIInput"];

  UI.UIInput.prototype.x = null;
  UI.UIInput.prototype.y = null;
  UI.UIInput.prototype.selected = null;
  UI.UIInput.prototype.selectedTime = null;
  UI.UIInput.prototype.disabled = null;
  UI.UIInput.prototype.select = function() {

    if (this.selected) {
      return;
    }

    if (UI.selectedInput != null) {
      UI.selectedInput.blur();
    }

    UI.selectedInput = this;
    this.selected = true;
    this.selectedTime = Date.now().getTime();
  };

  UI.UIInput.prototype.blur = function() {

    if (!this.selected) {
      return;
    }

    this.selected = false;
    UI.selectedInput = null;
  };

  UI.UIInput.prototype.tick = function() {};
  UI.UIInput.prototype.render = function() {};
  UI.UIInput.prototype.isUnderMouse = function() {
    return false;
  };

  UI.UIInput.prototype.__class__ = UI.UIInput;

  UI.TextInput = function(x, y, width) {
    if (x === $_) {
      return;
    }
    UI.UIInput.call(this, x, y);
    this.width = width;
    this.height = 18;
    this.selected = false;
    this.isPassword = false;
    this.value = "";
    this.maxLength = 0;
  };

  UI.TextInput.__name__ = ["pokemmo", "ui", "TextInput"];

  UI.TextInput.__super__ = UI.UIInput;

  for (var k in UI.UIInput.prototype) {
    UI.TextInput.prototype[k] = UI.UIInput.prototype[k];
  }

  UI.TextInput.prototype.width = null;
  UI.TextInput.prototype.height = null;
  UI.TextInput.prototype.value = null;
  UI.TextInput.prototype.isPassword = null;
  UI.TextInput.prototype.maxLength = null;

  UI.TextInput.prototype.select = function() {
    if (this.selected) {
      return;
    }
    UI.UIInput.prototype.select.call(this);
    UI.hiddenInput.value = this.value;
    Main.jq(UI.hiddenInput).focus();
  };

  UI.TextInput.prototype.blur = function() {
    if (!this.selected) {
      return;
    }
    UI.UIInput.prototype.blur.call(this);
    UI.hiddenInput.value = "";
    Main.jq(UI.hiddenInput).blur();
    Main.jq(Main.onScreenCanvas).focus();
  };

  UI.TextInput.prototype.tick = function() {
    if (this.disabled) {
      UI.hiddenInput.value = this.value;
      return;
    }
    if (this.selected) {
      this.value = UI.hiddenInput.value;
    }
  };

  UI.TextInput.prototype.isUnderMouse = function() {
    return UI.mouseX >= this.x && UI.mouseY >= this.y && UI.mouseX < this.x + this.width && UI.mouseY < this.y + this.height;
  };

  UI.TextInput.prototype.render = function(ctx) {
    var now = Date.now().getTime();
    if (this.isUnderMouse()) {
      Main.onScreenCanvas.style.cursor = "text";
    }
    if (this.maxLength > 0) {
      if (this.value.length > this.maxLength) {
        this.value = this.value.substr(0, this.maxLength);
        UI.hiddenInput.value = this.value;
      }
    }
    ctx.font = "12px Arial";
    ctx.fillStyle = "#000000";
    var str = this.value;
    if (this.isPassword) {
      str = new EReg(".", "g").replace(str, "*");
    }
    var txtWidth = 0;
    if (str.length > 0) {
      while (true) {
        txtWidth = Math.ceil(ctx.measureText(str).width);
        if (txtWidth < this.width - 8) {
          break;
        } else {
          str = str.substr(1);
        }
      }
      ctx.fillText(str, this.x + 5, this.y + 14);
    }
    if (this.selected && (now - this.selectedTime) % 1000 < 500) {
      ctx.fillRect(this.x + 6 + txtWidth, this.y + 2, 1, 14);
    }
  };

  UI.TextInput.prototype.__class__ = UI.TextInput;

  return UI;
});