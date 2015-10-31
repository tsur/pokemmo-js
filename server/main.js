"use strict";

import Log from 'loglevel';
import R from 'ramda';
import GameData from './game_data.js';
import GameServer from './game_server.js';
import Connector from './connector.js';

class Main{

    static start(options={}){

        if(options.logger) startLogger(options.logger);

        startGame(options);
    }
}

function startLogger(level='info'){

    Log.enableAll();

    Log.setDefaultLevel(level);

}

function startGame(config){

    //const start = R.compose(dbConnector.connect, Game.server, Game.init);
    const start = R.compose(Connector.connect(GameServer.start), GameData.init);

    start(config);
}

Main.start({logger:'info', game:{}, db:{}, io:{}});