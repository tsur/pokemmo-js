define(['jquery', 'socket', 'config/init', 'config/logger'], function($, $_, Renderer, Hash, GameState, ImageResource, CCharacter, Main, Std, entities) {

  var Game = function(p) {

    if (p === $_) {
      return;
    }

    this.loaded = false;
    Game.loadError = false;
    this.inBattle = false;
    this.queueLoadMap = false;
    this.gameObjects = [];
    this.characters = [];
    this.cachedImages = new Hash();
    this.playerCanMove = true;
    this.drawPlayerChar = true;
    this.drawPlayerFollower = true;
    Renderer.resetHooks();
  };

  Game.__name__ = ["pokemmo", "Game"];
  Game.state = null;
  Game.username = null;
  Game.accountLevel = null;
  Game.curGame = null;
  Game.pokemonParty = null;
  Game.loadError = null;
  Game.res = null;
  Game.pokemonData = null;
  Game.movesData = null;
  Game.playerBackspriteType = null;
  Game.loadedBasicUI = null;

  Game.setup = function() {

    Game.loadError = false;
    Game.loadedBasicUI = false;
    Game.state = GameState.ST_UNKNOWN;
    Game.res = ({});
    Game.accountLevel = 0;
  };

  Game.setPokemonParty = function(arr) {

    var _g1 = 0;
    var _g = arr.length;
    var i;

    while (_g1 < _g) {

      i = _g1++;
      arr[i].icon = Game.curGame != null ? Game.curGame.getImage("resources/picons/" + arr[i].id + "_1.png") : new ImageResource("resources/picons/" + arr[i].id + "_1.png");

      if (Game.curGame != null) {
        Game.curGame.getImage("resources/back/" + arr[i].id + ".png");
        Game.curGame.getImage("resources/followers/" + arr[i].id + ".png");
      } else {
        new Image().src = "resources/back/" + arr[i].id + ".png";
        new Image().src = "resources/followers/" + arr[i].id + ".png";
      }
    }

    Game.pokemonParty = arr;
  };

  Game.loadMap = function(id, chars) {

    Game.curGame = new Game();

    Game.state = GameState.ST_LOADING;

    if (!Game.loadedBasicUI) {

      Game.loadedBasicUI = true;
      Game.loadImageResource("miscSprites", "resources/tilesets/misc.png");
      Game.loadImageResource("uiPokemon", "resources/ui/pokemon.png");
      Game.loadImageResource("uiChat", "resources/ui/chat.png");
      Game.loadImageResource("uiCharInBattle", "resources/ui/char_in_battle.png");
      Game.loadImageResource("battleTextBackground", "resources/ui/battle_text.png");
      Game.loadImageResource("battleMoveMenu", "resources/ui/battle_move_menu.png");
      Game.loadImageResource("battleTrainerStatus", "resources/ui/battle_trainer_status.png");
      Game.loadImageResource("battleMisc", "resources/ui/battle_misc.png");
      Game.loadImageResource("battlePokeballs", "resources/ui/battle_pokeballs.png");
      Game.loadImageResource("battleActionMenu", "resources/ui/battle_action_menu.png");
      Game.loadImageResource("types", "resources/ui/types.png");
      Game.loadImageResource("battlePokemonBar", "resources/ui/battle_pokemon_bar.png");
      Game.loadImageResource("battleHealthBar", "resources/ui/battle_healthbar.png");
      Game.loadImageResource("battleEnemyBar", "resources/ui/battle_enemy_bar.png");
      Game.loadImageResource("battleIntroPokeball", "resources/ui/battle_intro_pokeball.png");
      Game.loadImageResource("animatedTileset", "resources/tilesets/animated.png");
      Game.loadImageResource("battleYesNo", "resources/ui/battle_yesno.png");
      Game.loadImageResource("battleLearnMove", "resources/ui/battle_learnmove.png");
      Game.loadImageResource("battleLearnMoveSelection", "resources/ui/battle_learnmove_selection.png");
      Game.loadJSON("data/pokemon.json", function(data) {
        Game.pokemonData = data;
      });
      Game.loadJSON("data/moves.json", function(data) {
        Game.movesData = data;
      });
    }

    Game.loadJSON("resources/maps/" + id + ".json", function(data) {

      var map = new Map(id, data);
      var _g = 0;
      var _g1 = map.tilesets;
      var tileset;
      var arr;
      var pk;
      var chrData;
      var chr;

      while (_g < _g1.length) {

        tileset = _g1[_g];
        ++_g;

        if (!tileset.loaded) {

          if (tileset.error) {

            Game.loadError = true;
            throw "loadError";

          } else {

            ++Game.pendingLoad;
          }
        }
      }

      tileset.onload = function() {
        --Game.pendingLoad;
      };

      tileset.onerror = function() {
        --Game.pendingLoad;
        Game.loadError = true;
        throw "loadError";
      };

      if (map.properties.preload_pokemon != null) {

        arr = map.properties.preload_pokemon.split(",");
        _g = 0;

        while (_g < arr.length) {

          pk = arr[_g];
          ++_g;
          Game.curGame.getImage("resources/followers/" + pk + ".png");
          Game.curGame.getImage("resources/sprites/" + pk + ".png");
        }
      }

      Game.curGame.loaded = true;
      Game.curGame.map = map;
      Game.curGame.parseMapObjects();

      arr = chars;
      _g = 0;

      while (_g < arr.length) {

        chrData = arr[_g];
        ++_g;
        chr = new CCharacter(chrData);

        if (chr.username === Game.username) {
          chr.freezeTicks = 10;
        }
      }

    });
  };

  Game.loadImageResource = function(id, src) {

    ++Game.pendingLoad;

    return Game.res[id] = new ImageResource(src, function() {
      --Game.pendingLoad;
    }, function() {
      --Game.pendingLoad;
      Game.loadError = true;
      throw "loadError";
    });

  };

  Game.loadJSON = function(src, onload) {

    ++Game.pendingLoad;

    var obj = ({});

    obj.cache = true;
    obj.dataType = "text";

    obj.success = function(data) {
      --Game.pendingLoad;
      onload(JSON.parse(data));
    };

    obj.error = function() {
      --Game.pendingLoad;
      Game.loadError = true;
      throw "loadError";
    };

    $.ajax(src, obj);
  };

  Game.getRes = function(id) {
    return Game.res[id];
  };

  Game.setRes = function(id, v) {
    Game.res[id] = v;
  };

  Game.getPokemonData = function(id) {
    return Game.pokemonData[id];
  };

  Game.getMoveData = function(id) {
    return Game.movesData[id.toLowerCase()];
  };

  Game.prototype.gameObjects = null;
  Game.prototype.characters = null;
  Game.prototype.cachedImages = null;
  Game.prototype.queueLoadMap = null;
  Game.prototype.queuedMap = null;
  Game.prototype.queuedChars = null;
  Game.prototype.loaded = null;
  Game.prototype.inBattle = null;
  Game.prototype.battle = null;
  Game.prototype.map = null;
  Game.prototype.playerCanMove = null;
  Game.prototype.drawPlayerChar = null;
  Game.prototype.drawPlayerFollower = null;

  Game.prototype.initBattle = function(b) {
    this.inBattle = true;
    this.battle = b;
    return this.battle;
  };

  Game.prototype.tick = function() {


    if (Game.state !== GameState.ST_MAP) {
      return;
    }

    var arr = this.gameObjects.copy();
    var _g1 = 0;
    var _g = arr.length;
    var i;

    while (_g1 < _g) {
      i = _g1++;
      arr[i].tick();
    }

    if (Renderer.numRTicks % 30 * 60 * 10 === 0) {
      this.cachedImages = new Hash();
    }

  };

  Game.prototype.renderObjects = function(ctx) {

    var arr = [];
    var icx = Math.floor(Renderer.cameraX);
    var icy = Math.floor(Renderer.cameraY);
    var fcx = icx + Main.screenWidth / this.map.tilewidth;
    var fcy = icy + Main.screenHeight / this.map.tileheight;
    var _g1 = 0;
    var _g = this.gameObjects.length;
    var A_FIRST = -1;
    var B_FIRST = 1;
    var i;

    while (_g1 < _g) {

      i = _g1++;

      if (this.gameObjects[i].x + 2 > icx && this.gameObjects[i].y + 2 > icy && this.gameObjects[i].x - 2 < fcx && this.gameObjects[i].y - 2 < fcy) {
        arr.push(this.gameObjects[i]);
      }
    }

    arr.sort(function(a, b) {

      if (a.y < b.y) {
        return A_FIRST;
      }

      if (a.y > b.y) {
        return B_FIRST;
      }

      if (a.y === b.y) {

        if (Std["is"](a, CCharacter)) {

          if (a.username === Game.username && Std["is"](b, CCharacter)) {
            return B_FIRST;
          }
        }

        if (Std["is"](b, CCharacter)) {

          if (b.username === Game.username && Std["is"](a, CCharacter)) {
            return A_FIRST;
          }
        }

        if (a.renderPriority > b.renderPriority) {
          return A_FIRST;
        }

        if (b.renderPriority > a.renderPriority) {
          return B_FIRST;
        }

        if (Std["is"](a, entities.CGrassAnimation)) {
          return B_FIRST;
        }

        if (Std["is"](b, entities.CGrassAnimation)) {
          return A_FIRST;
        }

        if (Std["is"](a, CCharacter) && Std["is"](b, entities.CFollower)) {

          return B_FIRST;

        } else if (Std["is"](b, CCharacter) && Std["is"](a, entities.CFollower)) {

          return A_FIRST;
        }

        if (a.randInt > b.randInt) {
          return B_FIRST;
        }

        if (a.randInt < b.randInt) {
          return A_FIRST;
        }

        return 0;
      }

      return 0;
    });

    _g1 = 0;
    _g = arr.length;

    while (_g1 < _g) {
      i = _g1++;
      arr[i].render(ctx);
    }

  };

  Game.prototype.getPlayerChar = function() {
    return this.getCharByUsername(Game.username);
  };

  Game.prototype.getCharByUsername = function(username) {

    var _g1 = 0;
    var _g = this.characters.length;
    var i;

    while (_g1 < _g) {

      i = _g1++;

      if (this.characters[i].username === username) {
        return this.characters[i];
      }
    }

    return null;
  };

  Game.prototype.getImage = function(src, onload, onerror) {

    var res;

    if (this.cachedImages.exists(src)) {
      res = this.cachedImages.get(src);
      res.addLoadHook(onload);
      res.addErrorHook(onerror);
      return res;
    }

    res = new ImageResource(src, onload, onerror);
    this.cachedImages.set(src, res);

    return res;
  };

  Game.prototype.parseMapObjects = function() {

    var _g = 0;
    var _g1 = this.map.layers;
    var _g2;
    var _g3;
    var layer;
    var obj;

    while (_g < _g1.length) {

      layer = _g1[_g];
      ++_g;

      if (layer.type !== "objectgroup") {
        continue;
      }

      _g2 = 0;
      _g3 = layer.objects;

      while (_g2 < _g3.length) {

        obj = _g3[_g2];
        ++_g2;

        switch (obj.type) {
          case "warp":

            if (obj.properties.type === "door") {

              new entities.CDoor(obj.name, Math.floor(obj.x / this.map.tilewidth), Math.floor(obj.y / this.map.tileheight));

            } else if (obj.properties.type === "arrow") {

              new entities.CWarpArrow(obj.name, Math.floor(obj.x / this.map.tilewidth), Math.floor(obj.y / this.map.tileheight));

            } else if (obj.properties.type === "stairs_up") {

              new entities.CStairs(obj.name, Math.floor(obj.x / this.map.tilewidth), Math.floor(obj.y / this.map.tileheight), 2, Std.parseInt(obj.properties.from_dir));

            } else if (obj.properties.type === "stairs_down") {

              new entities.CStairs(obj.name, Math.floor(obj.x / this.map.tilewidth), Math.floor(obj.y / this.map.tileheight), 0, Std.parseInt(obj.properties.from_dir));
            }

            break;
        }
      }
    }
  };

  Game.prototype.__class__ = Game;

  return Game;

});