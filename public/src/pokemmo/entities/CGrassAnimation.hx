package pokemmo.entities;

import js.html.CanvasRenderingContext2D;
import pokemmo.Game;
import pokemmo.GameObject;
import pokemmo.GameMap;
import pokemmo.Renderer;

/**
 * ...
 * @author Sonyp
 */

class CGrassAnimation extends GameObject{
	private var createdTick:Int;
	public function new(x:Int, y:Int) {
		super(x, y);
		
		createdTick = Renderer.numRTicks;
		isTemporary = true;
	}
	
	override public function tick():Void {
		if(Renderer.numRTicks - createdTick >= 16){
			destroy();
			return;
		}
	}
	
	override public function render(ctx:CanvasRenderingContext2D):Void {
		if (Renderer.numRTicks - createdTick >= 16) {
			destroy();
			return;
		}
		
		
		var curMap = GameMap.cur;
		ctx.drawImage(Game.getRes('miscSprites').obj, 32, 32 * Math.floor((Renderer.numRTicks - createdTick) / 4), 32, 32, x * curMap.tilewidth + Renderer.getOffsetX(), y * curMap.tileheight + Renderer.getOffsetY(), 32, 32);
	}
}