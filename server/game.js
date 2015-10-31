"use strict";

import R from 'ramda';
import fs from 'fs';
import io from 'socket.io';
import * as Util from './util.js';
import * as Const from './const.js';
import GameMap from './map.js';
import Client from './client.js';

/**
 * Loads all needed data
 * @param game
 * @returns {*}
 */
export function init(game){

    game.info('Initializing game');

    const pokData = Util.loadFile(`${__dirname}/../data/pokemon.json`, 'utf8');

    game.debug(pokData);

    game.info('Loaded pokemmo data');

    const movesData = Util.loadFile(`${__dirname}/../data/moves.json`, 'utf8');

    game.debug(movesData);

    game.info('Loaded moves data');

    const typesData = Util.loadFile(`${__dirname}/../data/types.json`, 'utf8');

    game.debug(typesData);

    game.info('Loaded types data');

    const adminData = Util.loadFile(`${__dirname}/../data/admins.json`, 'utf8');

    game.debug(adminData);

    game.info('Loaded admin data');

    const experienceData = Util.loadFile(`${__dirname}/../data/experienceRequired.json`, 'utf8');

    game.debug(experienceData);

    game.info('Loaded experience data');

    const mapsData = R.zipObj(Const.LOAD_MAPS, R.map(id => new GameMap(id), Const.LOAD_MAPS));

    game.debug(mapsData);

    game.info('Loaded maps data');

    game.data = {pokData, movesData, typesData, adminData, experienceData, mapsData};

    return game;
}

/**
 * open the server to listening new client connections
 * and start the game loop (which keep sending out updates to all connected clients)
 * @param game
 */
export function start(game){

    R.compose(Util.iterate(process.nextTick), updateWorld, startServer, setClients)(game);

}

/**
 *
 * @param game
 */
function setClients(game){

    game.clients = [];

    return game;
}

/**
 *
 * @param game
 */
function startServer(game){

    const port = game.options.port || Const.PORT;

    const ioConnector = io.listen(port);

    ioConnector.sockets.on('connection', socket => game.clients.push(Client.call(game,socket)));

    game.info(`Listening to new connections on port ${port}`);

    return game;
}

/**
 * Loop over maps and emits a message containing all new changes to all its clients.
 * @param game
 * @returns {Function}
 */
function updateWorld(game){

    const updateWorldLoop = () => {

        const mapsWithClients = R.filter(map => map.getCharCount(), game.maps);

        const messages = R.map(map => map.generateNetworkObjectData(), mapsWithClients);

        for(let msg of messages){

            game.debug(`Updating map ${msg.id}`);

            R.forEach(client => client.client.socket.volatile.emit('update', msg), game.clients);

        }
    };

    return next => {

        if(R.length(game.clients)) updateWorldLoop();

        next();

    }

}