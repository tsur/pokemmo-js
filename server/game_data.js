"use strict";

import R from 'ramda';
import fs from 'fs';
import Log from 'loglevel';
import * as Util from './util.js';
import * as Const from './const.js';
import GameMap from './map.js';

export default class GameData {

    static state = {};

    /**
     * Loads all needed data
     * @param config
     * @returns {*}
     */
    static init(config){

        Log.info('Initializing game');

        const pokData = Util.loadFile(`${__dirname}/../data/pokemon.json`, 'utf8');

        Log.debug(pokData);

        Log.info('Loaded pokemmo data');

        const movesData = Util.loadFile(`${__dirname}/../data/moves.json`, 'utf8');

        Log.debug(movesData);

        Log.info('Loaded moves data');

        const typesData = Util.loadFile(`${__dirname}/../data/types.json`, 'utf8');

        Log.debug(typesData);

        Log.info('Loaded types data');

        const adminData = Util.loadFile(`${__dirname}/../data/admins.json`, 'utf8');

        Log.debug(adminData);

        Log.info('Loaded admin data');

        const experienceData = Util.loadFile(`${__dirname}/../data/experienceRequired.json`, 'utf8');

        Log.debug(experienceData);

        Log.info('Loaded experience data');

        const mapsData = R.zipObj(Const.LOAD_MAPS, R.map(id => new GameMap(id), Const.LOAD_MAPS));
        const mapInstances = [];

        Log.debug(mapsData);

        Log.info('Loaded maps data');

        GameData.state = {pokData, movesData, typesData, adminData, experienceData, mapsData, mapInstances};

        return config;
    }

    static getAdminLevel(username) {

        return !GameData.state.adminData[username] ? 0 : GameData.state.adminData[username].level;
    }

    static getPokemonData(id) {

        return GameData.state.pokData[id];
    }

    static getMoveData(move) {

        return GameData.state.movesData[move];
    }

    static getExperienceRequired(curve, level) {

        return GameData.state.experienceData[level][curveIdToInt(curve)];
    }

    static curveIdToInt(curve) {

        switch(curve) {

            case "erratic": return 0;
            case "fast": return 1;
            case "mediumFast": return 2;
            case "mediumSlow": return 3;
            case "slow": return 4;
            case "fluctuating": return 5;

        }

        throw new Error(`Invalid curve id: ${curve}`);
    }

    static getMap(id) {

        return GameData.state.mapsData[id];
    }

    static getTypeEffectiveness(type, other) {

        if(!type || !other) return 1.;

        if(!GameData.state.typesData[type][other]) return 1.;

        return GameData.state.typesData[type][other];
    }
}