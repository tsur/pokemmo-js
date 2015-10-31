"use strict";

import R from 'ramda';
import Log from 'loglevel';
import GameServer from './game_server.js';
import GameData from './game_data.js';
import Connector from './connector.js';
import ClientCharacter from './client_character.js';
import Pokemon from './pokemon.js';
import * as Const from './const.js';

export default class Client {

    constructor(socket) {

        this.socket = socket;

        this.socket.on('login', login(this));

    }

    kick() {

        if (this.character) this.character.disconnect();
        else disconnect(this)();
    }

    initCharacter(save) {

        this.character = ClientCharacter.call(this, save);
    }
}

function login (client){

    client.disconnected = false;

    return credentials => {

        if(!credentials.username || !credentials.password){

            return client.socket.emit('loginFail', 'invalidData');
        }

        if (GameServer.getClientCount() > Const.MAX_CLIENTS) {

            Log.info('Refusing client connection: server is full');

            return client.socket.emit('loginFail', 'serverFull');
        }

        Connector.loginUser(credentials.username, credentials.password, (status, username) => {

            if (status != "success") {

                return client.socket.emit('loginFail', status);
            }

            client.username = username;

            client.accountLevel = GameData.getAdminLevel(username);

            client.socket.on('disconnect', disconnect(client));

            Connector.loadCharacter(username, (success, character) => {

                if (!success) {
                    return client.socket.emit('loginFail', "internalError");
                }

                if (!character) {

                    client.newAccount = true;
                    client.socket.emit('newGame', {username: username, starters: Const.POKEMON_STARTERS, characters: Const.CHARACTER_SPRITES});
                    client.socket.on('newGame', newGame(client));

                } else {

                    client.socket.emit('startGame', { username: username } );
                    client.socket.on('startGame', () => client.initCharacter(character));
                }
            });
        });

    }

}

function disconnect(client){

    return () => {

        if (client.disconnected) return;

        client.socket.disconnect();

        Connector.disconnectUser(client.username);

        client.disconnected = true;
    }
}

function newGame(client){

    return data => {

        if (!client.newAccount) return;

        if (Const.POKEMON_STARTERS.indexOf(data.starter) == -1 || Const.CHARACTER_SPRITES.indexOf(data.character) == -1) return;

        client.newAccount = false;

        client.initCharacter( {
            map: 'pallet_hero_home_2f',
            x: 1,
            y: 3,
            direction: Const.DIR_DOWN,
            charType: data.character,
            money: 0,
            playerVars: {},
            respawnLocation: {
                mapName: 'pallet_hero_home_2f',
                x: 1,
                y: 3,
                direction: Const.DIR_DOWN
            },
            pokemon: [new Pokemon().createWild(data.starter, 5).generateSave()]
        });
    }
}