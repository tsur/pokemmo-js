"use strict";

import R from 'ramda';
import io from 'socket.io';
import Log from 'loglevel';
import * as Const from './const.js';
import * as Util from './util.js';
import Client from './client.js';
import GameData from './game_data.js';

export default class GameServer {

    static state = {};

    /**
     * open the server to listening new client connections
     * and start the game loop (which keep sending out updates to all connected clients)
     * @param config
     */
    static start(config){

        setClients(GameServer.state);

        R.compose(Util.iterate(process.nextTick), updateWorld, startServer)(GameServer.state, config.io);

    }

    static kickPlayer(username) {

        const clientToKick = R.find(R.propEq('username', username))(GameServer.state.clients);

        if(clientToKick) clientToKick.kick();
    }

    static getClientCount() {

        return GameServer.state.clients.length;
    }
}

/**
 *
 * @param state
 */
function setClients(state){

    state.clients = [];
}

/**
 *
 * @param state
 * @param ioConfig
 */
function startServer(state, ioConfig){

    const port = ioConfig.port || Const.PORT;

    const ioConnector = io.listen(port);

    ioConnector.sockets.on('connection', socket => state.clients.push(Client.call(null, socket)));

    Log.info(`Listening to new connections on port ${port}`);

    return state;
}

/**
 * Loop over maps and emits a message containing all new changes to all its clients.
 * @param state
 * @returns {Function}
 */
function updateWorld(state){

    const updateWorldLoop = () => {

        const mapsWithClients = R.filter(map => map.getCharCount(), GameData.data.mapInstances);

        const messagesForClients = R.map(map => [map.id, map.generateNetworkObjectData(), map.chars], mapsWithClients);

        for(let [id, msg, clients] of messagesForClients){

            Log.debug(`Updating map ${id}`);

            R.forEach(client => client.client.socket.volatile.emit('update', msg), clients);

        }
    };

    return next => {

        if(R.length(state.clients)) updateWorldLoop();

        next();

    }

}