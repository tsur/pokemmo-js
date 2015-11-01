(function (console, $global) { "use strict";
var $estr = function() { return js_Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = true;
EReg.prototype = {
	replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,__class__: EReg
};
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) i = 0;
	}
	while(i < len) {
		if(a[i] === obj) return i;
		i++;
	}
	return -1;
};
HxOverrides.remove = function(a,obj) {
	var i = HxOverrides.indexOf(a,obj,0);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var Lambda = function() { };
Lambda.__name__ = true;
Lambda.array = function(it) {
	var a = [];
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		a.push(i);
	}
	return a;
};
Lambda.map = function(it,f) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(f(x));
	}
	return l;
};
Lambda.has = function(it,elt) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(x == elt) return true;
	}
	return false;
};
var List = function() {
	this.length = 0;
};
List.__name__ = true;
List.prototype = {
	add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,iterator: function() {
		return new _$List_ListIterator(this.h);
	}
	,__class__: List
};
var _$List_ListIterator = function(head) {
	this.head = head;
	this.val = null;
};
_$List_ListIterator.__name__ = true;
_$List_ListIterator.prototype = {
	hasNext: function() {
		return this.head != null;
	}
	,next: function() {
		this.val = this.head[0];
		this.head = this.head[1];
		return this.val;
	}
	,__class__: _$List_ListIterator
};
Math.__name__ = true;
var Reflect = function() { };
Reflect.__name__ = true;
Reflect.setField = function(o,field,value) {
	o[field] = value;
};
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
};
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
var haxe_IMap = function() { };
haxe_IMap.__name__ = true;
var haxe_ds__$StringMap_StringMapIterator = function(map,keys) {
	this.map = map;
	this.keys = keys;
	this.index = 0;
	this.count = keys.length;
};
haxe_ds__$StringMap_StringMapIterator.__name__ = true;
haxe_ds__$StringMap_StringMapIterator.prototype = {
	hasNext: function() {
		return this.index < this.count;
	}
	,next: function() {
		return this.map.get(this.keys[this.index++]);
	}
	,__class__: haxe_ds__$StringMap_StringMapIterator
};
var haxe_ds_StringMap = function() {
	this.h = { };
};
haxe_ds_StringMap.__name__ = true;
haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
haxe_ds_StringMap.prototype = {
	set: function(key,value) {
		if(__map_reserved[key] != null) this.setReserved(key,value); else this.h[key] = value;
	}
	,get: function(key) {
		if(__map_reserved[key] != null) return this.getReserved(key);
		return this.h[key];
	}
	,exists: function(key) {
		if(__map_reserved[key] != null) return this.existsReserved(key);
		return this.h.hasOwnProperty(key);
	}
	,setReserved: function(key,value) {
		if(this.rh == null) this.rh = { };
		this.rh["$" + key] = value;
	}
	,getReserved: function(key) {
		if(this.rh == null) return null; else return this.rh["$" + key];
	}
	,existsReserved: function(key) {
		if(this.rh == null) return false;
		return this.rh.hasOwnProperty("$" + key);
	}
	,remove: function(key) {
		if(__map_reserved[key] != null) {
			key = "$" + key;
			if(this.rh == null || !this.rh.hasOwnProperty(key)) return false;
			delete(this.rh[key]);
			return true;
		} else {
			if(!this.h.hasOwnProperty(key)) return false;
			delete(this.h[key]);
			return true;
		}
	}
	,arrayKeys: function() {
		var out = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) out.push(key);
		}
		if(this.rh != null) {
			for( var key in this.rh ) {
			if(key.charCodeAt(0) == 36) out.push(key.substr(1));
			}
		}
		return out;
	}
	,iterator: function() {
		return new haxe_ds__$StringMap_StringMapIterator(this,this.arrayKeys());
	}
	,__class__: haxe_ds_StringMap
};
var haxe_io_Bytes = function(length,b) {
	this.length = length;
	this.b = b;
};
haxe_io_Bytes.__name__ = true;
haxe_io_Bytes.alloc = function(length) {
	return new haxe_io_Bytes(length,new Buffer(length));
};
haxe_io_Bytes.ofString = function(s) {
	var nb = new Buffer(s,"utf8");
	return new haxe_io_Bytes(nb.length,nb);
};
haxe_io_Bytes.ofData = function(b) {
	return new haxe_io_Bytes(b.length,b);
};
haxe_io_Bytes.prototype = {
	get: function(pos) {
		return this.b[pos];
	}
	,set: function(pos,v) {
		this.b[pos] = v;
	}
	,blit: function(pos,src,srcpos,len) {
		if(pos < 0 || srcpos < 0 || len < 0 || pos + len > this.length || srcpos + len > src.length) throw new js__$Boot_HaxeError(haxe_io_Error.OutsideBounds);
		src.b.copy(this.b,pos,srcpos,srcpos + len);
	}
	,sub: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) throw new js__$Boot_HaxeError(haxe_io_Error.OutsideBounds);
		var nb = new Buffer(len);
		var slice = this.b.slice(pos,pos + len);
		slice.copy(nb,0,0,len);
		return new haxe_io_Bytes(len,nb);
	}
	,compare: function(other) {
		var b1 = this.b;
		var b2 = other.b;
		var len;
		if(this.length < other.length) len = this.length; else len = other.length;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			if(b1[i] != b2[i]) return b1[i] - b2[i];
		}
		return this.length - other.length;
	}
	,getString: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) throw new js__$Boot_HaxeError(haxe_io_Error.OutsideBounds);
		var s = "";
		var b = this.b;
		var fcc = String.fromCharCode;
		var i = pos;
		var max = pos + len;
		while(i < max) {
			var c = b[i++];
			if(c < 128) {
				if(c == 0) break;
				s += fcc(c);
			} else if(c < 224) s += fcc((c & 63) << 6 | b[i++] & 127); else if(c < 240) {
				var c2 = b[i++];
				s += fcc((c & 31) << 12 | (c2 & 127) << 6 | b[i++] & 127);
			} else {
				var c21 = b[i++];
				var c3 = b[i++];
				s += fcc((c & 15) << 18 | (c21 & 127) << 12 | c3 << 6 & 127 | b[i++] & 127);
			}
		}
		return s;
	}
	,readString: function(pos,len) {
		return this.getString(pos,len);
	}
	,toString: function() {
		return this.getString(0,this.length);
	}
	,toHex: function() {
		var s_b = "";
		var chars = [];
		var str = "0123456789abcdef";
		var _g1 = 0;
		var _g = str.length;
		while(_g1 < _g) {
			var i = _g1++;
			chars.push(HxOverrides.cca(str,i));
		}
		var _g11 = 0;
		var _g2 = this.length;
		while(_g11 < _g2) {
			var i1 = _g11++;
			var c = this.b[i1];
			s_b += String.fromCharCode(chars[c >> 4]);
			s_b += String.fromCharCode(chars[c & 15]);
		}
		return s_b;
	}
	,getData: function() {
		return this.b;
	}
	,__class__: haxe_io_Bytes
};
var haxe_io_Error = { __ename__ : true, __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] };
haxe_io_Error.Blocked = ["Blocked",0];
haxe_io_Error.Blocked.toString = $estr;
haxe_io_Error.Blocked.__enum__ = haxe_io_Error;
haxe_io_Error.Overflow = ["Overflow",1];
haxe_io_Error.Overflow.toString = $estr;
haxe_io_Error.Overflow.__enum__ = haxe_io_Error;
haxe_io_Error.OutsideBounds = ["OutsideBounds",2];
haxe_io_Error.OutsideBounds.toString = $estr;
haxe_io_Error.OutsideBounds.__enum__ = haxe_io_Error;
haxe_io_Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe_io_Error; $x.toString = $estr; return $x; };
var js__$Boot_HaxeError = function(val) {
	Error.call(this);
	this.val = val;
	this.message = String(val);
	if(Error.captureStackTrace) Error.captureStackTrace(this,js__$Boot_HaxeError);
};
js__$Boot_HaxeError.__name__ = true;
js__$Boot_HaxeError.__super__ = Error;
js__$Boot_HaxeError.prototype = $extend(Error.prototype,{
	__class__: js__$Boot_HaxeError
});
var js_Boot = function() { };
js_Boot.__name__ = true;
js_Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else {
		var cl = o.__class__;
		if(cl != null) return cl;
		var name = js_Boot.__nativeClassName(o);
		if(name != null) return js_Boot.__resolveNativeClass(name);
		return null;
	}
};
js_Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str2 = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i1 = _g1++;
					if(i1 != 2) str2 += "," + js_Boot.__string_rec(o[i1],s); else str2 += js_Boot.__string_rec(o[i1],s);
				}
				return str2 + ")";
			}
			var l = o.length;
			var i;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js_Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js_Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js_Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js_Boot.__interfLoop(cc.__super__,cl);
};
js_Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Array:
		return (o instanceof Array) && o.__enum__ == null;
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) return true;
				if(js_Boot.__interfLoop(js_Boot.getClass(o),cl)) return true;
			} else if(typeof(cl) == "object" && js_Boot.__isNativeObj(cl)) {
				if(o instanceof cl) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
js_Boot.__cast = function(o,t) {
	if(js_Boot.__instanceof(o,t)) return o; else throw new js__$Boot_HaxeError("Cannot cast " + Std.string(o) + " to " + Std.string(t));
};
js_Boot.__nativeClassName = function(o) {
	var name = js_Boot.__toStr.call(o).slice(8,-1);
	if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") return null;
	return name;
};
js_Boot.__isNativeObj = function(o) {
	return js_Boot.__nativeClassName(o) != null;
};
js_Boot.__resolveNativeClass = function(name) {
	return $global[name];
};
var js_NodeC = function() { };
js_NodeC.__name__ = true;
var js_Node = function() { };
js_Node.__name__ = true;
js_Node.get_assert = function() {
	return js_Node.require("assert");
};
js_Node.get_child_process = function() {
	return js_Node.require("child_process");
};
js_Node.get_cluster = function() {
	return js_Node.require("cluster");
};
js_Node.get_crypto = function() {
	return js_Node.require("crypto");
};
js_Node.get_dgram = function() {
	return js_Node.require("dgram");
};
js_Node.get_dns = function() {
	return js_Node.require("dns");
};
js_Node.get_fs = function() {
	return js_Node.require("fs");
};
js_Node.get_http = function() {
	return js_Node.require("http");
};
js_Node.get_https = function() {
	return js_Node.require("https");
};
js_Node.get_net = function() {
	return js_Node.require("net");
};
js_Node.get_os = function() {
	return js_Node.require("os");
};
js_Node.get_path = function() {
	return js_Node.require("path");
};
js_Node.get_querystring = function() {
	return js_Node.require("querystring");
};
js_Node.get_repl = function() {
	return js_Node.require("repl");
};
js_Node.get_tls = function() {
	return js_Node.require("tls");
};
js_Node.get_url = function() {
	return js_Node.require("url");
};
js_Node.get_util = function() {
	return js_Node.require("util");
};
js_Node.get_vm = function() {
	return js_Node.require("vm");
};
js_Node.get_zlib = function() {
	return js_Node.require("zlib");
};
js_Node.get___filename = function() {
	return __filename;
};
js_Node.get___dirname = function() {
	return __dirname;
};
js_Node.get_json = function() {
	return JSON;
};
js_Node.newSocket = function(options) {
	return new js.Node.net.Socket(options);
};
js_Node.isNodeWebkit = function() {
	return (typeof process == "object");
};
var pokemmo_$s_Battle = function() {
	this.players = [];
	this.runAttempts = 0;
	this.results = [];
	this.ended = false;
	this.actionQueue = [];
	this.isTrainerBattle = true;
};
pokemmo_$s_Battle.__name__ = true;
pokemmo_$s_Battle.prototype = {
	init: function() {
		var _g2 = this;
		var _g = 0;
		var _g1 = this.players;
		while(_g < _g1.length) {
			var p = [_g1[_g]];
			++_g;
			if(p[0].id < Math.floor(this.players.length / 2)) p[0].team = 0; else p[0].team = 1;
			if(p[0].client == null) continue;
			p[0].client.socket.emit("battleInit",{ type : pokemmo_$s_Battle.BATTLE_WILD, x : p[0].client.character.x, y : p[0].client.character.y, id : p[0].id, team : p[0].team, info : { players : Lambda.array(Lambda.map(this.players,(function(p) {
				return function(otherPlayer) {
					return { pokemon : otherPlayer.pokemon.generateNetworkObject(otherPlayer == p[0])};
				};
			})(p)))}});
			p[0].client.socket.on("battleAction",p[0].fOnBattleAction = (function(p) {
				return function(data) {
					_g2.onBattleAction(p[0],data);
				};
			})(p));
			p[0].client.socket.on("battleLearnMove",p[0].fOnBattleLearnMove = (function(p) {
				return function(data1) {
					_g2.onBattleLearnMove(p[0],data1);
				};
			})(p));
		}
		this.initTurn();
	}
	,destroy: function() {
		this.ended = true;
		var _g = 0;
		var _g1 = this.players;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			if(p.client == null) continue;
			p.client.socket.removeListener("battleAction",p.fOnBattleAction);
			p.client.socket.removeListener("battleLearnMove",p.fOnBattleLearnMove);
		}
	}
	,win: function(team,transmit) {
		if(transmit == null) transmit = true;
		this.winnerTeam = team;
		this.ended = true;
		if(transmit) {
			this.pushResult(new pokemmo_$s_BattleActionResult(null,"win",this.winnerTeam));
			var _g = 0;
			var _g1 = this.players;
			while(_g < _g1.length) {
				var p = _g1[_g];
				++_g;
				this.finishBattleFor(p);
			}
		}
	}
	,pushResult: function(res) {
		if(res == null) return;
		if((res instanceof Array) && res.__enum__ == null) {
			var _g = 0;
			var _g1;
			_g1 = js_Boot.__cast(res , Array);
			while(_g < _g1.length) {
				var e = _g1[_g];
				++_g;
				this.pushResult(e);
			}
			return;
		}
		this.results.push(res);
	}
	,flushResults: function() {
		if(this.results.length == 0) return;
		var _g = 0;
		var _g1 = this.players;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			if(p.client == null) continue;
			var res = [];
			var _g2 = 0;
			var _g3 = this.results;
			while(_g2 < _g3.length) {
				var r = _g3[_g2];
				++_g2;
				var obj = r.generateNetworkObject(p);
				if(obj != null) res.push(obj);
			}
			p.client.socket.emit("battleTurn",{ results : res});
		}
		this.results.length = 0;
	}
	,initTurn: function() {
		if(this.ended) return;
		if(this.actionQueue.length > 0) {
			this.runQueue();
			this.flushResults();
		}
		var _g = 0;
		var _g1 = this.players;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			if(p.client != null) p.pendingAction = true; else {
				p.pendingAction = false;
				this.calculateAIAction(p);
			}
		}
	}
	,isTurnReady: function() {
		if(this.ended) return false;
		var _g = 0;
		var _g1 = this.players;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			if(p.pendingAction) return false;
		}
		return true;
	}
	,calculateAIAction: function(player) {
		var moves = player.pokemon.getUsableMoves();
		if(moves.length == 0) player.action = pokemmo_$s_BattleAction.TStruggle; else player.action = pokemmo_$s_BattleAction.TMove(pokemmo_$s_exts_ArrayExt.random(moves),[this.players[Math.floor((player.team == 0?1:0) * Math.floor(this.players.length / 2) + Math.floor(this.players.length / 2) * Math.random())]]);
	}
	,onBattleAction: function(player,data) {
		if(!player.pendingAction) return;
		if(player.pokemon == null || player.pokemon.hp <= 0) {
			if(data.type != "switchPokemon") return;
			return;
		}
		if(player.pokemon == null) return;
		var _g = data.type;
		switch(_g) {
		case "move":
			if(!js_Boot.__instanceof(data.move,Int)) return;
			var move = Math.floor(Math.abs(data.move) % 4);
			if(player.pokemon.movesPP[move] > 0) player.action = pokemmo_$s_BattleAction.TMove(player.pokemon.moves[move],[this.players[Math.floor((player.team == 0?1:0) * Math.floor(this.players.length / 2) + Math.floor(this.players.length / 2) * Math.random())]]); else player.action = pokemmo_$s_BattleAction.TStruggle;
			break;
		case "run":
			player.action = pokemmo_$s_BattleAction.TRun;
			break;
		default:
			return;
		}
		player.pendingAction = false;
		this.processTurn();
	}
	,onBattleLearnMove: function(player,data) {
		if(player.pokemon == null) return;
		if(!js_Boot.__instanceof(data.slot,Int)) return;
		if(!(typeof(data.move) == "string")) return;
		var move = data.move;
		var slot = data.slot;
		if(slot < 0 || slot >= 4) return;
		if(!Lambda.has(player.pokemon.battleStats.learnableMoves,move)) return;
		HxOverrides.remove(player.pokemon.battleStats.learnableMoves,move);
		player.pokemon.learnMove(slot,move);
	}
	,playerSurrendered: function(player) {
		this.win(player.team == 0?1:0,true);
	}
	,finishBattleFor: function(player) {
		var _g = this;
		if(player.client == null) return;
		var client = player.client;
		var $char = client.character;
		var socket = client.socket;
		var func = function(data) {
			$char.battle = null;
			$char.retransmit = true;
			if(player.team != _g.winnerTeam) {
				$char.moveToSpawn();
				$char.restorePokemon();
			}
			socket.emit("battleFinish",{ pokemon : $char.generatePokemonNetworkObject()});
		};
		if(client.disconnected) func(); else socket.once("battleFinished",func);
	}
	,processTurn: function() {
		if(this.actionQueue.length > 0) {
			this.runQueue();
			this.flushResults();
			this.initTurn();
		}
		if(!this.isTurnReady()) return;
		var turnOrder = this.players.slice();
		turnOrder.sort($bind(this,this.sortActions));
		var _g = 0;
		while(_g < turnOrder.length) {
			var p = turnOrder[_g];
			++_g;
			this.actionQueue.push(p);
		}
		this.runQueue();
		this.flushResults();
		this.initTurn();
	}
	,runQueue: function() {
		if(this.ended) return;
		var p;
		while(this.actionQueue.length > 0) {
			p = this.actionQueue.shift();
			this.processPlayerTurn(p);
			this.checkFainted();
			this.checkWin();
			if(this.ended) {
				this.flushResults();
				return;
			}
		}
	}
	,checkFainted: function() {
		var _g = 0;
		var _g1 = this.players;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			if(p.pokemon == null) continue;
			if(p.pokemon.hp > 0) continue;
			var exp = p.pokemon.calculateExpGain(this.isTrainerBattle);
			var killers = this.getPlayersFromTeam(p.team == 0?1:0);
			exp = Math.ceil(exp / killers.length);
			this.pushResult(new pokemmo_$s_BattleActionResult(p,"pokemonDefeated",exp));
			var _g2 = 0;
			while(_g2 < killers.length) {
				var killer = killers[_g2];
				++_g2;
				killer.pokemon.experience += exp;
				while(killer.pokemon.level < 100 && killer.pokemon.experience >= killer.pokemon.experienceNeeded) {
					killer.pokemon.experience -= killer.pokemon.experienceNeeded;
					var lvlup = killer.pokemon.levelUp();
					this.pushResult(new pokemmo_$s_BattleActionResult(killer,"pokemonLevelup",killer.pokemon.generateNetworkObject(true),true));
					if(lvlup.movesLearned.length > 0) this.pushResult(new pokemmo_$s_BattleActionResult(killer,"pokemonLearnedMove",lvlup.movesLearned));
				}
				if(killer.pokemon.battleStats.learnableMoves.length > 0) this.pushResult(new pokemmo_$s_BattleActionResult(killer,"pokemonLearnMoves",killer.pokemon.battleStats.learnableMoves,true));
			}
		}
	}
	,getPlayersFromTeam: function(t) {
		return this.players.slice(Math.floor(t * (this.players.length / 2)),Math.floor(this.players.length / 2));
	}
	,checkWin: function() {
		if(this.ended) return;
		var deadTeams = [true,true];
		var _g = 0;
		var _g1 = this.players;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			if(!deadTeams[p.team]) continue;
			var _g2 = 0;
			var _g3 = p.pokemonList;
			while(_g2 < _g3.length) {
				var pok = _g3[_g2];
				++_g2;
				if(pok.hp > 0) {
					deadTeams[p.team] = false;
					break;
				}
			}
		}
		if(deadTeams[0]) {
			if(deadTeams[1]) this.win(-1); else this.win(1);
		} else if(deadTeams[1]) this.win(0); else {
		}
	}
	,getPlayerEnemyTeam: function(p) {
		if(p.team == 0) return 1; else return 0;
	}
	,getRandomPlayerFromTeam: function(t) {
		return this.players[Math.floor(t * Math.floor(this.players.length / 2) + Math.floor(this.players.length / 2) * Math.random())];
	}
	,processPlayerTurn: function(p) {
		{
			var _g = p.action;
			switch(_g[1]) {
			case 0:
				var chance = p.pokemon.speed * 32 / (this.players[1].pokemon.speed / 4) + 30 * ++this.runAttempts;
				var success = Math.floor(Math.random() * 256) < chance;
				if(success) {
					this.win(p.team,false);
					this.finishBattleFor(p);
					this.destroy();
					this.pushResult(new pokemmo_$s_BattleActionResult(p,"flee"));
					this.flushResults();
				} else this.pushResult(new pokemmo_$s_BattleActionResult(p,"fleeFail"));
				break;
			case 1:
				var targets = _g[3];
				var move = _g[2];
				var _g1 = 0;
				while(_g1 < targets.length) {
					var i = targets[_g1];
					++_g1;
					this.processMove(p,i,move);
				}
				break;
			case 2:
				this.processMove(p,this.players[Math.floor((p.id + this.players.length / 2) % this.players.length)],"struggle");
				break;
			}
		}
	}
	,processMove: function(player,enemy,move) {
		var moveData = pokemmo_$s_GameData.movesData[move];
		if(moveData.moveType == "buff") moveData = pokemmo_$s_GameData.movesData.tackle;
		if(moveData.accuracy != -1) {
			if(Math.random() >= moveData.accuracy * (pokemmo_$s_Battle.accuracyMultipler[player.pokemon.battleStats.accuracy] / pokemmo_$s_Battle.accuracyMultipler[enemy.pokemon.battleStats.evasion])) {
				this.pushResult(new pokemmo_$s_BattleActionResult(player,"moveMiss",move));
				return;
			}
		}
		var _g = moveData.moveType;
		switch(_g) {
		case "simple":
			var obj = this.calculateDamage(player.pokemon,enemy.pokemon,moveData);
			enemy.pokemon.hp -= obj.damage;
			if(enemy.pokemon.hp < 0) enemy.pokemon.hp = 0;
			this.pushResult(new pokemmo_$s_BattleActionResult(player,"moveAttack",{ move : move, resultHp : enemy.pokemon.hp, isCritical : obj.isCritical, effec : obj.effect}));
			if(enemy.pokemon.hp > 0) {
				if(moveData.applyStatus != null) {
					if(Math.random() < (moveData.applyStatusChance == null?1.0:moveData.applyStatusChance)) {
						enemy.pokemon.status = moveData.applyStatus;
						this.pushResult(new pokemmo_$s_BattleActionResult(player,"applyStatus",moveData.applyStatus));
					}
				}
				if(moveData.debuffStat != null) {
					if(Math.random() < (moveData.debuffChance == null?1.0:moveData.debuffChance)) {
						var _g1 = 0;
						var _g2 = moveData.debuffStat.split(",");
						while(_g1 < _g2.length) {
							var s = _g2[_g1];
							++_g1;
							enemy.pokemon.buffBattleStat(s,-moveData.debuffAmount);
							this.pushResult(new pokemmo_$s_BattleActionResult(player,"debuff",{ stat : s}));
						}
					}
				}
			}
			return;
		case "debuff":
			var _g11 = 0;
			var _g21 = moveData.debuffStat.split(",");
			while(_g11 < _g21.length) {
				var s1 = _g21[_g11];
				++_g11;
				enemy.pokemon.buffBattleStat(s1,-moveData.debuffAmount);
			}
			this.pushResult(new pokemmo_$s_BattleActionResult(player,"moveDebuff",{ stat : moveData.debuffStat, move : move}));
			break;
		case "applyStatus":
			enemy.pokemon.status = moveData.applyStatus;
			this.pushResult(new pokemmo_$s_BattleActionResult(player,"moveAttack",{ move : moveData.name, resultHp : enemy.pokemon.hp, isCritical : false, effec : 1}));
			this.pushResult(new pokemmo_$s_BattleActionResult(player,"applyStatus",moveData.applyStatus));
			return;
		}
	}
	,calculateDamage: function(pokemon,enemyPokemon,data) {
		var isMoveSpecial = !(!data.special);
		var attackerAtk;
		var defenderDef;
		if(isMoveSpecial) {
			attackerAtk = pokemon.spAtk * pokemmo_$s_Battle.powerMultipler[pokemon.battleStats.spAtkPower];
			defenderDef = enemyPokemon.spDef * pokemmo_$s_Battle.powerMultipler[enemyPokemon.battleStats.spDefPower];
		} else {
			attackerAtk = pokemon.atk * pokemmo_$s_Battle.powerMultipler[pokemon.battleStats.atkPower];
			defenderDef = enemyPokemon.def * pokemmo_$s_Battle.powerMultipler[enemyPokemon.battleStats.defPower];
		}
		if(pokemon.status == 5) attackerAtk /= 2;
		var damage = (2 * pokemon.level + 10) / 250 * (attackerAtk / defenderDef) * data.power + 2;
		var modifier = 1.0;
		if(data.type == pokemmo_$s_GameData.pokemonData[pokemon.id].type1 || data.type == pokemmo_$s_GameData.pokemonData[pokemon.id].type2) modifier *= 1.5;
		var typeEffectiveness = 1.0;
		typeEffectiveness *= pokemmo_$s_GameData.getTypeEffectiveness(data.type,pokemmo_$s_GameData.pokemonData[enemyPokemon.id].type1);
		typeEffectiveness *= pokemmo_$s_GameData.getTypeEffectiveness(data.type,pokemmo_$s_GameData.pokemonData[enemyPokemon.id].type2);
		modifier *= typeEffectiveness;
		var criticalChance = [0,0.065,0.125,0.25,0.333,0.5];
		var criticalStage = 1;
		if(data.highCritical) criticalStage += 2;
		if(criticalStage > 5) criticalStage = 5;
		var isCritical = Math.random() < criticalChance[criticalStage];
		if(isCritical) modifier *= 2;
		modifier *= 1.0 - Math.random() * 0.15;
		return { damage : Math.ceil(damage * modifier), isCritical : isCritical, effect : typeEffectiveness};
	}
	,addPlayer: function(client,pokemonList) {
		var pok = pokemonList[0];
		var _g = 0;
		while(_g < pokemonList.length) {
			var p = pokemonList[_g];
			++_g;
			if(p.hp <= 0) continue;
			pok = p;
			break;
		}
		var _g1 = 0;
		while(_g1 < pokemonList.length) {
			var p1 = pokemonList[_g1];
			++_g1;
			p1.resetBattleStats();
		}
		if(client != null) {
			client.character.battle = this;
			client.character.retransmit = true;
		}
		var bp = { id : this.players.length, team : -1, client : client, pokemon : pok, pokemonList : pokemonList, pendingAction : true, action : null, fOnBattleAction : null, fOnBattleLearnMove : null};
		this.players.push(bp);
		return bp;
	}
	,sortActions: function(a,b) {
		var ap = this.getActionPriority(a.action);
		var bp = this.getActionPriority(b.action);
		if(ap > bp) return -1; else if(bp > ap) return 1;
		if(a.pokemon.speed * pokemmo_$s_Battle.powerMultipler[a.pokemon.battleStats.speedPower] >= b.pokemon.speed * pokemmo_$s_Battle.powerMultipler[b.pokemon.battleStats.speedPower]) return -1; else return 1;
	}
	,getActionPriority: function(action) {
		if(action == null) return 0;
		switch(action[1]) {
		case 0:
			return 6;
		case 1:
			var target = action[3];
			var move = action[2];
			var p = pokemmo_$s_GameData.movesData[move].priority;
			if(p == null) return 0;
			return p;
		default:
			return 0;
		}
	}
	,getPlayerOfClient: function(client) {
		var _g = 0;
		var _g1 = this.players;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			if(p.client == client) return p;
		}
		return null;
	}
	,isOpponent: function(p1,p2) {
		return true;
	}
	,__class__: pokemmo_$s_Battle
};
var pokemmo_$s_BattleAction = { __ename__ : true, __constructs__ : ["TRun","TMove","TStruggle"] };
pokemmo_$s_BattleAction.TRun = ["TRun",0];
pokemmo_$s_BattleAction.TRun.toString = $estr;
pokemmo_$s_BattleAction.TRun.__enum__ = pokemmo_$s_BattleAction;
pokemmo_$s_BattleAction.TMove = function(move,targets) { var $x = ["TMove",1,move,targets]; $x.__enum__ = pokemmo_$s_BattleAction; $x.toString = $estr; return $x; };
pokemmo_$s_BattleAction.TStruggle = ["TStruggle",2];
pokemmo_$s_BattleAction.TStruggle.toString = $estr;
pokemmo_$s_BattleAction.TStruggle.__enum__ = pokemmo_$s_BattleAction;
var pokemmo_$s_BattleActionResult = function(player,type,value,broadcastOnlyToPlayer) {
	if(broadcastOnlyToPlayer == null) broadcastOnlyToPlayer = false;
	this.player = player;
	this.type = type;
	this.value = value;
	this.broadcastOnlyToPlayer = broadcastOnlyToPlayer;
};
pokemmo_$s_BattleActionResult.__name__ = true;
pokemmo_$s_BattleActionResult.prototype = {
	generateNetworkObject: function(p) {
		if(this.broadcastOnlyToPlayer && this.player != p) return null;
		return { player : this.player != null?this.player.id:null, type : this.type, value : Reflect.isFunction(this.value)?this.value(this,p):this.value};
	}
	,__class__: pokemmo_$s_BattleActionResult
};
var pokemmo_$s_BattleWild = function(client,wildPokemon) {
	pokemmo_$s_Battle.call(this);
	this.isTrainerBattle = false;
	this.addPlayer(client,client.character.pokemon);
	this.addPlayer(null,[wildPokemon]);
};
pokemmo_$s_BattleWild.__name__ = true;
pokemmo_$s_BattleWild.__super__ = pokemmo_$s_Battle;
pokemmo_$s_BattleWild.prototype = $extend(pokemmo_$s_Battle.prototype,{
	destroy: function() {
		pokemmo_$s_Battle.prototype.destroy.call(this);
	}
	,initTurn: function() {
		pokemmo_$s_Battle.prototype.initTurn.call(this);
	}
	,__class__: pokemmo_$s_BattleWild
});
var pokemmo_$s_Client = function(socket) {
	this.socket = socket;
	this.disconnected = false;
	socket.on("login",$bind(this,this.msg_login));
};
pokemmo_$s_Client.__name__ = true;
pokemmo_$s_Client.prototype = {
	initCharacter: function(save) {
		this.character = new pokemmo_$s_ClientCharacter(this,save);
	}
	,msg_login: function(data) {
		var _g = this;
		if(!(typeof(data.username) == "string" && typeof(data.password) == "string")) {
			this.socket.emit("loginFail","invalidData");
			return;
		}
		if(pokemmo_$s_GameServer.clients.length > 200) {
			console.log("Refusing client, server is full");
			this.socket.emit("loginFail","serverFull");
			return;
		}
		pokemmo_$s_MasterConnector.loginUser(data.username,data.password,function(result,username) {
			if(result != "success") {
				_g.socket.emit("loginFail",result);
				return;
			}
			_g.username = username;
			if(pokemmo_$s_GameData.adminsData[username] == null) _g.accountLevel = 0; else _g.accountLevel = pokemmo_$s_GameData.adminsData[username].level;
			_g.socket.on("disconnect",$bind(_g,_g.onDisconnect));
			pokemmo_$s_MasterConnector.loadCharacter(username,function(success,save) {
				if(!success) {
					_g.socket.emit("loginFail","internalError");
					return;
				}
				if(save == null) {
					_g.newAccount = true;
					_g.socket.emit("newGame",{ username : username, starters : pokemmo_$s_ServerConst.pokemonStarters, characters : pokemmo_$s_ServerConst.characterSprites});
					_g.socket.on("newGame",$bind(_g,_g.e_newGame));
				} else {
					_g.socket.emit("startGame",{ username : username});
					_g.socket.on("startGame",function(data1) {
						_g.initCharacter(save);
					});
				}
			});
		});
	}
	,kick: function() {
		if(this.character != null) this.character.disconnect(); else {
			this.socket.disconnect();
			this.onDisconnect();
		}
	}
	,onDisconnect: function(data) {
		if(this.disconnected) return;
		this.disconnected = true;
		pokemmo_$s_MasterConnector.disconnectUser(this.username);
	}
	,e_newGame: function(data) {
		if(!this.newAccount) return;
		if(!(typeof(data.starter) == "string" && typeof(data.character) == "string")) return;
		if((function($this) {
			var $r;
			var x = data.starter;
			$r = HxOverrides.indexOf(pokemmo_$s_ServerConst.pokemonStarters,x,0);
			return $r;
		}(this)) == -1 || (function($this) {
			var $r;
			var x1 = data.character;
			$r = HxOverrides.indexOf(pokemmo_$s_ServerConst.characterSprites,x1,0);
			return $r;
		}(this)) == -1) return;
		this.newAccount = false;
		this.initCharacter({ map : "pallet_hero_home_2f", x : 1, y : 3, direction : 0, charType : data.character, money : 0, playerVars : { }, respawnLocation : { mapName : "pallet_hero_home_2f", x : 1, y : 3, direction : 0}, pokemon : [new pokemmo_$s_Pokemon().createWild(data.starter,5).generateSave()]});
	}
	,__class__: pokemmo_$s_Client
};
var pokemmo_$s_ClientCharacter = function(client,save) {
	var _g = this;
	this.client = client;
	this.speedHackChecks = [];
	this.lastMessage = 0;
	this.surfing = false;
	this.usingBike = false;
	this.retransmit = true;
	this.money = save.money;
	this.pokemon = [];
	var _g1 = 0;
	var _g11 = save.pokemon;
	while(_g1 < _g11.length) {
		var psave = _g11[_g1];
		++_g1;
		this.pokemon.push(new pokemmo_$s_Pokemon().loadFromSave(psave));
	}
	this.playerVars = save.playerVars;
	this.type = save.charType;
	this.respawnLocation = save.respawnLocation;
	client.socket.emit("setInfo",{ pokemon : this.generatePokemonNetworkObject(), accountLevel : client.accountLevel});
	this.warp(save.map,save.x,save.y,save.direction);
	client.socket.on("disconnect",$bind(this,this.e_disconnect));
	client.socket.on("walk",$bind(this,this.e_walk));
	client.socket.on("useLedge",$bind(this,this.e_useLedge));
	client.socket.on("turn",$bind(this,this.e_turn));
	client.socket.on("sendMessage",$bind(this,this.e_sendMessage));
	client.socket.on("useWarp",$bind(this,this.e_useWarp));
	if(client.accountLevel >= 30) client.socket.on("kickPlayer",function(data) {
		pokemmo_$s_GameServer.kickPlayer(data.username);
	});
	if(client.accountLevel >= 70) {
		client.socket.on("adminSetPokemon",function(data1) {
			if(pokemmo_$s_GameData.pokemonData[data1.id] == null) return;
			_g.pokemon[0].id = data1.id;
			_g.retransmit = true;
		});
		client.socket.on("adminSetLevel",function(data2) {
			if(!js_Boot.__instanceof(data2.level,Int)) return;
			var n = data2.level;
			if(n != n) return;
			if(n < 2) return;
			if(n > n) return;
			_g.pokemon[0].level = n;
			_g.pokemon[0].calculateStats();
			_g.retransmit = true;
		});
		client.socket.on("adminTestLevelup",function(data3) {
			_g.pokemon[0].experience = _g.pokemon[0].experienceNeeded - 1;
		});
		client.socket.on("adminTeleport",function(data4) {
			_g.warp(data4.map,data4.x,data4.y,data4.dir || 0);
		});
	}
};
pokemmo_$s_ClientCharacter.__name__ = true;
pokemmo_$s_ClientCharacter.filterChatText = function(str) {
	if(pokemmo_$s_ClientCharacter.chatFilterRegex == null) pokemmo_$s_ClientCharacter.chatFilterRegex = new EReg("[^\\u0020-\\u007F\\u0080-\\u00FF]","");
	return pokemmo_$s_ClientCharacter.chatFilterRegex.replace(str,"");
};
pokemmo_$s_ClientCharacter.prototype = {
	disconnect: function() {
		this.onDisconnect();
		this.client.socket.disconnect();
	}
	,onDisconnect: function() {
		if(this.disconnected) return;
		this.disconnected = true;
		if(this.battle != null) this.battle.playerSurrendered(this.battle.getPlayerOfClient(this.client));
		pokemmo_$s_MasterConnector.saveCharacter(this.client.username,this.generateCharacterSave());
		this.mapInstance.removeChar(this);
		this.client.onDisconnect();
	}
	,e_disconnect: function(data) {
		this.onDisconnect();
	}
	,generateCharacterSave: function() {
		return { map : this.mapInstance.map.id, x : this.x, y : this.y, direction : this.direction, charType : this.type, pokemon : Lambda.array(Lambda.map(this.pokemon,function(p) {
			return p.generateSave();
		})), respawnLocation : this.respawnLocation, money : this.money, playerVars : this.playerVars};
	}
	,generateNetworkObject: function() {
		return { username : this.client.username, inBattle : this.battle != null, x : this.x, y : this.y, lastX : this.lastX, lastY : this.lastY, type : this.type, direction : this.direction, follower : this.pokemon[0].id, folShiny : this.pokemon[0].shiny};
	}
	,generatePokemonNetworkObject: function() {
		var arr = [];
		var _g = 0;
		var _g1 = this.pokemon;
		while(_g < _g1.length) {
			var i = _g1[_g];
			++_g;
			arr.push(i.generateNetworkObject(true));
		}
		return arr;
	}
	,putInMap: function(str) {
		var map = pokemmo_$s_GameData.maps[str];
		if(map == null) return;
		if(this.mapInstance != null) this.mapInstance.removeChar(this);
		var $it0 = map.instances.iterator();
		while( $it0.hasNext() ) {
			var i = $it0.next();
			if(map.playersPerInstance > 0 && i.chars.length >= map.playersPerInstance) continue;
			i.addChar(this);
			this.mapInstance = i;
			return;
		}
		this.mapInstance = map.createInstance();
		this.mapInstance.addChar(this);
	}
	,warp: function(map,x,y,dir) {
		if(dir == null) dir = 0;
		this.x = x;
		this.y = y;
		this.direction = dir;
		this.putInMap(map);
		this.lastX = x;
		this.lastY = y;
		this.retransmit = true;
		this.client.socket.emit("loadMap",{ mapid : map, chars : this.mapInstance.generateFullCharNetworkObject()});
	}
	,warpToLocation: function(loc) {
		this.warp(loc.mapName,loc.x,loc.y,loc.direction);
	}
	,restorePokemon: function() {
		var _g = 0;
		var _g1 = this.pokemon;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			p.restore();
		}
	}
	,moveToSpawn: function() {
		this.warpToLocation(this.respawnLocation);
	}
	,sendInvalidMove: function() {
		this.lastAckMove = Math.floor(new Date().getTime() * 1000 + Math.random() * 1000);
		this.client.socket.emit("invalidMove",{ ack : this.lastAckMove, x : this.x, y : this.y});
	}
	,onWalk: function() {
		if(this.battle != null) return;
		var destSolid = this.mapInstance.map.solidData[this.x][this.y];
		this.retransmit = true;
		if(this.speedHackChecks.length >= 12) this.speedHackChecks.shift();
		this.speedHackChecks.push(new Date().getTime());
		if(this.speedHackChecks.length >= 12) {
			var avgWalkTime = 0.0;
			var _g = 1;
			while(_g < 12) {
				var i = _g++;
				avgWalkTime += this.speedHackChecks[i] - this.speedHackChecks[i - 1];
			}
			avgWalkTime /= 11;
			if(avgWalkTime < 200) {
				console.log("Speed hack detected, kicking client " + this.client.username);
				this.disconnect();
				return;
			}
		}
		var encounterAreas = this.mapInstance.map.getEncounterAreasAt(this.x,this.y);
		var _g1 = 0;
		while(_g1 < encounterAreas.length) {
			var area = encounterAreas[_g1];
			++_g1;
			if(this.checkEncounters(area.encounters)) return;
		}
		if(destSolid == 7 && this.mapInstance.map.grassEncounters != null) {
			if(this.checkEncounters(this.mapInstance.map.grassEncounters)) return;
		}
	}
	,checkEncounters: function(encounters) {
		if(Math.random() > 0.0540540540540540571) return false;
		var chance = 0.0;
		var n = Math.random();
		var _g = 0;
		while(_g < encounters.length) {
			var encounter = encounters[_g];
			++_g;
			if(n >= (chance += encounter.chance)) continue;
			var level = pokemmo_$s_Utils.randInt(encounter.min_level,encounter.max_level);
			var enemy = encounter.id;
			this.battle = new pokemmo_$s_BattleWild(this.client,new pokemmo_$s_Pokemon().createWild(enemy,level));
			this.battle.init();
			return true;
		}
		return false;
	}
	,canWalkOnTileType: function(type) {
		if(this.surfing) return type == 2; else return type == 0 || type == 7;
	}
	,e_walk: function(data) {
		if(this.battle != null) return;
		if(!(js_Boot.__instanceof(data.x,Int) && js_Boot.__instanceof(data.y,Int) && js_Boot.__instanceof(data.dir,Int))) return;
		if(data.x < 0 || data.x >= this.mapInstance.map.width) return;
		if(data.y < 0 || data.y >= this.mapInstance.map.height) return;
		var destSolid = this.mapInstance.map.solidData[data.x][data.y];
		if(destSolid == null) return;
		var invalidMove = false;
		this.direction = Math.floor(Math.abs(data.dir) % 4);
		if(!(this.surfing?destSolid == 2:destSolid == 0 || destSolid == 7)) invalidMove = true; else if(this.x - 1 == data.x && this.y == data.y) {
			this.lastX = this.x;
			this.lastY = this.y;
			this.x -= 1;
			this.direction = 1;
			this.onWalk();
		} else if(this.x + 1 == data.x && this.y == data.y) {
			this.lastX = this.x;
			this.lastY = this.y;
			this.x += 1;
			this.direction = 3;
			this.onWalk();
		} else if(this.x == data.x && this.y - 1 == data.y) {
			this.lastX = this.x;
			this.lastY = this.y;
			this.y -= 1;
			this.direction = 2;
			this.onWalk();
		} else if(this.x == data.x && this.y + 1 == data.y) {
			this.lastX = this.x;
			this.lastY = this.y;
			this.y += 1;
			this.direction = 0;
			this.onWalk();
		} else invalidMove = true;
		if(invalidMove) this.sendInvalidMove();
	}
	,e_useLedge: function(data) {
		if(this.battle != null) return;
		if(!(js_Boot.__instanceof(data.x,Int) && js_Boot.__instanceof(data.y,Int))) return;
		if(data.x < 0 || data.x >= this.mapInstance.map.width) return;
		if(data.y < 0 || data.y >= this.mapInstance.map.height) return;
		var destSolid = this.mapInstance.map.solidData[data.x][data.y];
		if(destSolid == null) return;
		switch(destSolid) {
		case 3:
			if(this.x != data.x || this.y + 1 != data.y) {
				this.sendInvalidMove();
				return;
			}
			this.direction = 0;
			this.y += 2;
			this.lastY = this.y;
			this.retransmit = true;
			break;
		case 4:
			if(this.x - 1 != data.x || this.y != data.y) {
				this.sendInvalidMove();
				return;
			}
			this.direction = 1;
			this.x -= 2;
			this.lastX = this.x;
			this.retransmit = true;
			break;
		case 5:
			if(this.x != data.x || this.y - 1 != data.y) {
				this.sendInvalidMove();
				return;
			}
			this.direction = 2;
			this.y -= 2;
			this.lastY = this.y;
			this.retransmit = true;
			break;
		case 6:
			if(this.x + 1 != data.x || this.y != data.y) {
				this.sendInvalidMove();
				return;
			}
			this.direction = 3;
			this.x += 2;
			this.lastX = this.x;
			this.retransmit = true;
			break;
		}
	}
	,e_turn: function(data) {
		if(this.battle != null) return;
		if(!js_Boot.__instanceof(data.dir,Int)) return;
		this.direction = Math.floor(Math.abs(data.dir) % 4);
		this.retransmit = true;
	}
	,e_sendMessage: function(data) {
		if(!(typeof(data.str) == "string")) return;
		var t = new Date().getTime();
		if(t - this.lastMessage < 100) return;
		var str = pokemmo_$s_ClientCharacter.filterChatText(data.str.substr(0,128));
		if(str.length == 0) return;
		this.mapInstance.messages.push({ username : this.client.username, str : str, x : this.x, y : this.y});
		this.lastMessage = t;
	}
	,e_useWarp: function(data) {
		var warp = this.mapInstance.map.getWarp(data.name);
		if(warp == null) return;
		if(Math.abs(warp.x - this.x) + Math.abs(warp.y - this.y) > 1) return;
		this.mapInstance.warpsUsed.push({ username : this.client.username, warpName : data.name, x : this.x, y : this.y, direction : this.direction});
		this.warpToLocation(warp.destination);
	}
	,__class__: pokemmo_$s_ClientCharacter
};
var pokemmo_$s_GameConst = function() { };
pokemmo_$s_GameConst.__name__ = true;
var pokemmo_$s_GameData = function() { };
pokemmo_$s_GameData.__name__ = true;
pokemmo_$s_GameData.init = function() {
	var sStart;
	var options = { };
	options.encoding = "utf8";
	sStart = new Date().getTime();
	pokemmo_$s_GameData.pokemonData = pokemmo_$s_Utils.recursiveFreeze(js_Node.parse(new EReg("//[^\n\r]*","gm").replace(js_Node.require("fs").readFileSync("public/assets/data/pokemon.json",options),"")));
	pokemmo_$s_Main.log("Loaded pokemon in " + (new Date().getTime() - sStart) + " ms");
	pokemmo_$s_GameData.movesData = pokemmo_$s_Utils.recursiveFreeze(js_Node.parse(new EReg("//[^\n\r]*","gm").replace(js_Node.require("fs").readFileSync("public/assets/data/moves.json",options),"")));
	pokemmo_$s_GameData.typeData = pokemmo_$s_Utils.recursiveFreeze(js_Node.parse(js_Node.require("fs").readFileSync("public/assets/data/types.json",options)));
	pokemmo_$s_GameData.adminsData = pokemmo_$s_Utils.recursiveFreeze(js_Node.parse(js_Node.require("fs").readFileSync("public/assets/data/admins.json",options)));
	pokemmo_$s_GameData.experienceRequired = pokemmo_$s_Utils.recursiveFreeze(js_Node.parse(js_Node.require("fs").readFileSync("public/assets/data/experienceRequired.json",options)).experienceRequired);
	pokemmo_$s_GameData.maps = { };
	pokemmo_$s_GameData.mapsInstaces = [];
	var _g = 0;
	var _g1 = pokemmo_$s_GameConst.LOAD_MAPS;
	while(_g < _g1.length) {
		var id = _g1[_g];
		++_g;
		Reflect.setField(pokemmo_$s_GameData.maps,id,new pokemmo_$s_GameMap(id));
	}
};
pokemmo_$s_GameData.getAdminLevel = function(username) {
	if(pokemmo_$s_GameData.adminsData[username] == null) return 0; else return pokemmo_$s_GameData.adminsData[username].level;
};
pokemmo_$s_GameData.getPokemonData = function(id) {
	return pokemmo_$s_GameData.pokemonData[id];
};
pokemmo_$s_GameData.getMoveData = function(move) {
	return pokemmo_$s_GameData.movesData[move];
};
pokemmo_$s_GameData.getExperienceRequired = function(curve,level) {
	return pokemmo_$s_GameData.experienceRequired[level][pokemmo_$s_GameData.curveIdToInt(curve)];
};
pokemmo_$s_GameData.curveIdToInt = function(curve) {
	switch(curve) {
	case "erratic":
		return 0;
	case "fast":
		return 1;
	case "mediumFast":
		return 2;
	case "mediumSlow":
		return 3;
	case "slow":
		return 4;
	case "fluctuating":
		return 5;
	}
	throw new js__$Boot_HaxeError("Invalid curve id: " + curve);
};
pokemmo_$s_GameData.getMap = function(id) {
	return pokemmo_$s_GameData.maps[id];
};
pokemmo_$s_GameData.getTypeEffectiveness = function(type,other) {
	if(type == null || other == null) return 1.0;
	if(pokemmo_$s_GameData.typeData[type][other] == null) return 1.0;
	return pokemmo_$s_GameData.typeData[type][other];
};
var pokemmo_$s_GameMap = function(id) {
	this.id = id;
	this.numInstances = 0;
	js_Node.process.stdout.write("Loading: " + id + "...");
	var sStart = new Date().getTime();
	var options = { };
	options.encoding = "utf8";
	this.encounterAreas = [];
	this.warps = new haxe_ds_StringMap();
	this.points = new haxe_ds_StringMap();
	this.instances = new haxe_ds_StringMap();
	this.data = js_Node.parse(js_Node.require("fs").readFileSync("public/assets/resources/maps/" + id + ".json",options));
	this.width = this.data.width;
	this.height = this.data.height;
	if(this.data.properties.players_per_instance == null) this.playersPerInstance = 0; else this.playersPerInstance = Std.parseInt(this.data.properties.players_per_instance);
	if(this.data.properties.grass_encounters != null) this.grassEncounters = js_Node.parse("{\"tmp\":[" + this.data.properties.grass_encounters + "]}").tmp;
	var _g = 0;
	var _g1 = this.data.layers;
	while(_g < _g1.length) {
		var layer = _g1[_g];
		++_g;
		if(layer.type == "tilelayer") {
			if(layer.properties == null || layer.properties.data_layer != "1") continue;
			var j = 0;
			var twidth = this.data.width;
			var theight = this.data.height;
			this.solidData = new Array(twidth);
			var _g2 = 0;
			while(_g2 < twidth) {
				var x = _g2++;
				this.solidData[x] = new Array(theight);
				var _g3 = 0;
				while(_g3 < theight) {
					var y = _g3++;
					this.solidData[x][y] = 0;
				}
			}
			var _g21 = 0;
			while(_g21 < theight) {
				var y1 = _g21++;
				var _g31 = 0;
				while(_g31 < twidth) {
					var x1 = _g31++;
					var tileid = layer.data[j];
					if(tileid == null || tileid == 0) {
						++j;
						continue;
					}
					var tileset = this.getTilesetOfTile(tileid);
					if(tileset == null) "Tileset is null";
					var curTilesetTileid = tileid - tileset.firstgid;
					if(tileset.tileproperties[curTilesetTileid] != null) {
						if(tileset.tileproperties[curTilesetTileid].solid == "1") this.solidData[x1][y1] = 1; else if(tileset.tileproperties[curTilesetTileid].water == "1") this.solidData[x1][y1] = 2; else if(tileset.tileproperties[curTilesetTileid].grass == "1") this.solidData[x1][y1] = 7; else if(tileset.tileproperties[curTilesetTileid].ledge == "1") {
							this.solidData[x1][y1] = 3;
							if(tileset.tileproperties[curTilesetTileid].ledge_dir == "1") this.solidData[x1][y1] = 4; else if(tileset.tileproperties[curTilesetTileid].ledge_dir == "2") this.solidData[x1][y1] = 5; else if(tileset.tileproperties[curTilesetTileid].ledge_dir == "3") this.solidData[x1][y1] = 6;
						}
					}
					++j;
				}
			}
		} else if(layer.type == "objectgroup") {
			var _g22 = 0;
			var _g32 = layer.objects;
			while(_g22 < _g32.length) {
				var obj = _g32[_g22];
				++_g22;
				var x11 = Math.round(obj.x / this.data.tilewidth);
				var y11 = Math.round(obj.y / this.data.tileheight);
				var x2 = Math.round((obj.x + obj.width) / this.data.tilewidth);
				var y2 = Math.round((obj.y + obj.height) / this.data.tileheight);
				var _g4 = obj.type;
				switch(_g4) {
				case "tall_grass":
					var encounters = js_Node.parse("{\"tmp\":[" + Std.string(obj.properties.encounters) + "]}").tmp;
					this.encounterAreas.push({ x1 : x11, y1 : y11, x2 : x2, y2 : y2, encounters : encounters});
					break;
				case "warp":
					var value = { x : x11, y : y11, type : obj.properties.type, destination : js_Node.parse(obj.properties.destination)};
					this.warps.set(obj.name,value);
					break;
				case "point":
					this.points.set(obj.name,{ mapName : id, x : x11, y : y11, direction : obj.properties.direction == null?0:obj.properties.direction});
					break;
				}
			}
		}
	}
	if(this.solidData == null) console.warn("Couldn't find data layer!");
	var sEnd = new Date().getTime();
	js_Node.process.stdout.write(" (" + (sEnd - sStart) + " ms)\n");
};
pokemmo_$s_GameMap.__name__ = true;
pokemmo_$s_GameMap.prototype = {
	getEncounterAreasAt: function(x,y) {
		var arr = [];
		var _g = 0;
		var _g1 = this.encounterAreas;
		while(_g < _g1.length) {
			var e = _g1[_g];
			++_g;
			if(x >= e.x1 && y >= e.y1 && x < e.x2 && y < e.y2) arr.push(e);
		}
		return arr;
	}
	,createInstance: function() {
		var id;
		do id = pokemmo_$s_Utils.createRandomString(6); while(this.instances.exists(id));
		var i = new pokemmo_$s_MapInstance(this,id);
		this.instances.set(id,i);
		return i;
	}
	,getTilesetOfTile: function(n) {
		var i = this.data.tilesets.length;
		while(i-- > 0) if(n >= this.data.tilesets[i].firstgid) return this.data.tilesets[i];
		return null;
	}
	,getWarp: function(name) {
		return this.warps.get(name);
	}
	,__class__: pokemmo_$s_GameMap
};
var pokemmo_$s_GameServer = function() { };
pokemmo_$s_GameServer.__name__ = true;
pokemmo_$s_GameServer.start = function() {
	pokemmo_$s_GameServer.clients = [];
	var io = js_Node.require("socket.io").listen(2828).set("close timeout",0).set("log level",3);
	io.sockets.on("connection",function(socket) {
		pokemmo_$s_GameServer.clients.push(new pokemmo_$s_Client(socket));
	});
	js_Node.setInterval(pokemmo_$s_GameServer.sendUpdates,250);
};
pokemmo_$s_GameServer.kickPlayer = function(username) {
	var _g = 0;
	var _g1 = pokemmo_$s_GameServer.clients;
	while(_g < _g1.length) {
		var c = _g1[_g];
		++_g;
		if(c.username == username) c.kick();
	}
};
pokemmo_$s_GameServer.sendUpdates = function() {
	var _g = 0;
	var _g1 = pokemmo_$s_GameData.mapsInstaces;
	while(_g < _g1.length) {
		var ins = _g1[_g];
		++_g;
		if(ins.chars.length == 0) continue;
		var d = ins.generateNetworkObjectData();
		var _g2 = 0;
		var _g3 = ins.chars;
		while(_g2 < _g3.length) {
			var c = _g3[_g2];
			++_g2;
			c.client.socket["volatile"].emit("update",d);
		}
	}
};
pokemmo_$s_GameServer.getClientCount = function() {
	return pokemmo_$s_GameServer.clients.length;
};
var pokemmo_$s_MacroUtils = function() { };
pokemmo_$s_MacroUtils.__name__ = true;
var pokemmo_$s_Main = function() { };
pokemmo_$s_Main.__name__ = true;
pokemmo_$s_Main.main = function() {
	pokemmo_$s_GameData.init();
	pokemmo_$s_MasterConnector.connect(pokemmo_$s_GameServer.start);
};
pokemmo_$s_Main.log = function(obj) {
	console.log(obj);
};
pokemmo_$s_Main.warn = function(obj) {
	console.warn(obj);
};
pokemmo_$s_Main.error = function(obj) {
	console.error(obj);
};
var pokemmo_$s_MapInstance = function(map,id) {
	this.map = map;
	this.chars = [];
	this.messages = [];
	this.cremoved = [];
	this.warpsUsed = [];
	++map.numInstances;
	pokemmo_$s_GameData.mapsInstaces.push(this);
};
pokemmo_$s_MapInstance.__name__ = true;
pokemmo_$s_MapInstance.prototype = {
	destroy: function() {
		this.map.instances.remove(this.id);
		--this.map.numInstances;
		HxOverrides.remove(pokemmo_$s_GameData.mapsInstaces,this);
	}
	,addChar: function($char) {
		this.chars.push($char);
		HxOverrides.remove(this.cremoved,$char.client.username);
	}
	,removeChar: function($char) {
		HxOverrides.remove(this.chars,$char);
		if(this.chars.length == 0 && this.map.numInstances > 1) this.destroy();
		this.cremoved.push($char.client.username);
	}
	,getCharCount: function() {
		return this.chars.length;
	}
	,generateFullCharNetworkObject: function() {
		var arr = [];
		var _g = 0;
		var _g1 = this.chars;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			arr.push(c.generateNetworkObject());
		}
		return arr;
	}
	,generateNetworkObjectData: function() {
		var obj = { map : this.map.id};
		var charArr = [];
		var _g = 0;
		var _g1 = this.chars;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			if(c.retransmit) {
				c.retransmit = false;
				charArr.push(c.generateNetworkObject());
			}
		}
		if(charArr.length > 0) obj.chars = charArr;
		if(this.messages.length > 0) obj.messages = this.messages;
		if(this.warpsUsed.length > 0) obj.warpsUsed = this.warpsUsed;
		if(this.cremoved.length > 0) obj.cremoved = this.cremoved;
		var data = js_Node.stringify(obj);
		this.messages.length = 0;
		this.warpsUsed.length = 0;
		this.cremoved.length = 0;
		this.networkObjectData = data;
		return data;
	}
	,__class__: pokemmo_$s_MapInstance
};
var pokemmo_$s_MasterConnector = function() { };
pokemmo_$s_MasterConnector.__name__ = true;
pokemmo_$s_MasterConnector.connect = function(func) {
	pokemmo_$s_MasterConnector.loggedInUsers = [];
	pokemmo_$s_MasterConnector.savingUsers = [];
	pokemmo_$s_MasterConnector.mongodb = js_Node.require("mongodb");
	var tmongodb = pokemmo_$s_MasterConnector.mongodb;
	pokemmo_$s_MasterConnector.dbserver = new tmongodb.Server('127.0.0.1', 27017, { } );
	var tdbserver = pokemmo_$s_MasterConnector.dbserver;
	new tmongodb.Db('pokemmo', tdbserver, {}).open(function(error,client) {
		if(error) throw new js__$Boot_HaxeError(error);
		var tdbclient = pokemmo_$s_MasterConnector.dbclient = client;
		pokemmo_$s_MasterConnector.dbclient.createCollection("accounts",function(error1,accountsCollection) {
			pokemmo_$s_MasterConnector.dbaccounts = accountsCollection;
			pokemmo_$s_MasterConnector.dbaccounts.ensureIndex({ username : 1},{ unique : true},function() {
			});
			pokemmo_$s_MasterConnector.dbaccounts.ensureIndex({ lcusername : 1},{ unique : true},function() {
			});
			pokemmo_$s_MasterConnector.dbclient.createCollection("characters",function(error2,charactersCollection) {
				pokemmo_$s_MasterConnector.dbchars = charactersCollection;
				pokemmo_$s_MasterConnector.dbchars.ensureIndex({ username : 1},{ unique : true},function() {
				});
				func();
			});
		});
	},{ strict : true});
};
pokemmo_$s_MasterConnector.isUser = function(username,func) {
	func(HxOverrides.indexOf(pokemmo_$s_MasterConnector.savingUsers,username,0) != -1);
};
pokemmo_$s_MasterConnector.loginUser = function(username,password,func) {
	if(HxOverrides.indexOf(pokemmo_$s_MasterConnector.savingUsers,username,0) != -1 || HxOverrides.indexOf(pokemmo_$s_MasterConnector.loggedInUsers,username,0) != -1) {
		func("loggedInAlready",null);
		return;
	}
	pokemmo_$s_MasterConnector.dbaccounts.find({ lcusername : username.toLowerCase()},{ limit : 1}).toArray(function(err,docs) {
		if(err || docs.length == 0) {
			func("wrongUsername",null);
			return;
		}
		var username1 = docs[0].username;
		var hashedpass = docs[0].password;
		var salt = docs[0].salt;
		pokemmo_$s_MasterConnector.loggedInUsers.push(username1);
		func(pokemmo_$s_Utils.sha512(password,salt) == hashedpass?"success":"wrong_password",docs[0].username);
	});
};
pokemmo_$s_MasterConnector.disconnectUser = function(username) {
	HxOverrides.remove(pokemmo_$s_MasterConnector.loggedInUsers,username);
};
pokemmo_$s_MasterConnector.loadCharacter = function(username,func) {
	pokemmo_$s_MasterConnector.dbchars.find({ username : username},{ limit : 1}).toArray(function(err,docs) {
		if(err) {
			js_Node.console.warn("Error while trying to load client char: " + Std.string(err.message));
			func(false,null);
			return;
		}
		if(docs.length > 0) func(true,docs[0]); else func(true,null);
	});
};
pokemmo_$s_MasterConnector.saveCharacter = function(username,data) {
	if(HxOverrides.indexOf(pokemmo_$s_MasterConnector.savingUsers,username,0) != -1) return;
	pokemmo_$s_MasterConnector.savingUsers.push(username);
	pokemmo_$s_MasterConnector.dbchars.update({ username : username},__js__("{" + set + ":data}"),{ safe : true, upsert : true},function(err) {
		HxOverrides.remove(pokemmo_$s_MasterConnector.savingUsers,username);
		if(err != null) console.warn("Error while saving client character: " + err.message);
	});
};
var pokemmo_$s_Pokemon = function() {
	this.resetBattleStats();
};
pokemmo_$s_Pokemon.__name__ = true;
pokemmo_$s_Pokemon.prototype = {
	resetBattleStats: function() {
		this.battleStats = { learnableMoves : [], atkPower : 0, defPower : 0, spAtkPower : 0, spDefPower : 0, speedPower : 0, accuracy : 0, evasion : 0};
	}
	,loadFromSave: function(sav) {
		var _g = 0;
		var _g1 = pokemmo_$s_Pokemon.pokemonSaveFields;
		while(_g < _g1.length) {
			var field = _g1[_g];
			++_g;
			this[field] = sav[field];
		}
		this.calculateStats();
		return this;
	}
	,createWild: function(id_,level_) {
		this.id = id_;
		this.level = level_;
		this.unique = pokemmo_$s_Utils.createRandomString(16);
		if(pokemmo_$s_GameData.pokemonData[this.id].genderRatio != -1) if(Math.random() < pokemmo_$s_GameData.pokemonData[this.id].genderRatio) this.gender = 1; else this.gender = 2; else this.gender = 0;
		this.nature = 1 + Math.floor(25 * Math.random());
		if(pokemmo_$s_GameData.pokemonData[this.id].ability2 != null) this.ability = 1 + Math.floor(2 * Math.random()); else if(pokemmo_$s_GameData.pokemonData[this.id].ability1 != null) this.ability = 1; else this.ability = 0;
		this.experience = 0;
		this.hp = this.atk = this.def = this.spAtk = this.spDef = this.speed = 0;
		this.evHp = this.evAtk = this.evDef = this.evSpAtk = this.evSpDef = this.evSpeed = 0;
		this.ivHp = Math.floor(32 * Math.random());
		this.ivAtk = Math.floor(32 * Math.random());
		this.ivDef = Math.floor(32 * Math.random());
		this.ivSpAtk = Math.floor(32 * Math.random());
		this.ivSpDef = Math.floor(32 * Math.random());
		this.ivSpeed = Math.floor(32 * Math.random());
		this.status = 0;
		this.virus = 0;
		this.shiny = 0.0001220703125 > Math.random();
		this.moves = [null,null,null,null];
		this.movesPP = [0,0,0,0];
		this.movesMaxPP = [0,0,0,0];
		var j = 0;
		var _g = 0;
		var _g1 = pokemmo_$s_GameData.pokemonData[this.id].learnset;
		while(_g < _g1.length) {
			var i = _g1[_g];
			++_g;
			if(pokemmo_$s_GameData.movesData[i.move] == null) {
				console.warn("Move \"" + i.move + "\" doesn't exist for \"" + pokemmo_$s_GameData.pokemonData[this.id].name + "\"");
				continue;
			}
			if(i.level > this.level) continue;
			this.learnMove(j,i.move);
			j = (j + 1) % 4;
		}
		this.calculateStats();
		this.hp = this.maxHp;
		if(this.moves[0] == null) this.learnMove(0,"tackle");
		return this;
	}
	,generateSave: function() {
		var sav = { };
		var _g = 0;
		var _g1 = pokemmo_$s_Pokemon.pokemonSaveFields;
		while(_g < _g1.length) {
			var field = _g1[_g];
			++_g;
			sav[field] = this[field];
		}
		return sav;
	}
	,calculateCatch: function(ballType,ballValue) {
		var chance = (3 * this.maxHp - 2 * this.hp) * pokemmo_$s_GameData.pokemonData[this.id].catchRate;
		switch(ballType) {
		case 0:
			chance *= ballValue;
			break;
		case 1:
			chance += ballValue;
			break;
		}
		chance /= 3 * this.maxHp;
		var _g = this.status;
		switch(_g) {
		case 1:case 2:
			chance *= 2;
			break;
		case 3:case 4:case 5:
			chance *= 1.5;
			break;
		}
		return chance;
	}
	,getAbility: function() {
		if(this.ability == 0) return ""; else return pokemmo_$s_GameData.pokemonData[this.id]["ability" + this.ability];
	}
	,learnMove: function(slot,move) {
		if(slot < 0 || slot >= 4) return;
		this.moves[slot] = move;
		this.movesMaxPP[slot] = this.movesPP[slot] = pokemmo_$s_GameData.movesData[move].pp;
	}
	,calculateStats: function() {
		var _g = this;
		var calculateSingleStat = function(base,iv,ev) {
			return (iv + 2 * base + ev / 4) * _g.level / 100 + 5;
		};
		this.maxHp = Math.floor((this.ivHp + 2 * pokemmo_$s_GameData.pokemonData[this.id].baseStats.hp + this.evHp / 4 + 100) * this.level / 100 + 10);
		var tatk = calculateSingleStat(pokemmo_$s_GameData.pokemonData[this.id].baseStats.atk,this.ivAtk,this.evAtk);
		var tdef = calculateSingleStat(pokemmo_$s_GameData.pokemonData[this.id].baseStats.def,this.ivDef,this.evDef);
		var tspAtk = calculateSingleStat(pokemmo_$s_GameData.pokemonData[this.id].baseStats.spAtk,this.ivSpAtk,this.evSpAtk);
		var tspDef = calculateSingleStat(pokemmo_$s_GameData.pokemonData[this.id].baseStats.spDef,this.ivSpDef,this.evSpDef);
		var tspeed = calculateSingleStat(pokemmo_$s_GameData.pokemonData[this.id].baseStats.speed,this.ivSpeed,this.evSpeed);
		var _g1 = this.nature;
		switch(_g1) {
		case 1:
			tatk *= 1.1;
			tdef *= 0.9;
			break;
		case 2:
			tatk *= 1.1;
			tspAtk *= 0.9;
			break;
		case 3:
			tatk *= 1.1;
			tspDef *= 0.9;
			break;
		case 4:
			tatk *= 1.1;
			tspeed *= 0.9;
			break;
		case 5:
			tdef *= 1.1;
			tatk *= 0.9;
			break;
		case 6:
			tdef *= 1.1;
			tspAtk *= 0.9;
			break;
		case 7:
			tdef *= 1.1;
			tspDef *= 0.9;
			break;
		case 8:
			tdef *= 1.1;
			tspeed *= 0.9;
			break;
		case 9:
			tspAtk *= 1.1;
			tatk *= 0.9;
			break;
		case 10:
			tspAtk *= 1.1;
			tdef *= 0.9;
			break;
		case 11:
			tspAtk *= 1.1;
			tspDef *= 0.9;
			break;
		case 12:
			tspAtk *= 1.1;
			tspeed *= 0.9;
			break;
		case 13:
			tspDef *= 1.1;
			tatk *= 0.9;
			break;
		case 14:
			tspDef *= 1.1;
			tdef *= 0.9;
			break;
		case 15:
			tspDef *= 1.1;
			tspAtk *= 0.9;
			break;
		case 16:
			tspDef *= 1.1;
			tspeed *= 0.9;
			break;
		case 17:
			tspeed *= 1.1;
			tatk *= 0.9;
			break;
		case 18:
			tspeed *= 1.1;
			tdef *= 0.9;
			break;
		case 19:
			tspeed *= 1.1;
			tspAtk *= 0.9;
			break;
		case 20:
			tspeed *= 1.1;
			tspDef *= 0.9;
			break;
		}
		this.atk = Math.floor(tatk);
		this.def = Math.floor(tdef);
		this.spAtk = Math.floor(tspAtk);
		this.spDef = Math.floor(tspDef);
		this.speed = Math.floor(tspeed);
		if(this.level >= 100) this.experienceNeeded = 0; else this.experienceNeeded = pokemmo_$s_GameData.experienceRequired[this.level][pokemmo_$s_GameData.curveIdToInt(pokemmo_$s_GameData.pokemonData[this.id].experienceCurve)];
	}
	,restore: function() {
		this.hp = this.maxHp;
		var _g = 0;
		while(_g < 4) {
			var i = _g++;
			this.movesPP[i] = this.movesMaxPP[i];
		}
	}
	,getUsableMoves: function() {
		var arr = [];
		var _g = 0;
		while(_g < 4) {
			var i = _g++;
			if(this.moves[i] == null) continue;
			if(this.movesPP[i] <= 0) continue;
			arr.push(this.moves[i]);
		}
		return arr;
	}
	,generateNetworkObject: function(isOwner) {
		if(isOwner) return { id : this.id, level : this.level, hp : this.hp, maxHp : this.maxHp, unique : this.unique, shiny : this.shiny, gender : this.gender, nickname : this.nickname, status : this.status, experience : this.experience, experienceNeeded : this.experienceNeeded, atk : this.atk, def : this.def, spAtk : this.spAtk, spDef : this.spDef, speed : this.speed, ability : this.ability, nature : this.nature, moves : this.moves, movesPP : this.movesPP, movesMaxPP : this.movesMaxPP, training : Math.floor((this.evHp + this.evAtk + this.evDef + this.evSpAtk + this.evSpDef + this.evSpeed) / 510 * 100) / 100, virus : this.virus}; else return { id : this.id, level : this.level, hp : this.hp, maxHp : this.maxHp, unique : this.unique, shiny : this.shiny, gender : this.gender, nickname : this.nickname, status : this.status};
	}
	,calculateExpGain: function(isTrainer) {
		return Math.ceil((isTrainer?1.5:1) * pokemmo_$s_GameData.pokemonData[this.id].baseExp * this.level / 7);
	}
	,buffBattleStat: function(stat,value) {
		switch(stat) {
		case "atk":
			this.battleStats.atkPower = pokemmo_$s_Utils.clamp(this.battleStats.atkPower + value,-6,6);
			break;
		case "def":
			this.battleStats.defPower = pokemmo_$s_Utils.clamp(this.battleStats.defPower + value,-6,6);
			break;
		case "spAtk":
			this.battleStats.spAtkPower = pokemmo_$s_Utils.clamp(this.battleStats.spAtkPower + value,-6,6);
			break;
		case "spDef":
			this.battleStats.spDefPower = pokemmo_$s_Utils.clamp(this.battleStats.spDefPower + value,-6,6);
			break;
		case "speed":
			this.battleStats.speedPower = pokemmo_$s_Utils.clamp(this.battleStats.speedPower + value,-6,6);
			break;
		case "accuracy":
			this.battleStats.accuracy = pokemmo_$s_Utils.clamp(this.battleStats.accuracy + value,-6,6);
			break;
		case "evasion":
			this.battleStats.evasion = pokemmo_$s_Utils.clamp(this.battleStats.evasion + value,-6,6);
			break;
		}
	}
	,addEV: function(data) {
		var total = this.evHp + this.evAtk + this.evDef + this.evSpAtk + this.evSpDef + this.evSpeed;
		var tmp;
		if(total >= 510) return;
		var _g = 0;
		var _g1 = [["hp","evHp"],["atk","evAtk"],["def","evDef"],["spAtk","evSpAtk"],["spDef","evSpDef"],["speed","evSpeed"]];
		while(_g < _g1.length) {
			var i = _g1[_g];
			++_g;
			if(data[i[0]] != null && data[i[0]] > 0) {
				tmp = data[i[0]];
				if(total + tmp > 510) tmp = 510 - total;
				this[data[i[1]]] += data[i[0]];
				total += tmp;
				if(total >= 510) return;
			}
		}
	}
	,levelUp: function() {
		var oldMaxHp = this.maxHp;
		this.level += 1;
		this.calculateStats();
		if(this.hp > 0) this.hp += this.maxHp - oldMaxHp;
		var data = pokemmo_$s_GameData.pokemonData[this.id];
		if(data.evolveLevel != null && this.level >= data.evolveLevel) {
			this.id = data.evolveTo;
			data = pokemmo_$s_GameData.pokemonData[this.id];
		}
		var learnset = data.learnset;
		var movesLearned = [];
		var _g = 0;
		while(_g < learnset.length) {
			var m = learnset[_g];
			++_g;
			if(pokemmo_$s_GameData.movesData[m.move] == null) {
				console.warn("Move \"" + m.move + "\" doesn't exist for " + pokemmo_$s_GameData.pokemonData[this.id].name);
				continue;
			}
			if(m.level == -1 && HxOverrides.indexOf(this.moves,m.move,0) == -1) {
			} else if(m.level != this.level) continue;
			var learnedMove = false;
			var _g1 = 0;
			while(_g1 < 4) {
				var i = _g1++;
				if(this.moves[i] == null) {
					this.learnMove(i,m.move);
					movesLearned.push(m.move);
					learnedMove = true;
					break;
				}
			}
			if(!learnedMove) this.battleStats.learnableMoves.push(m.move);
		}
		return { movesLearned : movesLearned};
	}
	,__class__: pokemmo_$s_Pokemon
};
var pokemmo_$s_ServerConst = function() { };
pokemmo_$s_ServerConst.__name__ = true;
var pokemmo_$s_Utils = function() { };
pokemmo_$s_Utils.__name__ = true;
pokemmo_$s_Utils.createRandomString = function(len) {
	var i = len;
	var str = "";
	while(i-- > 0) str += pokemmo_$s_exts_StringExt.getRandomChar("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
	return str;
};
pokemmo_$s_Utils.randInt = function(min,max) {
	return min + Math.floor((max - min + 1) * Math.random());
};
pokemmo_$s_Utils.recursiveFreeze = function(obj) {
	var rec = pokemmo_$s_Utils.recursiveFreeze;
	for(var i in obj)if(typeof obj[i] == 'object')rec(obj[i]);Object.freeze(obj);;
	return obj;
};
pokemmo_$s_Utils.sha512 = function(pass,salt) {
	var hasher = js_Node.require("crypto").createHash("sha512");
	if(salt == null) hasher.update(pass); else hasher.update(pass + "#" + salt);
	return hasher.digest("base64");
};
pokemmo_$s_Utils.clamp = function(n,min,max) {
	if(n < min) return min; else if(n > max) return max; else return n;
};
var pokemmo_$s_exts_ArrayExt = function() { };
pokemmo_$s_exts_ArrayExt.__name__ = true;
pokemmo_$s_exts_ArrayExt.random = function(arr) {
	return arr[Math.floor(arr.length * Math.random())];
};
var pokemmo_$s_exts_StringExt = function() { };
pokemmo_$s_exts_StringExt.__name__ = true;
pokemmo_$s_exts_StringExt.getRandomChar = function(str) {
	return str.charAt(Math.floor(str.length * Math.random()));
};
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; }
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
String.prototype.__class__ = String;
String.__name__ = true;
Array.__name__ = true;
Date.prototype.__class__ = Date;
Date.__name__ = ["Date"];
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
if(Array.prototype.map == null) Array.prototype.map = function(f) {
	var a = [];
	var _g1 = 0;
	var _g = this.length;
	while(_g1 < _g) {
		var i = _g1++;
		a[i] = f(this[i]);
	}
	return a;
};
var __map_reserved = {}
js_Boot.__toStr = {}.toString;
js_NodeC.UTF8 = "utf8";
js_NodeC.ASCII = "ascii";
js_NodeC.BINARY = "binary";
js_NodeC.BASE64 = "base64";
js_NodeC.HEX = "hex";
js_NodeC.EVENT_EVENTEMITTER_NEWLISTENER = "newListener";
js_NodeC.EVENT_EVENTEMITTER_ERROR = "error";
js_NodeC.EVENT_STREAM_DATA = "data";
js_NodeC.EVENT_STREAM_END = "end";
js_NodeC.EVENT_STREAM_ERROR = "error";
js_NodeC.EVENT_STREAM_CLOSE = "close";
js_NodeC.EVENT_STREAM_DRAIN = "drain";
js_NodeC.EVENT_STREAM_CONNECT = "connect";
js_NodeC.EVENT_STREAM_SECURE = "secure";
js_NodeC.EVENT_STREAM_TIMEOUT = "timeout";
js_NodeC.EVENT_STREAM_PIPE = "pipe";
js_NodeC.EVENT_PROCESS_EXIT = "exit";
js_NodeC.EVENT_PROCESS_UNCAUGHTEXCEPTION = "uncaughtException";
js_NodeC.EVENT_PROCESS_SIGINT = "SIGINT";
js_NodeC.EVENT_PROCESS_SIGUSR1 = "SIGUSR1";
js_NodeC.EVENT_CHILDPROCESS_EXIT = "exit";
js_NodeC.EVENT_HTTPSERVER_REQUEST = "request";
js_NodeC.EVENT_HTTPSERVER_CONNECTION = "connection";
js_NodeC.EVENT_HTTPSERVER_CLOSE = "close";
js_NodeC.EVENT_HTTPSERVER_UPGRADE = "upgrade";
js_NodeC.EVENT_HTTPSERVER_CLIENTERROR = "clientError";
js_NodeC.EVENT_HTTPSERVERREQUEST_DATA = "data";
js_NodeC.EVENT_HTTPSERVERREQUEST_END = "end";
js_NodeC.EVENT_CLIENTREQUEST_RESPONSE = "response";
js_NodeC.EVENT_CLIENTRESPONSE_DATA = "data";
js_NodeC.EVENT_CLIENTRESPONSE_END = "end";
js_NodeC.EVENT_NETSERVER_CONNECTION = "connection";
js_NodeC.EVENT_NETSERVER_CLOSE = "close";
js_NodeC.FILE_READ = "r";
js_NodeC.FILE_READ_APPEND = "r+";
js_NodeC.FILE_WRITE = "w";
js_NodeC.FILE_WRITE_APPEND = "a+";
js_NodeC.FILE_READWRITE = "a";
js_NodeC.FILE_READWRITE_APPEND = "a+";
js_Node.console = console;
js_Node.process = process;
js_Node.require = require;
js_Node.setTimeout = setTimeout;
js_Node.clearTimeout = clearTimeout;
js_Node.setInterval = setInterval;
js_Node.clearInterval = clearInterval;
js_Node.setImmediate = (function($this) {
	var $r;
	var version = HxOverrides.substr(js_Node.process.version,1,null).split(".").map(Std.parseInt);
	$r = version[0] > 0 || version[1] >= 9?js_Node.isNodeWebkit()?global.setImmediate:setImmediate:null;
	return $r;
}(this));
js_Node.clearImmediate = (function($this) {
	var $r;
	var version = HxOverrides.substr(js_Node.process.version,1,null).split(".").map(Std.parseInt);
	$r = version[0] > 0 || version[1] >= 9?js_Node.isNodeWebkit()?global.clearImmediate:clearImmediate:null;
	return $r;
}(this));
js_Node.global = global;
js_Node.module = js_Node.isNodeWebkit()?global.module:module;
js_Node.stringify = JSON.stringify;
js_Node.parse = JSON.parse;
pokemmo_$s_Battle.BATTLE_WILD = 0;
pokemmo_$s_Battle.BATTLE_TRAINER = 1;
pokemmo_$s_Battle.BATTLE_VERSUS = 2;
pokemmo_$s_Battle.powerMultipler = {"-6": 2/8,"-5": 2/7,"-4": 2/6,"-3": 2/5,"-2": 2/4,"-1": 2/3,"0": 1,"1": 1.5,"2": 2,"3": 2.5,"4": 3,"5": 3.5,"6": 4}
pokemmo_$s_Battle.accuracyMultipler = {"-6": 3/9,"-5": 3/8,"-4": 3/7,"-3": 3/6,"-2": 3/5,"-1": 3/4,"0": 1,"1": 4/3,"2": 5/3,"3": 2,"4": 7/3,"5": 8/3,"6": 3,}
pokemmo_$s_ClientCharacter.SPEED_HACK_N = 12;
pokemmo_$s_GameConst.SPEED_HACK_N = 12;
pokemmo_$s_GameConst.DIR_DOWN = 0;
pokemmo_$s_GameConst.DIR_LEFT = 1;
pokemmo_$s_GameConst.DIR_UP = 2;
pokemmo_$s_GameConst.DIR_RIGHT = 3;
pokemmo_$s_GameConst.LOAD_MAPS = ["pallet","pallet_hero_home_1f","pallet_hero_home_2f","pallet_oaklab","pallet_rival_home","pewter","viridianforest"];
pokemmo_$s_GameMap.SD_NONE = 0;
pokemmo_$s_GameMap.SD_SOLID = 1;
pokemmo_$s_GameMap.SD_WATER = 2;
pokemmo_$s_GameMap.SD_LEDGE_DOWN = 3;
pokemmo_$s_GameMap.SD_LEDGE_LEFT = 4;
pokemmo_$s_GameMap.SD_LEDGE_UP = 5;
pokemmo_$s_GameMap.SD_LEDGE_RIGHT = 6;
pokemmo_$s_GameMap.SD_GRASS = 7;
pokemmo_$s_GameMap.LAYER_TILELAYER = "tilelayer";
pokemmo_$s_GameMap.LAYER_OBJECTGROUP = "objectgroup";
pokemmo_$s_Pokemon.MAX_LEVEL = 100;
pokemmo_$s_Pokemon.MAX_MOVES = 4;
pokemmo_$s_Pokemon.STATUS_NONE = 0;
pokemmo_$s_Pokemon.STATUS_SLEEP = 1;
pokemmo_$s_Pokemon.STATUS_FREEZE = 2;
pokemmo_$s_Pokemon.STATUS_PARALYZE = 3;
pokemmo_$s_Pokemon.STATUS_POISON = 4;
pokemmo_$s_Pokemon.STATUS_BURN = 5;
pokemmo_$s_Pokemon.GENDER_UNKNOWN = 0;
pokemmo_$s_Pokemon.GENDER_MALE = 1;
pokemmo_$s_Pokemon.GENDER_FEMALE = 2;
pokemmo_$s_Pokemon.VIRUS_NONE = 0;
pokemmo_$s_Pokemon.VIRUS_POKERUS = 1;
pokemmo_$s_Pokemon.NATURE_NONE = 0;
pokemmo_$s_Pokemon.BALL_MULT = 0;
pokemmo_$s_Pokemon.BALL_ADD = 1;
pokemmo_$s_Pokemon.NATURE_ATK_DEF = 1;
pokemmo_$s_Pokemon.NATURE_ATK_SPATK = 2;
pokemmo_$s_Pokemon.NATURE_ATK_SPDEF = 3;
pokemmo_$s_Pokemon.NATURE_ATK_SPEED = 4;
pokemmo_$s_Pokemon.NATURE_DEF_ATK = 5;
pokemmo_$s_Pokemon.NATURE_DEF_SPATK = 6;
pokemmo_$s_Pokemon.NATURE_DEF_SPDEF = 7;
pokemmo_$s_Pokemon.NATURE_DEF_SPEED = 8;
pokemmo_$s_Pokemon.NATURE_SPATK_ATK = 9;
pokemmo_$s_Pokemon.NATURE_SPATK_DEF = 10;
pokemmo_$s_Pokemon.NATURE_SPATK_SPDEF = 11;
pokemmo_$s_Pokemon.NATURE_SPATK_SPEED = 12;
pokemmo_$s_Pokemon.NATURE_SPDEF_ATK = 13;
pokemmo_$s_Pokemon.NATURE_SPDEF_DEF = 14;
pokemmo_$s_Pokemon.NATURE_SPDEF_SPATK = 15;
pokemmo_$s_Pokemon.NATURE_SPDEF_SPEED = 16;
pokemmo_$s_Pokemon.NATURE_SPEED_ATK = 17;
pokemmo_$s_Pokemon.NATURE_SPEED_DEF = 18;
pokemmo_$s_Pokemon.NATURE_SPEED_SPATK = 19;
pokemmo_$s_Pokemon.NATURE_SPEED_SPDEF = 20;
pokemmo_$s_Pokemon.NATURE_NONE_ATK = 21;
pokemmo_$s_Pokemon.NATURE_NONE_DEF = 22;
pokemmo_$s_Pokemon.NATURE_NONE_SPATK = 23;
pokemmo_$s_Pokemon.NATURE_NONE_SPDEF = 24;
pokemmo_$s_Pokemon.NATURE_NONE_SPEED = 25;
pokemmo_$s_Pokemon.MAX_EV = 510;
pokemmo_$s_Pokemon.MAX_INDIVIDUAL_EV = 255;
pokemmo_$s_Pokemon.pokemonSaveFields = ["id","level","unique","gender","ability","experience","nature","status","virus","shiny","moves","movesPP","movesMaxPP","hp","evHp","evAtk","evDef","evSpAtk","evSpDef","evSpeed","ivHp","ivAtk","ivDef","ivSpAtk","ivSpDef","ivSpeed"];
pokemmo_$s_ServerConst.MAX_CLIENTS = 200;
pokemmo_$s_ServerConst.pokemonStarters = ["1","4","7","10","13","16","25","29","32","43","60","66","69","74","92","133"];
pokemmo_$s_ServerConst.characterSprites = ["red","red_-135","JZJot","22jM7"];
pokemmo_$s_Main.main();
})(typeof console != "undefined" ? console : {log:function(){}}, typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);
