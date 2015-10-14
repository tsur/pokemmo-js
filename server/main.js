"use strict";

import Log from 'loglevel';
import R from 'ramda';
import * as Game from './game.js';
import * as dbConnector from './connector.js';

class Main{

    constructor(options){

        this.options = options || {};

        if(this.options.log){

            Log.enableAll();

            Log.setDefaultLevel(this.options.log);
        }

        //const start = R.compose(dbConnector.connect, Game.server, Game.init);
        const start = R.compose(Game.server, Game.init);

        start(this);
    }

    debug(data){

        Log.debug(data);
    }

    info(data){

        Log.info(data);
    }

    warn(data){

        Log.warn(data);
    }

    error(error){

        Log.error(error)
    }
}

new Main({log:'info'});