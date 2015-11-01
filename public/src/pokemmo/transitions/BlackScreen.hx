package pokemmo.transitions;

import js.html.CanvasRenderingContext2D;
import pokemmo.Transition;

/**
 * ...
 * @author Sonyp
 */

class BlackScreen extends Transition{
	private var duration:Int;
	public function new(duration:Int) {
		super();
		this.duration = duration;
	}
	
	override public function render(ctx:CanvasRenderingContext2D):Void {
		ctx.fillStyle = '#000000';
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		if(step >= 0) ++step;
		
		if (step >= duration) {
			complete();
			return;
		}
	}
}