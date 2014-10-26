define(['jquery', 'socket', 'config/init', 'config/logger'], function($, io, Settings, Logger, Std, CCharacter, Transitions, Game, GameState, Renderer, UI, Entities, Chat, TitleScreen, NewGameScreen, Battle) {


  var Connection = function() {};

  Connection.__name__ = ["pokemmo", "Connection"];
  Connection.socket = null;
  Connection.lastAckMove = 0;

  Connection.setup = function() {

    Connection.socket = io.connect(Settings.Connection.SERVER_HOST);

    Connection.socket.on("connect", Connection.onConnect);
    Connection.socket.on("disconnect", Connection.onDisconnect);
    Connection.socket.on("setInfo", Connection.onSetInfo);
    Connection.socket.on("loadMap", Connection.onLoadMap);
    Connection.socket.on("invalidMove", Connection.onInvalidMove);
    Connection.socket.on("update", Connection.onUpdate);
    Connection.socket.on("battleInit", Connection.onBattleInit);
    Connection.socket.on("battleWild", Connection.onBattleWild);
    Connection.socket.on("battleTurn", Connection.onBattleTurn);
    Connection.socket.on("loginFail", Connection.onLoginFail);
    Connection.socket.on("newGame", Connection.onNewGame);
    Connection.socket.on("startGame", Connection.onStartGame);

  };

  Connection.onConnect = function() {
    Logger.log("Connected");
  };

  Connection.onDisconnect = function() {

    Game.state = GameState.ST_DISCONNECTED;
    Game.curGame = null;

    while (UI.inputs.length) {
      UI.removeInput(UI.inputs[0]);
    }

    Connection.socket.disconnect();
  };

  Connection.onSetInfo = function(data) {

    Game.setPokemonParty(data.pokemon);
    Game.accountLevel = data.accountLevel;
  };

  Connection.onLoadMap = function(data) {

    if (Game.curGame != null && Game.curGame.queueLoadMap) {

      Game.curGame.queuedMap = data.mapid;
      Game.curGame.queuedChars = data.chars;
      return;
    }

    Game.loadMap(data.mapid, data.chars);
  };

  Connection.onInvalidMove = function(data) {

    var chr = Game.curGame.getPlayerChar();

    Connection.lastAckMove = data.ack;

    chr.x = data.x;
    chr.y = data.y;
    chr.walking = false;
    chr.walkingPerc = 0.0;
    chr.tick();

    Logger.log("Invalid move!");

    if (chr.freezeTicks < 5) {
      chr.freezeTicks = 5;
    }

  };

  Connection.onUpdate = function(data) {

    var cremoved, warp, _g, _g1, chars, i, charData, chr, m, warpFunc;

    if (Std["is"](data, String)) {
      data = JSON.parse(data);
    }

    if (Game.curGame == null) {
      return;
    }

    if (!Game.curGame.loaded) {
      return;
    }

    if (data.map !== Game.curGame.map.id) {
      return;
    }

    if (!data.chars) {
      data.chars = [];
    }

    if (!data.messages) {
      data.messages = [];
    }

    if (!data.cremoved) {
      data.cremoved = [];
    }

    if (!data.warpsUsed) {
      data.warpsUsed = [];
    }

    cremoved = data.cremoved;

    _g = 0;
    _g1 = data.warpsUsed;

    warpFunc = function(warp1) {

      var chr = Game.curGame.getCharByUsername(warp1.username);

      var tmpWarp = Entities.CWarp.getWarpByName(warp1.warpName);

      var animation = function() {

        chr.direction = warp1.direction;

        if (Std["is"](tmpWarp, Entities.CDoor)) {
          chr.enterDoor(tmpWarp);
        } else if (Std["is"](tmpWarp, Entities.CWarpArrow)) {
          chr.enterWarpArrow(tmpWarp);
        } else if (Std["is"](tmpWarp, Entities.CStairs)) {
          chr.enterStairs(tmpWarp);
        }
      };

      chr.canUpdate = false;

      if (chr.x !== warp1.x || chr.y !== warp1.y || chr.walking) {

        chr.targetX = warp1.x;
        chr.targetY = warp1.y;
        chr.onTarget = animation;

      } else {

        animation();
      }
    };

    while (_g < _g1.length) {

      warp = _g1[_g];
      ++_g;

      cremoved.remove(warp.username);

      if (warp.username === Game.username) {
        continue;
      }

      warpFunc(warp);
    }

    chars = data.chars;

    _g1 = 0;
    _g = chars.length;

    while (_g1 < _g) {

      i = _g1++;
      charData = chars[i];
      chr = Game.curGame.getCharByUsername(charData.username);

      if (chr !== null) {

        chr.update(charData);

      } else {

        chr = new CCharacter(charData);
      }
    }

    _g1 = 0;
    _g = cremoved.length;

    while (_g1 < _g) {

      i = _g1++;
      chr = Game.curGame.getCharByUsername(cremoved[i]);

      if (chr !== null) {
        chr.destroy();
      }

    }

    _g = 0;
    _g1 = data.messages;

    while (_g < _g1.length) {

      m = _g1[_g];
      ++_g;

      m.timestamp = Date.now().getTime();
      Chat.pushMessage(m);

    }

  };

  Connection.onBattleInit = function(data) {

    var battle = Game.curGame.initBattle(new Battle(data));
    var chr = Game.curGame.getPlayerChar();

    if (chr != null) {
      chr.inBattle = true;
      chr.battleEnemy = battle.enemyPokemon.id;
      chr.battleEnemyShiny = battle.enemyPokemon.shiny;
    }

    Renderer.startTransition(new Transitions.BattleTransition001()).step = -1;

  };

  Connection.onBattleWild = function() {};

  Connection.onBattleTurn = function(data) {

    Game.curGame.battle.resultQueue = Game.curGame.battle.resultQueue.concat(data.results);
    Game.curGame.battle.runQueue();
  };

  Connection.onLoginFail = function() {
    TitleScreen.loginFailed();
  };

  Connection.onNewGame = function(data) {
    Game.username = data.username;
    Renderer.startTransition(new Transitions.FadeOut(10)).onComplete = function() {
      TitleScreen.destroy();
      Game.state = GameState.ST_NEWGAME;
      NewGameScreen.init(data.starters, data.characters);
    };
  };

  Connection.onStartGame = function(data) {
    Game.username = data.username;
    Renderer.startTransition(new Transitions.FadeOut(10)).onComplete = function() {
      TitleScreen.destroy();
      Game.state = GameState.ST_UNKNOWN;
      Connection.socket.emit("startGame", {});
    };
  };

  Connection.prototype.__class__ = Connection;

  return Connection;
});