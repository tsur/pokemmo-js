
import $ from 'jquery';
import Log from 'loglevel';

class Main{

    static start(){

        Log.enableAll();

        Log.info('running game');

        //const isPhone = (~/(iPhone|iPod)/i).match(window.navigator.userAgent);
        //
        //R.compose(run, init)(Main.  state);
        //
        //var canvas = document.getElementById('canvas');
        //initGame(canvas, document.getElementById('canvasContainer'));
        //
        //if(isPhone){
        //    window.addEventListener("load",function() {
        //        setTimeout(function(){
        //            window.scrollTo(0, 0);
        //            document.body.setAttribute("orient", "landscape");
        //        }, 0);
        //    });
        //}

    }
}

$(document).ready(event => Main.start());