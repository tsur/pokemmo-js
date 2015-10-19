"use strict";

import R from 'ramda';
import * as Util from './util.js';
import * as Const from './const.js';

export default class GameMap {

    constructor(id){

        this.id = id;

        this.data = Util.loadFile(`${__dirname}/../resources/maps/${id}.json`, 'utf8');

        this.warps= new Map();
        this.instances = new Map();
        this.points = new Map();
        this.encounterAreas = [];

        //this.playersPerInstance = !this.data.properties.players_per_instance ?
        //    0 : parseInt(this.data.properties.players_per_instance);
        //
        //this.grassEncounters = this.data.properties.grass_encounters;

        const tileLayers = R.filter(layer => layer.type == Const.LAYER_TILELAYER, this.data.layers);
        const objectLayers = R.filter(layer => layer.type == Const.LAYER_OBJECTGROUP, this.data.layers);

        R.forEach(layer => {

            if (!layer.properties || layer.properties.data_layer != '1') return;

            let j = 0;

            this.solidData = Util.initMatrix(Const.SD_NONE, this.data.width, this.data.height);

            R.forEach(y => R.forEach(x => {

                const tileid = layer.data[j];

                if (!tileid) {
                    ++j;
                    return;
                }

                const tileset = this.getTilesetOfTile(tileid);

                if (!tileset) return;

                const curTilesetTileid = tileid - tileset.firstgid;

                if(!tileset.tileproperties[curTilesetTileid]) return;

                if(tileset.tileproperties[curTilesetTileid].solid == '1') this.solidData[x][y] = Const.SD_SOLID;
                else if(tileset.tileproperties[curTilesetTileid].water == '1') this.solidData[x][y] = Const.SD_WATER;
                else if(tileset.tileproperties[curTilesetTileid].grass == '1') this.solidData[x][y] = Const.SD_GRASS;
                else if(tileset.tileproperties[curTilesetTileid].ledge == '1'){

                    this.solidData[x][y] = Const.SD_LEDGE_DOWN;

                    if(tileset.tileproperties[curTilesetTileid].ledge_dir == '1') this.solidData[x][y] = Const.SD_LEDGE_LEFT;
                    else if(tileset.tileproperties[curTilesetTileid].ledge_dir == '2') this.solidData[x][y] = Const.SD_LEDGE_UP;
                    else if(tileset.tileproperties[curTilesetTileid].ledge_dir == '3') this.solidData[x][y] = Const.SD_LEDGE_RIGHT;

                }

                ++j;

            }, this.data.width), this.data.height);

        }, tileLayers);

        R.forEach(layer => {

            R.forEach(obj => {

                const x1 = Math.round(obj.x / this.data.tilewidth);
                const y1 = Math.round(obj.y / this.data.tileheight);
                const x2 = Math.round((obj.x + obj.width) / this.data.tilewidth);
                const y2 = Math.round((obj.y + obj.height) / this.data.tileheight);

                switch(obj.type){
                    case 'tall_grass':
                        const encounters = obj.properties.encounters;
                        this.encounterAreas.push({ x1:x1, y1:y1, x2:x2, y2:y2, encounters: encounters });
                        break;
                    case 'warp':
                        this.warps.set(obj.name, {x: x1, y:y1, type: obj.properties.type, destination: obj.properties.destination});
                        break;
                    case 'point':
                        this.points.set(obj.name, {mapName: id, x: x1, y: y1, direction: !obj.properties.direction ? Const.DIR_DOWN : obj.properties.direction});
                        break;
                    default: break;
                }

            }, layer.objects);

        }, objectLayers);

    }

    getEncounterAreasAt(x, y) {

        return R.filter(area => x >= area.x1 && y >= area.y1 && x < area.x2 && y < area.y2, this.encounterAreas);
    }

    createInstance() {

        const id = Util.uuid();

        const instance = new MapInstance(this, id);

        this.instances.set(id, instance);

        return instance;
    }

    getTilesetOfTile(n) {

        let i = R.length(this.data.tilesets);

        while (i-- > 0) if (n >= this.data.tilesets[i].firstgid) return this.data.tilesets[i];

        return null;
    }

    getWarps(name){

        return this.warps.get(name);
    }

}