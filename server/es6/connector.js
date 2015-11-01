"use strict";

import mongodb from 'mongodb';
import R from 'ramda';
import Log from 'loglevel';
import * as Util from './util.js';
import * as Const from './const.js';

export default class Connector {

    static state = {};

    static connect(cb) {

        resetState(Connector.state);

        return config => openConnection(Connector.state, config, cb);
    }

    static isUser(username, fn) {

        fn(Connector.state.savingUsers.indexOf(username) != -1);
    }

    static loginUser(username, password, fn) {

        if (Connector.state.savingUsers.indexOf(username) != -1 || Connector.state.loggedInUsers.indexOf(username) != -1) {

            return fn("loggedInAlready", null);
        }

        Connector.state.dbAccounts
            .find({lcusername: username.toLowerCase()}, {limit:1})
            .toArray((err, docs) => {

                if(err || docs.length == 0) return fn("wrongUsername", null);

                const username = docs[0].username;
                const hashedPassword = docs[0].password;
                const salt = docs[0].salt;

                Connector.state.loggedInUsers.push(username);

                fn(Util.sha512(password, salt) == hashedPassword ? "success" : "wrong_password", docs[0].username);

            });
    }

    static disconnectUser(username) {

        Connector.state.loggedInUsers.remove(username);
    }

    static loadCharacter(username, fn) {

        Connector.state.dbCharacters
            .find({username: username}, {limit:1})
            .toArray((error, docs) => {

                if(error){

                    Log.warn(`Error while trying to load client char: ${err.message}`);
                    return fn(false, null);
                }

                docs.length > 0 ? fn(true, docs[0]) : fn(true, null);

            });
    }

    static saveCharacter(username, data) {

        if (Connector.state.savingUsers.indexOf(username) != -1) return;

        Connector.state.savingUsers.push(username);

        Connector.state.dbCharacters.update({username: username}, {$set:data}, {safe:true, upsert:true}, error => {

            Connector.state.savingUsers.remove(username);

            if(!error) Log.warn(`Error while saving client character: ${err.message}`);

        });
    }

}

function resetState(state){

    state.loggedInUsers = [];
    state.savingUsers = [];
    state.dbConnection = null;
}

function createConnection(host=Const.DB_HOST, port=Const.DB_PORT) {

    return new mongodb.Server(host, port, {});
}

function createDB(connection, name='pokemmo') {

    return new mongodb.Db(name, connection, {})
}

function createCollection(client, name, fn) {

    client.createCollection(name, {}, (error, collection) => {

        fn(collection);

    });
}

function createIndexes(collection, indexes){

    R.forEach(index => collection.ensureIndex(index.field, index.unique ? {unique: true} : null), indexes);
}

function openConnection(state, config, cb){

    const connection = createConnection(config.db.host, config.db.port);

    //@todo join onConnectionOpen as initCollections to the composition
    const fn = R.compose(cb, populateState);

    createDB(connection, config.db.name).open( onConnectionOpen(state, config, fn), { strict: true } );
}

function populateState(state, data, config){

    //state.dbConnection = data.connection;
    //state.dbClient = data.client;
    state.dbAccounts = data.accountsCollection;
    state.dbCharacters = data.charactersCollection;

    return config;
}

function onConnectionOpen(state, config, cb) {

    return (error, client) => {

        if (error) throw error;

        Log.info(`Database connection open at ${config.db.host || Const.DB_HOST}:${config.db.port || Const.DB_PORT}`);

        createCollection(client, 'accounts', accountsCollection => {

            const indexes = [{field: {username: 1}, unique: true}, {field: {lcusername: 1}, unique: true}];
            createIndexes(accountsCollection, indexes);

            createCollection(client, 'characters', charactersCollection => {

                const indexes = [{field: {username: 1}, unique: true}];
                createIndexes(charactersCollection, indexes);

                cb(state, {accountsCollection, charactersCollection}, config);

            });
        });

    }
}