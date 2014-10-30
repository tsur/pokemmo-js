define(['jquery', 'socket', 'config/init', 'config/logger'], function($estr) {

  var GameState = {
    __ename__: ["pokemmo", "GameState"],
    __constructs__: ["ST_UNKNOWN", "ST_LOADING", "ST_MAP", "ST_DISCONNECTED", "ST_TITLE", "ST_NEWGAME", "ST_REGISTER"]
  };

  GameState.ST_UNKNOWN = ["ST_UNKNOWN", 0];
  GameState.ST_UNKNOWN.toString = $estr;
  GameState.ST_UNKNOWN.__enum__ = GameState;
  GameState.ST_LOADING = ["ST_LOADING", 1];
  GameState.ST_LOADING.toString = $estr;
  GameState.ST_LOADING.__enum__ = GameState;
  GameState.ST_MAP = ["ST_MAP", 2];
  GameState.ST_MAP.toString = $estr;
  GameState.ST_MAP.__enum__ = GameState;
  GameState.ST_DISCONNECTED = ["ST_DISCONNECTED", 3];
  GameState.ST_DISCONNECTED.toString = $estr;
  GameState.ST_DISCONNECTED.__enum__ = GameState;
  GameState.ST_TITLE = ["ST_TITLE", 4];
  GameState.ST_TITLE.toString = $estr;
  GameState.ST_TITLE.__enum__ = GameState;
  GameState.ST_NEWGAME = ["ST_NEWGAME", 5];
  GameState.ST_NEWGAME.toString = $estr;
  GameState.ST_NEWGAME.__enum__ = GameState;
  GameState.ST_REGISTER = ["ST_REGISTER", 6];
  GameState.ST_REGISTER.toString = $estr;
  GameState.ST_REGISTER.__enum__ = GameState;

  GameState.prototype.__class__ = GameState;

  return GameState;

});