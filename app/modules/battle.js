define(['jquery', 'socket', 'config/init', 'config/logger'], function() {

  var Battle = function(data) {

    if (data === $_) {
      return;
    }

    this.type = data.type;
    this.x = data.x;
    this.y = data.y;
    this.myId = data.id;
    this.myTeam = data.team;
    this.battleFinished = false;
    this.players = data.info.players;

    switch (this.type) {

      case 0:
        this.setCurPokemon(data.info.players[this.myId].pokemon);
        this.enemyPokemon = data.info.players[this.myId === 0 ? 1 : 0].pokemon;
        break;

      default:
        throw "Invalid battle type";
    }

    this.background = Game.curGame.getImage("resources/ui/battle_background1.png");
    this.enemyPokemon.sprite = Game.curGame.getImage("resources/sprites" + (this.enemyPokemon.shiny ? "_shiny" : "") + "/" + this.enemyPokemon.id + ".png");
    this.randInt = Math.floor(Math.random() * 100000);
    this.step = Battle.BATTLE_STEP.BATTLE_STEP_TRANSITION;
    this.text = "";
    this.selectedAction = 0;
    this.canRenderEnemy = true;
    this.canRenderPlayerPokemon = true;
    this.enemyFainted = false;
    this.pokemonFainted = false;
    this.runningQueue = false;
    this.shakeEnemyStatus = false;
    this.shakePokemonStatus = false;
    this.resultQueue = [];

    UI.dirButtonHooks.push($closure(this, "buttonHandler"));
  };

  Battle.__name__ = ["pokemmo", "Battle"];
  Battle.prototype.step = null;
  Battle.prototype.type = null;
  Battle.prototype.myId = null;
  Battle.prototype.myTeam = null;
  Battle.prototype.x = null;
  Battle.prototype.y = null;
  Battle.prototype.curPokemon = null;
  Battle.prototype.enemyPokemon = null;
  Battle.prototype.background = null;
  Battle.prototype.now = null;
  Battle.prototype.selectedAction = null;
  Battle.prototype.selectedMove = null;
  Battle.prototype.text = null;
  Battle.prototype.textTime = null;
  Battle.prototype.textCompleted = null;
  Battle.prototype.textCompletedTime = null;
  Battle.prototype.textDelay = null;
  Battle.prototype.textOnComplete = null;
  Battle.prototype.textOnYes = null;
  Battle.prototype.textOnNo = null;
  Battle.prototype.textQuestion = null;
  Battle.prototype.textQuestionSelectedAnswer = null;
  Battle.prototype.animStep = null;
  Battle.prototype.canRenderEnemy = null;
  Battle.prototype.canRenderPlayerPokemon = null;
  Battle.prototype.enemyFainted = null;
  Battle.prototype.enemyFaintedTick = null;
  Battle.prototype.pokemonFainted = null;
  Battle.prototype.pokemonFaintedTick = null;
  Battle.prototype.shakeEnemyStatus = null;
  Battle.prototype.shakePokemonStatus = null;
  Battle.prototype.resultQueue = null;
  Battle.prototype.curAction = null;
  Battle.prototype.moveStartTime = null;
  Battle.prototype.curMove = null;
  Battle.prototype.randInt = null;
  Battle.prototype.battleFinished = null;
  Battle.prototype.learningMove = null;
  Battle.prototype.forgetMoveSelected = null;
  Battle.prototype.runningQueue = null;
  Battle.prototype.players = null;

  Battle.prototype.setCurPokemon = function(pk) {

    pk.backsprite = Game.curGame.getImage("resources/back" + (pk.shiny ? "_shiny" : "") + "/" + pk.id + ".png");
    pk.iconBig = Game.curGame.getImage("resources/picons/" + pk.id + "_1_x2.png");
    this.curPokemon = pk;

  };

  Battle.prototype.render = function(ctx) {

    var me = this;

    this.now = Date.now().getTime();

    ctx.save();
    ctx.translate(Main.isPhone ? 0 : 160, Main.isPhone ? 0 : 140);

    if (this.step === Battle.BATTLE_STEP.BATTLE_STEP_LEARN_MOVE) {
      this.renderLearnMove(ctx);
    } else {

      if (this.step === Battle.BATTLE_STEP.BATTLE_STEP_TURN && this.curMove !== null) {
        this.curMove.render(ctx, this);
      }

      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgb(0,0,0)";
      ctx.strokeRect(-1, -1, 482, 226);

      if (this.background.obj.width !== 0) {
        ctx.drawImage(this.background.obj, 0, 0);
      }

      if (this.step !== Battle.BATTLE_STEP.BATTLE_STEP_FIGHT_MENU) {
        this.drawBottomPanel(ctx);
      }

      if (this.step === Battle.BATTLE_STEP.BATTLE_STEP_FIGHT_MENU) {
        this.drawFightMenu(ctx);
      }

      if (this.canRenderEnemy) {
        this.renderEnemy(ctx);
      }

      if (this.step === Battle.BATTLE_STEP.BATTLE_STEP_TRANSITION || this.step === Battle.BATTLE_STEP.BATTLE_STEP_POKEMON_APPEARED_TMP || this.step === Battle.BATTLE_STEP.BATTLE_STEP_POKEMON_APPEARED) {
        ctx.drawImage(Game.res["playerBacksprite"].obj, 0, 0, 128, 128, 60, 96, 128, 128);
      } else if (this.step === Battle.BATTLE_STEP.BATTLE_STEP_GO_POKEMON) {
        this.drawGoPokemonAnimation(ctx);
      } else if (this.canRenderPlayerPokemon) {
        this.drawPlayerPokemon(ctx);
      }

      this.drawEnemyStatus(ctx);

      if (this.step !== Battle.BATTLE_STEP.BATTLE_STEP_TRANSITION && this.step !== Battle.BATTLE_STEP.BATTLE_STEP_POKEMON_APPEARED_TMP && this.step !== Battle.BATTLE_STEP.BATTLE_STEP_POKEMON_APPEARED && this.step !== Battle.BATTLE_STEP.BATTLE_STEP_GO_POKEMON) {
        this.drawPokemonStatus(ctx);
      }

      if (this.step === Battle.BATTLE_STEP.BATTLE_STEP_POKEMON_APPEARED_TMP) {

        this.step = Battle.BATTLE_STEP.BATTLE_STEP_POKEMON_APPEARED;

        this.setBattleText(Util.getPokemonDisplayName(this.enemyPokemon) + " appeared!", -1, function() {
          var pk = me.curPokemon;
          me.setBattleText("Go! " + Util.getPokemonDisplayName(me.curPokemon) + "!");
          me.step = Battle.BATTLE_STEP.BATTLE_STEP_GO_POKEMON;
          me.animStep = 0;
          me.selectedMove = 0;
        });
      }

      if (this.step !== Battle.BATTLE_STEP.BATTLE_STEP_FIGHT_MENU && this.text !== "" && this.textCompleted && this.textQuestion) {

        ctx.drawImage(Game.res["battleYesNo"].obj, 370, 130);

        if (this.textQuestionSelectedAnswer) {

          ctx.drawImage(Game.res["battleMisc"].obj, 96, 0, 32, 32, 376 + Math.floor(this.now % 1000 / 500) * 2, 148, 32, 32);

        } else {

          ctx.drawImage(Game.res["battleMisc"].obj, 96, 0, 32, 32, 376 + Math.floor(this.now % 1000 / 500) * 2, 178, 32, 32);

        }
      }
    }

    ctx.restore();
  };

  Battle.prototype.renderLearnMove = function(ctx) {

    var _g;
    var i;
    var move;
    var movePP;
    var moveMaxPP;
    var moveType;

    ctx.drawImage(Game.res["battleLearnMove"].obj, 0, 0);
    ctx.drawImage(this.curPokemon.iconBig.obj, 16, 32);
    ctx.drawImage(Game.res["types"].obj, 0, 24 * PokemonConst.typeNameToInt(Game.pokemonData[this.curPokemon.id].type1), 64, 24, 96, 70, 64, 24);

    if (!Game.pokemonData[this.curPokemon.id].type2) {

      ctx.drawImage(Game.res["types"].obj, 0, 24 * PokemonConst.typeNameToInt(Game.pokemonData[this.curPokemon.id].type2), 64, 24, 164, 70, 64, 24);
    }

    ctx.font = "24px Font2";

    Renderer.drawShadowText2(ctx, Util.getPokemonDisplayName(this.curPokemon), 80, 56, "rgb(248,248,248)", "rgb(96,96,96)");

    ctx.save();

    while (_g < 5) {

      i = _g++;
      move = i < 4 ? this.curPokemon.moves[i] : this.learningMove;
      movePP = i < 4 ? this.curPokemon.movesPP[i] : Game.movesData[this.learningMove.toLowerCase()].maxPP;
      moveMaxPP = i < 4 ? this.curPokemon.movesMaxPP[i] : movePP;
      moveType = Game.movesData[(i < 4 ? this.curPokemon.moves[i] : this.learningMove).toLowerCase()].type;

      ctx.drawImage(Game.res["types"].obj, 0, 24 * PokemonConst.typeNameToInt(moveType), 64, 24, 246, 42, 64, 24);

      Renderer.drawShadowText2(ctx, move.toUpperCase(), 326, 64, "rgb(32,32,32)", "rgb(216,216,216)");

      Renderer.drawShadowText2(ctx, Std.string(movePP), 412 + (movePP < 10 ? 8 : 0), 86, "rgb(32,32,32)", "rgb(216,216,216)");

      Renderer.drawShadowText2(ctx, Std.string(moveMaxPP), 448, 86, "rgb(32,32,32)", "rgb(216,216,216)");

      ctx.translate(0, 56);
    }

    ctx.restore();

    ctx.drawImage(Game.res["battleLearnMoveSelection"].obj, 240, 36 + 56 * this.forgetMoveSelected);
  };

  Battle.prototype.drawBottomPanel = function(ctx) {

    var me = this;
    var str;
    var maxWidth;
    var lastLine;
    var secondLine;
    var firstLine;
    var arr;
    var x1;
    var y1;
    var x2;
    var y2;

    ctx.drawImage(Game.res["battleTextBackground"].obj, 2, 228);

    if (this.text !== "") {

      str = this.text.substr(0, Math.floor((this.now - this.textTime) / 30));

      ctx.font = "24px Font2";

      maxWidth = this.step === Battle.BATTLE_STEP.BATTLE_STEP_ACTION_MENU ? 150 : 420;

      lastLine = str;

      secondLine = null;

      if (ctx.measureText(str).width > maxWidth) {

        firstLine = str;

        secondLine = "";

        do {
          arr = firstLine.split(" ");
          secondLine = arr.pop() + " " + secondLine;
          firstLine = arr.join(" ");
        } while (ctx.measureText(firstLine).width > maxWidth);

        ctx.fillStyle = "rgb(104,88,112)";
        ctx.fillText(firstLine, 26, 266);
        ctx.fillText(secondLine, 26, 294);
        ctx.fillText(firstLine, 24, 268);
        ctx.fillText(secondLine, 24, 296);
        ctx.fillText(firstLine, 26, 268);
        ctx.fillText(secondLine, 26, 296);
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.fillText(firstLine, 24, 266);
        ctx.fillText(secondLine, 24, 294);
        lastLine = secondLine;

      } else {

        ctx.fillStyle = "rgb(104,88,112)";
        ctx.fillText(str, 24, 268);
        ctx.fillText(str, 26, 266);
        ctx.fillText(str, 26, 268);
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.fillText(str, 24, 266);
      }

      if (str === this.text) {

        if (!this.textCompleted) {

          this.textCompleted = true;
          this.textCompletedTime = this.now;

          if (this.textQuestion) {

            this.textQuestionSelectedAnswer = true;

            UI.AButtonHooks.push(function() {

              {
                UI.AButtonHooks = [];
                UI.BButtonHooks = [];
              }

              if (me.textQuestionSelectedAnswer) {
                me.textOnYes();
              } else {
                me.textOnNo();
              }

            });

            UI.BButtonHooks.push(function() {

              {
                UI.AButtonHooks = [];
                UI.BButtonHooks = [];
              }

              me.textOnNo();

            });

          } else if (this.textDelay === 0) {

            if (this.textOnComplete !== null) {
              this.textOnComplete();
            }

          } else if (this.textDelay !== -1) {

            if (this.textOnComplete !== null) {

              setTimeout(function() {
                me.textOnComplete();
              }, this.textDelay);

            } else {

              UI.AButtonHooks.push(function() {
                setTimeout(me.textOnComplete, 100);
              });
            }

          } else if (!this.textQuestion) {

            if (this.textDelay === -1 && this.now - this.textCompletedTime > 100) {

              var tmp = Math.floor(this.now % 1000 / 250);

              if (tmp === 3) {
                tmp = 1;
              }

              tmp *= 2;

              ctx.drawImage(Game.res["battleMisc"].obj, 0, 0, 32, 32, 24 + ctx.measureText(lastLine).width, 240 + tmp + (secondLine != null ? 28 : 0), 32, 32);
            }
          }
        }
      }

      if (this.step === Battle.BATTLE_STEP.BATTLE_STEP_ACTION_MENU) {

        ctx.drawImage(Game.res["battleActionMenu"].obj, 246, 226);

        x1 = 252 + Math.floor(this.now % 1000 / 500) * 2;
        y1 = 246;

        x2 = x1 + 112;
        y2 = y1 + 30;

        switch (this.selectedAction) {
          case 0:
            ctx.drawImage(Game.res["battleMisc"].obj, 96, 0, 32, 32, x1, y1, 32, 32);
            break;
          case 1:
            ctx.drawImage(Game.res["battleMisc"].obj, 96, 0, 32, 32, x2, y1, 32, 32);
            break;
          case 2:
            ctx.drawImage(Game.res["battleMisc"].obj, 96, 0, 32, 32, x1, y2, 32, 32);
            break;
          case 3:
            ctx.drawImage(Game.res["battleMisc"].obj, 96, 0, 32, 32, x2, y2, 32, 32);
            break;
        }
      }
    }
  };

  Battle.prototype.drawFightMenu = function(ctx) {

    ctx.drawImage(Game.res["battleMoveMenu"].obj, 2, 228);

    var x1 = 40;
    var y1 = 268;
    var x2 = 180;
    var y2 = 300;
    var _g = 0;
    var i, x, y, n;

    while (_g < 4) {

      i = _g++;
      x = 0;
      y = 0;

      switch (i) {

        case 0:
          x = x1;
          y = y1;
          break;

        case 1:
          x = x2;
          y = y1;
          break;

        case 2:
          x = x1;
          y = y2;
          break;

        case 3:
          x = x2;
          y = y2;
          break;
      }

      n = this.curPokemon.moves[i] == null ? "--" : this.curPokemon.moves[i].toUpperCase();

      ctx.font = "16px Font4";
      ctx.fillStyle = "rgb(208,208,208)";
      ctx.fillText(n, x, y + 2);
      ctx.fillText(n, x + 2, y);
      ctx.fillText(n, x + 2, y + 2);
      ctx.fillStyle = "rgb(72,72,72)";
      ctx.fillText(n, x, y);

      if (this.selectedMove == i) {
        ctx.drawImage(Game.res["battleMisc"].obj, 96, 0, 32, 32, x - 28 + Math.floor(this.now % 1000 / 500) * 2, y - 22, 32, 32);
      }
    }

    ctx.drawImage(Game.res["types"].obj, 0, 24 * PokemonConst.typeNameToInt(Game.movesData[this.curPokemon.moves[this.selectedMove].toLowerCase()].type), 64, 24, 390, 284, 64, 24);
  };

  Battle.prototype.renderEnemy = function(ctx) {

    if (this.enemyFainted) {

      if (Renderer.numRTicks - this.enemyFaintedTick <= 5) {

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(290, 30);
        ctx.lineTo(418, 30);
        ctx.lineTo(418, 158);
        ctx.lineTo(290, 158);
        ctx.lineTo(290, 30);
        ctx.clip();
        ctx.drawImage(this.enemyPokemon.sprite.obj, 290, 30 + (Renderer.numRTicks - this.enemyFaintedTick) * 30);
        ctx.restore();
      }

    } else {
      ctx.drawImage(this.enemyPokemon.sprite.obj, 290, 30);
    }

  };

  Battle.prototype.drawGoPokemonAnimation = function(ctx) {

    if (this.animStep >= 4 && this.animStep < 25) {

      var ballAnimation = [
        [60, 179, 1, 0],
        [62, 175, 1, 0],
        [70, 168, 1, 0],
        [75, 165, 1, 0],
        [83, 160, 1, 0],
        [86, 160, 1, 0],
        [95, 161, 1, 0],
        [97, 164, 1, 0],
        [105, 170, 1, 0],
        [110, 175, 1, 0],
        [111, 178, 1, 0],
        [113, 183, 1, 0],
        [114, 185, 1, 0],
        [115, 190, 1, 0],
        [117, 192, 1, 0],
        [120, 195, 1, 0, 0.95],
        [123, 200, 1, 1, 0.9],
        [124, 205, 1.05, 1, 0.8],
        [125, 200, 1.1, 1, 0.6],
        [126, 192, 1.15, 1, 0.3],
        [127, 192, 1.2, 1, 0.1]
      ];

      ctx.save();
      ctx.globalAlpha = ballAnimation[this.animStep - 4][4];
      ctx.translate(ballAnimation[this.animStep - 4][0], ballAnimation[this.animStep - 4][1]);
      ctx.scale(ballAnimation[this.animStep - 4][2], ballAnimation[this.animStep - 4][2]);
      ctx.rotate(this.animStep / 17 * Math.PI * 2);
      ctx.drawImage(Game.res["battlePokeballs"].obj, 64, 32 * ballAnimation[this.animStep - 4][3], 32, 32, -16, -16, 32, 32);
      ctx.restore();
    }

    if (Math.floor(this.animStep / 4) < 5) {

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(480, 0);
      ctx.lineTo(480, 320);
      ctx.lineTo(0, 320);
      ctx.lineTo(0, 0);
      ctx.clip();
      ctx.globalAlpha = Util.clamp(1 - this.animStep / 20, 0, 1);
      ctx.drawImage(Game.res["playerBacksprite"].obj, 128 * Math.floor(this.animStep / 4), 0, 128, 128, 60 - this.animStep * 5, 96, 128, 128);
      ctx.restore();
    }

    if (this.animStep > 21 && this.animStep < 35) {

      var perc = Math.min((this.animStep - 21) / 10, 1);
      Main.tmpCtx.clearRect(0, 0, Main.tmpCanvas.width, Main.tmpCanvas.height);

      var tmpCtx = Main.tmpCtx;
      tmpCtx.save();
      tmpCtx.fillStyle = "#FFFFFF";
      tmpCtx.fillRect(0, 0, Main.tmpCanvas.width, Main.tmpCanvas.height);
      tmpCtx.globalCompositeOperation = "destination-atop";
      tmpCtx.translate(124, 192);
      tmpCtx.scale(perc, perc);
      tmpCtx.drawImage(this.curPokemon.backsprite.obj, -64, -96);
      tmpCtx.restore();
      ctx.save();
      ctx.translate(124, 192);
      ctx.scale(perc, perc);
      ctx.drawImage(this.curPokemon.backsprite.obj, -64, -96);
      ctx.restore();
      ctx.globalAlpha = Util.clamp(1 - Math.max(0, perc * perc - 0.5) * 2, 0, 1);
      ctx.drawImage(Main.tmpCanvas, 0, 0);
      ctx.globalAlpha = 1;

    } else if (this.animStep >= 35) {
      this.selectedAction = 0;
      this.openActionMenu();
    }

    ++this.animStep;
  };

  Battle.prototype.drawPlayerPokemon = function(ctx) {

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(60, 96);
    ctx.lineTo(188, 96);
    ctx.lineTo(188, 224);
    ctx.lineTo(60, 224);
    ctx.lineTo(60, 96);
    ctx.clip();

    if (this.pokemonFainted) {

      if (Renderer.numRTicks - this.pokemonFaintedTick <= 5) {
        ctx.drawImage(this.curPokemon.backsprite.obj, 60, 96 + (Renderer.numRTicks - this.pokemonFaintedTick) * 30);
      }

    } else {

      ctx.drawImage(this.curPokemon.backsprite.obj, 60, 96 + ((this.step == Battle.BATTLE_STEP.BATTLE_STEP_ACTION_MENU || this.step == Battle.BATTLE_STEP.BATTLE_STEP_FIGHT_MENU) && (this.now + this.randInt) % 600 < 300 ? 2 : 0));
    }

    ctx.restore();
  };

  Battle.prototype.drawEnemyStatus = function(ctx) {

    ctx.save();

    if (this.shakeEnemyStatus && Renderer.numRTicks % 2 === 0) {
      ctx.translate(0, 2);
    }

    ctx.drawImage(Game.res["battleEnemyBar"].obj, 26, 32);
    ctx.drawImage(Game.res["battleHealthBar"].obj, 0, 0, 1, 6, 104, 66, 96, 6);

    var hpPerc = this.enemyPokemon.hp / this.enemyPokemon.maxHp;

    if (hpPerc > 0.50) {

      ctx.drawImage(Game.res["battleHealthBar"].obj, 0, 6, 1, 6, 104, 66, Math.floor(48 * hpPerc) * 2, 6);

    } else if (hpPerc >= 0.20) {

      ctx.drawImage(Game.res["battleHealthBar"].obj, 0, 12, 1, 6, 104, 66, Math.floor(48 * hpPerc) * 2, 6);

    } else {

      ctx.drawImage(Game.res["battleHealthBar"].obj, 0, 18, 1, 6, 104, 66, Math.ceil(48 * hpPerc) * 2, 6);
    }

    var pokemonName = Util.getPokemonStatusBarName(this.enemyPokemon);
    var pokemonLevel = "Lv" + this.enemyPokemon.level;
    var lvlX = 168 - (this.enemyPokemon.level < 10 ? 0 : this.enemyPokemon.level < 100 ? 8 : 16);

    ctx.font = "16px Font4";

    {
      ctx.fillStyle = "rgb(216,208,176)";
      ctx.fillText(pokemonName, 42, 56);
      ctx.fillText(pokemonName, 40, 58);
      ctx.fillText(pokemonName, 42, 58);
      ctx.fillStyle = "rgb(64,64,64)";
      ctx.fillText(pokemonName, 40, 56);
    }

    {
      ctx.fillStyle = "rgb(216,208,176)";
      ctx.fillText(pokemonLevel, lvlX + 2, 56);
      ctx.fillText(pokemonLevel, lvlX, 58);
      ctx.fillText(pokemonLevel, lvlX + 2, 58);
      ctx.fillStyle = "rgb(64,64,64)";
      ctx.fillText(pokemonLevel, lvlX, 56);
    }

    var tmpX = ctx.measureText(pokemonName).width + 40;

    if (this.enemyPokemon.gender === 1) {

      ctx.drawImage(Game.res["battleMisc"].obj, 64, 0, 10, 16, tmpX, 42, 10, 16);

    } else if (this.enemyPokemon.gender === 2) {

      ctx.drawImage(Game.res["battleMisc"].obj, 74, 0, 10, 16, tmpX, 42, 10, 16);
    }

    ctx.restore();
  };

  Battle.prototype.drawPokemonStatus = function(ctx) {

    ctx.save();

    var tmp = 0;

    if (this.step === Battle.BATTLE_STEP.BATTLE_STEP_ACTION_MENU || this.step === Battle.BATTLE_STEP.BATTLE_STEP_FIGHT_MENU) {

      ctx.translate(0, this.now % 600 < 300 ? 0 : 2);
    }

    if (this.shakePokemonStatus && Renderer.numRTicks % 2 === 0) {
      ctx.translate(0, 2);
    }

    ctx.drawImage(Game.res["battlePokemonBar"].obj, 252, 148);
    ctx.drawImage(Game.res["battleHealthBar"].obj, 0, 0, 1, 6, 348, 182, 96, 6);

    var hpPerc = this.curPokemon.hp / this.curPokemon.maxHp;

    if (hpPerc > 0.50) {

      ctx.drawImage(Game.res["battleHealthBar"].obj, 0, 6, 1, 6, 348, 182, Math.floor(48 * hpPerc) * 2, 6);

    } else if (hpPerc >= 0.20) {

      ctx.drawImage(Game.res["battleHealthBar"].obj, 0, 12, 1, 6, 348, 182, Math.floor(48 * hpPerc) * 2, 6);

    } else {

      ctx.drawImage(Game.res["battleHealthBar"].obj, 0, 18, 1, 6, 348, 182, Math.ceil(48 * hpPerc) * 2, 6);
    }

    ctx.fillStyle = "rgb(64,200,248)";
    ctx.fillRect(316, 214, Math.floor(this.curPokemon.experience / this.curPokemon.experienceNeeded * 64) * 2, 4);

    var pokemonName = Util.getPokemonStatusBarName(this.curPokemon);
    var pokemonLevel = "Lv" + this.curPokemon.level;
    var lvlX = 412 - (this.curPokemon.level < 10 ? 0 : this.curPokemon.level < 100 ? 8 : 16);
    var maxHpX = 422 - (this.curPokemon.maxHp >= 100 ? 8 : 0);

    ctx.font = "16px Font4";

    {
      ctx.fillStyle = "rgb(216,208,176)";
      ctx.fillText(pokemonName, 286, 172);
      ctx.fillText(pokemonName, 284, 174);
      ctx.fillText(pokemonName, 286, 174);
      ctx.fillStyle = "rgb(64,64,64)";
      ctx.fillText(pokemonName, 284, 172);
    }

    {
      ctx.fillStyle = "rgb(216,208,176)";
      ctx.fillText(pokemonLevel, lvlX + 2, 172);
      ctx.fillText(pokemonLevel, lvlX, 174);
      ctx.fillText(pokemonLevel, lvlX + 2, 174);
      ctx.fillStyle = "rgb(64,64,64)";
      ctx.fillText(pokemonLevel, lvlX, 172);
    }

    Renderer.drawShadowText2(ctx, Std.string(this.curPokemon.maxHp), maxHpX, 208, "rgb(64,64,64)", "rgb(216,208,176)");
    Renderer.drawShadowText2(ctx, Std.string(this.curPokemon.hp), 382, 208, "rgb(64,64,64)", "rgb(216,208,176)");

    var tmpX = ctx.measureText(pokemonName).width + 284;

    if (this.curPokemon.gender == 1) {

      ctx.drawImage(Game.res["battleMisc"].obj, 64, 0, 10, 16, tmpX, 158, 10, 16);

    } else if (this.curPokemon.gender == 2) {

      ctx.drawImage(Game.res["battleMisc"].obj, 74, 0, 10, 16, tmpX, 158, 10, 16);

    }

    ctx.restore();
  };

  Battle.prototype.openActionMenu = function() {

    var me = this;

    this.runningQueue = false;

    this.step = Battle.BATTLE_STEP.BATTLE_STEP_ACTION_MENU;

    this.setBattleText("What will " + Util.getPokemonDisplayName(this.curPokemon) + " do?");

    UI.AButtonHooks.push(function() {

      switch (me.selectedAction) {

        case 0:
          me.openFightMenu();
          break;

        case 3:
          me.setBattleText(null);
          me.step = Battle.BATTLE_STEP.BATTLE_STEP_TURN;
          Connection.socket.emit("battleAction", {
            type: "run"
          });
          break;

        default:
          me.openActionMenu();
      }

    });
  };

  Battle.prototype.openFightMenu = function() {
    var me = this;
    this.step = BATTLE_STEP.BATTLE_STEP_FIGHT_MENU;
    var aAction, bAction = null;
    aAction = function() {
      UI.BButtonHooks.remove(bAction);
      me.setBattleText(null);
      me.step = BATTLE_STEP.BATTLE_STEP_TURN;
      Connection.socket.emit("battleAction", {
        type: "move",
        move: me.selectedMove
      });
    };
    bAction = function() {
      UI.AButtonHooks.remove(aAction);
      me.openActionMenu();
      me.textTime = 0;
    };
    UI.AButtonHooks.push(aAction);
    UI.BButtonHooks.push(bAction);
  }
  Battle.prototype.setBattleText = function(str, delay, onComplete) {
    this.textQuestion = false;
    this.text = str == null ? "" : str;
    this.textTime = this.now;
    if (delay == null) delay = Math.NaN;
    this.textDelay = delay;
    this.textOnComplete = onComplete;
    this.textCompleted = false;
  }
  Battle.prototype.setBattleTextQuestion = function(str, onYes, onNo) {
    this.setBattleText(str);
    this.textQuestion = true;
    this.textOnYes = onYes;
    this.textOnNo = onNo;
  }
  Battle.prototype.runQueue = function(force) {
    if (force == null) force = false;
    var me = this;
    if (!force && this.runningQueue) return;
    this.runningQueue = true;
    if (this.resultQueue.length == 0) {
      this.openActionMenu();
      return;
    }
    var action = this.resultQueue.shift();
    this.curAction = action;
    var actionPlayerPokemon = action.player != null ? this.players[action.player].pokemon : null;
    var actionEnemyPokemon = action.player != null ? this.players[action.player == 0 ? 1 : 0].pokemon : null;
    switch (action.type) {
      case "moveAttack":
        this.setBattleText(Util.getPokemonDisplayName(actionPlayerPokemon) + " used " + action.value.move.toUpperCase() + "!");
        setTimeout(function() {
          me.moveStartTime = Date.now().getTime();
          me.playMove(action.value.move);
        }, 1000);
        break;
      case "moveMiss":
        this.setBattleText(Util.getPokemonDisplayName(actionPlayerPokemon) + " used " + action.value.toUpperCase() + "!");
        setTimeout(function() {
          me.setBattleText("But it missed!");
          setTimeout(function() {
            me.runQueue(true);
          }, 1000);
        }, 1000);
        break;
      case "moveDebuff":
        this.setBattleText(Util.getPokemonDisplayName(actionPlayerPokemon) + " used " + action.value.move.toUpperCase() + "!");
        setTimeout(function() {
          me.moveStartTime = Date.now().getTime();
          me.moveFinished();
        }, 1000);
        break;
      case "debuff":
        this.runQueue(true);
        break;
      case "applyStatus":
        actionEnemyPokemon.status = action.value;
        this.setBattleText(PokemonConst.getStatusApplyPhrase(action.value, Util.or(actionEnemyPokemon.nickname, Game.pokemonData[actionEnemyPokemon.id].name).toUpperCase()), -1, function() {
          setTimeout(function() {
            me.runQueue(true);
          }, 1000);
        });
        break;
      case "pokemonDefeated":
        var attacker;
        var defeated;
        if ((action.player < Math.floor(this.players.length / 2) ? 0 : 1) != this.myTeam) {
          attacker = this.curPokemon;
          defeated = this.enemyPokemon;
          this.enemyFainted = true;
          this.enemyFaintedTick = Renderer.numRTicks;
        } else {
          attacker = this.enemyPokemon;
          defeated = this.curPokemon;
          this.pokemonFainted = true;
          this.pokemonFaintedTick = Renderer.numRTicks;
        }
        this.setBattleText(Util.getPokemonDisplayName(defeated) + " fainted!", -1, function() {
          if ((action.player < Math.floor(me.players.length / 2) ? 0 : 1) != me.myTeam && action.value > 0) me.setBattleText(Util.getPokemonDisplayName(attacker) + " gained " + action.value + " EXP. Points!", -1, function() {
            me.animateExp();
          });
          else me.runQueue(true);
        });
        break;
      case "win":
        this.finish();
        break;
      case "flee":
        this.setBattleText("Got away safely!", -1, function() {
          me.battleFinished = true;
          me.finish();
        });
        break;
      case "fleeFail":
        this.setBattleText("Your attempt to run failed!", -1, function() {
          me.runQueue(true);
        });
        break;
      case "switchFainted":
        if (action.player != this.myId) {
          this.setBattleText("The opponent is selecting another pokemon");
          this.runningQueue = false;
          return;
        }
        break;
      case "pokemonLevelup":
        this.runQueue(true);
        break;
      case "pokemonLearnedMove":
        if (action.player != this.myId) return;
        this.learnedMoves(action, function() {
          me.runQueue(true);
        });
        break;
      case "pokemonLearnMoves":
        if (action.player != this.myId) return;
        var arr = action.value;
        var func = null;
        var i = -1;
        func = function() {
          ++i;
          if (i >= arr.length) {
            me.runQueue(true);
            return;
          }
          me.learnMoveOver(arr[i], func);
        };
        func();
        break;
      default:
        Main.log("Unknown battle action: " + action.type);
    }
  }
  Battle.prototype.getPlayerTeam = function(p) {
    return p < Math.floor(this.players.length / 2) ? 0 : 1;
  }
  Battle.prototype.learnedMoves = function(action, onComplete) {
    var me = this;
    var arr = action.value;
    var i = 0;
    var func = null;
    func = function() {
      if (i >= arr.length) {
        onComplete();
        return;
      }
      me.setBattleText(Util.getPokemonDisplayName(me.curPokemon) + " learned " + arr[i++].toUpperCase() + "!", -1, func);
    };
    func();
  }
  Battle.prototype.learnMoveOver = function(move, func) {
    var me = this;
    this.learningMove = move;
    var previousStep = null;
    var aAction = null;
    var bAction = null;
    var ctx = Main.ctx;
    this.setBattleText(Util.getPokemonDisplayName(this.curPokemon) + " is trying to learn " + move.toUpperCase() + ".", -1, function() {
      me.setBattleText("But, " + Util.getPokemonDisplayName(me.curPokemon) + " can't learn more than four moves.", -1, function() {
        me.setBattleTextQuestion("Delete a move to make room for " + move.toUpperCase() + "?", function() {
          var transition = null;
          var tstep = 0;
          transition = function() {
            ctx.save();
            ctx.translate(Main.isPhone ? 0 : 160, Main.isPhone ? 0 : 140);
            if (tstep < 10) {
              ctx.globalAlpha = tstep / 10;
              ctx.fillStyle = "#000000";
              ctx.fillRect(0, 0, 480, 320);
            } else if (tstep < 15) {
              if (tstep == 10) {
                me.forgetMoveSelected = 0;
                previousStep = me.step;
                me.step = BATTLE_STEP.BATTLE_STEP_LEARN_MOVE;
              }
              ctx.fillStyle = "#000000";
              ctx.fillRect(0, 0, 480, 320);
            } else if (tstep < 25) {
              ctx.globalAlpha = 1 - (tstep - 15) / 10;
              ctx.fillStyle = "#000000";
              ctx.fillRect(0, 0, 480, 320);
            } else {
              Renderer.unHookRender(transition);
              UI.AButtonHooks.push(aAction);
              UI.BButtonHooks.push(bAction);
            }
            ctx.restore();
            ++tstep;
          };
          Renderer.hookRender(transition);
        }, function() {
          func();
        });
      });
    });
    aAction = function() {
      UI.BButtonHooks = [];
      var oldMove = me.curPokemon.moves[me.forgetMoveSelected];
      Connection.socket.emit("battleLearnMove", {
        slot: me.forgetMoveSelected,
        move: move
      });
      var transition = null;
      var tstep = 0;
      transition = function() {
        ctx.save();
        ctx.translate(Main.isPhone ? 0 : 160, Main.isPhone ? 0 : 140);
        if (tstep < 10) {
          ctx.globalAlpha = tstep / 10;
          ctx.fillStyle = "#000000";
          ctx.fillRect(0, 0, 480, 320);
        } else if (tstep < 15) {
          if (tstep == 10) {
            me.curPokemon.moves[me.forgetMoveSelected] = me.learningMove;
            me.step = previousStep;
            me.setBattleText("1, 2, and... ... ... Poof!", -1, function() {
              me.setBattleText(Util.getPokemonDisplayName(me.curPokemon) + " forgot " + oldMove.toUpperCase() + ".", -1, function() {
                me.setBattleText("And...", -1, function() {
                  me.setBattleText(Util.getPokemonDisplayName(me.curPokemon) + " learned " + move.toUpperCase() + "!", -1, function() {
                    func();
                  });
                });
              });
            });
          }
          ctx.fillStyle = "#000000";
          ctx.fillRect(0, 0, 480, 320);
        } else if (tstep < 25) {
          ctx.globalAlpha = 1 - (tstep - 15) / 10;
          ctx.fillStyle = "#000000";
          ctx.fillRect(0, 0, 480, 320);
        } else Renderer.unHookRender(transition);
        ctx.restore();
        ++tstep;
      };
      Renderer.hookRender(transition);
    };
    bAction = function() {
      UI.BButtonHooks = [];
      var transition = null;
      var tstep = 0;
      transition = function() {
        ctx.save();
        ctx.translate(Main.isPhone ? 0 : 160, Main.isPhone ? 0 : 140);
        if (tstep < 10) {
          ctx.globalAlpha = tstep / 10;
          ctx.fillStyle = "#000000";
          ctx.fillRect(0, 0, 480, 320);
        } else if (tstep < 15) {
          if (tstep == 10) {
            me.step = previousStep;
            me.setBattleTextQuestion("Are you sure you want " + Util.getPokemonDisplayName(me.curPokemon) + " to stop learning " + me.learningMove.toUpperCase() + "?", function() {
              me.setBattleText(null);
              func();
            }, function() {
              me.learnMoveOver(me.learningMove, func);
            });
          }
          ctx.fillStyle = "#000000";
          ctx.fillRect(0, 0, 480, 320);
        } else if (tstep < 25) {
          ctx.globalAlpha = 1 - (tstep - 15) / 10;
          ctx.fillStyle = "#000000";
          ctx.fillRect(0, 0, 480, 320);
        } else Renderer.unHookRender(transition);
        ctx.restore();
        ++tstep;
      };
      Renderer.hookRender(transition);
    };
  }
  Battle.prototype.animateHp = function() {
    var me = this;
    var action = this.curAction;
    var renderFunc = null;
    renderFunc = function() {
      var result = action.value.resultHp;
      var pok;
      var enemy;
      if (action.player != me.myId) {
        pok = me.curPokemon;
        enemy = me.enemyPokemon;
      } else {
        pok = me.enemyPokemon;
        enemy = me.curPokemon;
      }
      var step = Math.ceil(pok.maxHp / 50);
      if (pok.hp > result) {
        pok.hp -= step;
        if (pok.hp < result) pok.hp = result;
      } else if (pok.hp < result) {
        pok.hp += step;
        if (pok.hp > result) pok.hp = result;
      }
      if (pok.hp == result) {
        Renderer.unHookRender(renderFunc);
        if (action.value.effec == 0) me.setBattleText("It doesn't affect " + Util.or(pok.nickname, Game.pokemonData[pok.id].name).toUpperCase(), -1, function() {
          me.runQueue(true);
        });
        else if (action.value.effec < 1) me.setBattleText("It's not very effective...", -1, function() {
          me.runQueue(true);
        });
        else if (action.value.effec > 1) me.setBattleText("It's super effective!", -1, function() {
          me.runQueue(true);
        });
        else setTimeout(function() {
          me.runQueue(true);
        }, 200);
      }
    };
    Renderer.hookRender(renderFunc);
  }
  Battle.prototype.animateExp = function() {
    var me = this;
    var action = this.curAction;
    if ((action.player < Math.floor(this.players.length / 2) ? 0 : 1) == this.myTeam || this.curPokemon.level >= 100) {
      this.runQueue(true);
      return;
    }
    this.textDelay = 1 / 0;
    var expGained = action.value;
    var step = Math.ceil(expGained / 100);
    var renderFunc = null;
    renderFunc = function() {
      var pok = me.curPokemon;
      if (step > expGained) step = expGained;
      pok.experience += step;
      expGained -= step;
      if (pok.experience >= pok.experienceNeeded) {
        expGained += pok.experience - pok.experienceNeeded;
        var info = me.resultQueue.shift();
        if (info.type != "pokemonLevelup") throw "Assertion failed";
        var backsprite = me.curPokemon.backsprite;
        me.setCurPokemon(info.value);
        pok = me.curPokemon;
        if (action.player != me.myId) return;
        pok.experience = 0;
        Renderer.unHookRender(renderFunc);
        me.setBattleText(Util.getPokemonDisplayName(me.curPokemon) + " grew to LV. " + me.curPokemon.level + "!", -1, function() {
          if (me.resultQueue.length > 0 && me.resultQueue[0].type == "pokemonLearnedMove") me.learnedMoves(me.resultQueue.shift(), $closure(me, "animateExp"));
          else me.animateExp();
        });
      }
      if (expGained <= 0) {
        Renderer.unHookRender(renderFunc);
        setTimeout(function() {
          me.runQueue(true);
        }, 100);
      }
    };
    Renderer.hookRender(renderFunc);
  }
  Battle.prototype.playMove = function(n) {
    var m = Move.getMove(n);
    this.curMove = m;
    m.start();
  }
  Battle.prototype.moveFinished = function() {
    var me = this;
    this.curMove = null;
    this.shakeEnemyStatus = false;
    this.shakePokemonStatus = false;
    var action = this.curAction;
    if (action.type == "moveAttack") this.animateHp();
    else setTimeout(function() {
      me.runQueue(true);
    }, 200);
  }
  Battle.prototype.buttonHandler = function(dir) {
    if (Renderer.curTransition != null) return;
    if (this.step == BATTLE_STEP.BATTLE_STEP_ACTION_MENU) switch (this.selectedAction) {
      case 0:
        if (dir == 3) this.selectedAction = 1;
        else if (dir == 0) this.selectedAction = 2;
        break;
      case 1:
        if (dir == 1) this.selectedAction = 0;
        else if (dir == 0) this.selectedAction = 3;
        break;
      case 2:
        if (dir == 2) this.selectedAction = 0;
        else if (dir == 3) this.selectedAction = 3;
        break;
      case 3:
        if (dir == 2) this.selectedAction = 1;
        else if (dir == 1) this.selectedAction = 2;
        break;
    } else if (this.step == BATTLE_STEP.BATTLE_STEP_FIGHT_MENU) switch (this.selectedMove) {
        case 0:
          if (dir == 3 && this.curPokemon.moves[1] != null) this.selectedMove = 1;
          else if (dir == 0 && this.curPokemon.moves[2] != null) this.selectedMove = 2;
          break;
        case 1:
          if (dir == 1 && this.curPokemon.moves[0] != null) this.selectedMove = 0;
          else if (dir == 0 && this.curPokemon.moves[3] != null) this.selectedMove = 3;
          break;
        case 2:
          if (dir == 2 && this.curPokemon.moves[0] != null) this.selectedMove = 0;
          else if (dir == 3 && this.curPokemon.moves[3] != null) this.selectedMove = 3;
          break;
        case 3:
          if (dir == 2 && this.curPokemon.moves[1] != null) this.selectedMove = 1;
          else if (dir == 1 && this.curPokemon.moves[2] != null) this.selectedMove = 2;
          break;
      } else if (this.step == BATTLE_STEP.BATTLE_STEP_LEARN_MOVE) {
        if (dir == 2) {
          if (this.forgetMoveSelected > 0)--this.forgetMoveSelected;
        } else if (dir == 0) {
          if (this.forgetMoveSelected < 4)++this.forgetMoveSelected;
        }
      }
    if (this.text != "" && this.textCompleted && this.textQuestion) {
      if (this.textQuestionSelectedAnswer) {
        if (dir == 0) this.textQuestionSelectedAnswer = false;
      } else if (dir == 2) this.textQuestionSelectedAnswer = true;
    }
  }
  Battle.prototype.finish = function() {
    var me = this;
    UI.dirButtonHooks.remove($closure(this, "buttonHandler"));
    Connection.socket.emit("battleFinished");
    Connection.socket.once("battleFinish", function(data) {
      Game.setPokemonParty(data.pokemon);
      me.battleFinished = true;
    });
    var step = 0;
    var func = null;
    var ctx = Main.ctx;
    var canvas = Main.canvas;
    func = function() {
      ctx.fillStyle = "#000000";
      if (step < 15) {
        ctx.globalAlpha = step / 15;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;
      } else if (step < 20) {
        ctx.globalAlpha = 1;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (!me.battleFinished) return;
        if (step == 15) {
          Game.curGame.inBattle = false;
          Game.curGame.battle = null;
          Game.curGame.drawPlayerChar = true;
          Game.curGame.drawPlayerFollower = true;
          var chr = Game.curGame.getPlayerChar();
          if (chr != null) chr.inBattle = false;
        }
      } else {
        ctx.globalAlpha = 1 - (step - 20) / 8;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;
        if (step >= 28) Renderer.unHookRender(func);
      }
      ++step;
    };
    Renderer.hookRender(func);
  }

  Battle.BATTLE_STEP = {
    __ename__: ["pokemmo", "BATTLE_STEP"],
    __constructs__: ["BATTLE_STEP_TRANSITION", "BATTLE_STEP_POKEMON_APPEARED_TMP", "BATTLE_STEP_POKEMON_APPEARED", "BATTLE_STEP_GO_POKEMON", "BATTLE_STEP_ACTION_MENU", "BATTLE_STEP_FIGHT_MENU", "BATTLE_STEP_TURN", "BATTLE_STEP_LEARN_MOVE"]
  };

  Battle.BATTLE_STEP.BATTLE_STEP_TRANSITION = ["BATTLE_STEP_TRANSITION", 0];
  Battle.BATTLE_STEP.BATTLE_STEP_TRANSITION.toString = $estr;
  Battle.BATTLE_STEP.BATTLE_STEP_TRANSITION.__enum__ = Battle.BATTLE_STEP;
  Battle.BATTLE_STEP.BATTLE_STEP_POKEMON_APPEARED_TMP = ["BATTLE_STEP_POKEMON_APPEARED_TMP", 1];
  Battle.BATTLE_STEP.BATTLE_STEP_POKEMON_APPEARED_TMP.toString = $estr;
  Battle.BATTLE_STEP.BATTLE_STEP_POKEMON_APPEARED_TMP.__enum__ = Battle.BATTLE_STEP;
  Battle.BATTLE_STEP.BATTLE_STEP_POKEMON_APPEARED = ["BATTLE_STEP_POKEMON_APPEARED", 2];
  Battle.BATTLE_STEP.BATTLE_STEP_POKEMON_APPEARED.toString = $estr;
  Battle.BATTLE_STEP.BATTLE_STEP_POKEMON_APPEARED.__enum__ = Battle.BATTLE_STEP;
  Battle.BATTLE_STEP.BATTLE_STEP_GO_POKEMON = ["BATTLE_STEP_GO_POKEMON", 3];
  Battle.BATTLE_STEP.BATTLE_STEP_GO_POKEMON.toString = $estr;
  Battle.BATTLE_STEP.BATTLE_STEP_GO_POKEMON.__enum__ = Battle.BATTLE_STEP;
  Battle.BATTLE_STEP.BATTLE_STEP_ACTION_MENU = ["BATTLE_STEP_ACTION_MENU", 4];
  Battle.BATTLE_STEP.BATTLE_STEP_ACTION_MENU.toString = $estr;
  Battle.BATTLE_STEP.BATTLE_STEP_ACTION_MENU.__enum__ = Battle.BATTLE_STEP;
  Battle.BATTLE_STEP.BATTLE_STEP_FIGHT_MENU = ["BATTLE_STEP_FIGHT_MENU", 5];
  Battle.BATTLE_STEP.BATTLE_STEP_FIGHT_MENU.toString = $estr;
  Battle.BATTLE_STEP.BATTLE_STEP_FIGHT_MENU.__enum__ = Battle.BATTLE_STEP;
  Battle.BATTLE_STEP.BATTLE_STEP_TURN = ["BATTLE_STEP_TURN", 6];
  Battle.BATTLE_STEP.BATTLE_STEP_TURN.toString = $estr;
  Battle.BATTLE_STEP.BATTLE_STEP_TURN.__enum__ = Battle.BATTLE_STEP;
  Battle.BATTLE_STEP.BATTLE_STEP_LEARN_MOVE = ["BATTLE_STEP_LEARN_MOVE", 7];
  Battle.BATTLE_STEP.BATTLE_STEP_LEARN_MOVE.toString = $estr;
  Battle.BATTLE_STEP.BATTLE_STEP_LEARN_MOVE.__enum__ = Battle.BATTLE_STEP;

  Battle.prototype.__class__ = Battle;

  return Battle;

});