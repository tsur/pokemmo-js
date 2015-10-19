"use strict";

import R from 'ramda';
import fs from 'fs';
import io from 'socket.io';
import * as Util from './util.js';
import * as Const from './const.js';
import Map from './map.js';
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

    const maps = R.zipObj(Const.LOAD_MAPS, R.map(id => new Map(id), Const.LOAD_MAPS));

    game.debug(maps);

    game.info('Loaded maps data');

    game.data = {pokData, movesData, typesData, adminData, experienceData, maps};

    return game;
}

/**
 * open the server to listening new client connections
 * and start the game loop (which keep sending out updates to all connected clients)
 * @param game
 */
export function server(game){

    const port = game.options.port || Const.port;

    game.info(`Listening to new connections on port ${port}`);

    game.clients = [];

    const ioConnector = io.listen(port);

    ioConnector.sockets.on('connection', socket => game.clients.push(new Client(socket)));

    const updateServerWorld = updateWorld(game);

    process.nextTick(function _update(){

        updateServerWorld(_update);

    });
}

/**
 * Loop over maps and emits a message containing all new changes to all its clients.
 * @param game
 * @returns {Function}
 */
function updateWorld(game){

    return (fn) => {

        if(R.length(game.clients)){

            const mapsWithClients = R.filter(map => map.getCharCount(), game.maps);

            const messages = R.map(map => map.generateNetworkObjectData(), mapsWithClients);

            //R.forEach(client => client.client.socket.volatile.emit('update', messages), game.clients);

            R.forEach(msg => {

                game.debug(`Updating map ${msg.id}`);

                R.forEach(client => client.client.socket.volatile.emit('update', msg), game.clients);

            }, messages);

        }

        process.nextTick(fn);

    }

}