package pokemmo.entities;

import js.html.CanvasRenderingContext2D;
import pokemmo.Game;
import pokemmo.Main;
import pokemmo.GameMap;
import pokemmo.Renderer;

/**
 * ...
 * @author Sonyp
 */

class CWarpArrow extends CWarp{

	public function new(name:String, x:Int, y:Int) {
		super(name, x, y);
	}
	
	override public function render(ctx:CanvasRenderingContext2D):Void {
		if(disable) return;
		var chr = Game.curGame.getPlayerChar();
		if(chr == null) return;
		
		if(Math.abs(chr.x - x) + Math.abs(chr.y - y) > 1) return;
		
		var dir;
		if(chr.x < x){
			dir = Game.DIR_RIGHT;
		}else if(chr.x > x){
			dir = Game.DIR_LEFT;
		}else if(chr.y < y){
			dir = Game.DIR_DOWN;
		}else{
			dir = Game.DIR_UP;
		}
		
		if(dir != chr.direction) return;
		
		var curMap = GameMap.cur;
		
		ctx.save();
		ctx.translate(x * curMap.tilewidth + Renderer.getOffsetX() + 16, y * curMap.tileheight + Renderer.getOffsetY() + 16);
		
		ctx.rotate(Math.PI / 2 * dir);
		if((Renderer.numRTicks % 30) < 15){
			ctx.translate(0, 4);
		}
		
		ctx.drawImage(Game.getRes('miscSprites').obj, 0, 32, 32, 32, -16, -16, 32, 32);
		ctx.restore();
	}
}