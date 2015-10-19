"use strict";

import R from 'ramda';
import * as Util from './util.js';

export default class GameMap {

    constructor(id){

        this.id = id;

        this.data = Util.loadFile(`${__dirname}/../resources/maps/${id}.json`, 'utf8');

        this.warps= new Map();
        this.instances = new Map();
        this.points = new Map();
        this.encounterAreas = [];

        this.playersPerInstance = this.data.properties.players_per_instance == null ?
            0 : parseInt(this.data.properties.players_per_instance);


        if (this.data.properties.grass_encounters != null) {
            this.grassEncounters = this.data.properties.grass_encounters;
        }

        //for (layer in data.layers) {
        //    if (layer.type == LAYER_TILELAYER) {
        //        if (layer.properties == null || layer.properties.data_layer != '1') continue;
        //
        //        var j = 0;
        //
        //        var twidth = data.width;
        //        var theight = data.height;
        //
        //        solidData = untyped __js__("new Array(twidth)");
        //        for (x in 0...twidth) {
        //            solidData[x] = untyped __js__("new Array(theight)");
        //            for (y in 0...theight) {
        //                solidData[x][y] = SD_NONE;
        //            }
        //        }
        //
        //        for (y in 0...theight) {
        //            for (x in 0...twidth) {
        //                var tileid = layer.data[j];
        //                if (tileid == null || tileid == 0) {
        //                    ++j;
        //                    continue;
        //                }
        //
        //                var tileset = getTilesetOfTile(tileid);
        //                if (tileset == null) "Tileset is null";
        //
        //                var curTilesetTileid = tileid - tileset.firstgid;
        //
        //                if(tileset.tileproperties[curTilesetTileid] != null){
        //                    if(tileset.tileproperties[curTilesetTileid].solid == '1'){
        //                        solidData[x][y] = SD_SOLID;
        //                    }else if(tileset.tileproperties[curTilesetTileid].water == '1'){
        //                        solidData[x][y] = SD_WATER;
        //                    }else if(tileset.tileproperties[curTilesetTileid].grass == '1'){
        //                        solidData[x][y] = SD_GRASS;
        //                    }else if(tileset.tileproperties[curTilesetTileid].ledge == '1'){
        //                        solidData[x][y] = SD_LEDGE_DOWN;
        //                        if(tileset.tileproperties[curTilesetTileid].ledge_dir == '1'){
        //                            solidData[x][y] = SD_LEDGE_LEFT;
        //                        }else if(tileset.tileproperties[curTilesetTileid].ledge_dir == '2'){
        //                            solidData[x][y] = SD_LEDGE_UP;
        //                        }else if(tileset.tileproperties[curTilesetTileid].ledge_dir == '3'){
        //                            solidData[x][y] = SD_LEDGE_RIGHT;
        //                        }
        //                    }
        //                }
        //
        //                ++j;
        //            }
        //        }
        //    }else if(layer.type == LAYER_OBJECTGROUP){
        //        for(obj in layer.objects){
        //            var x1 = Math.round(obj.x / data.tilewidth);
        //            var y1 = Math.round(obj.y / data.tileheight);
        //            var x2 = Math.round((obj.x + obj.width) / data.tilewidth);
        //            var y2 = Math.round((obj.y + obj.height) / data.tileheight);
        //            switch(obj.type){
        //                case 'tall_grass':
        //                    var encounters = Node.parse('{"tmp":['+ obj.properties.encounters + ']}').tmp;
        //                    encounterAreas.push( { x1:x1, y1:y1, x2:x2, y2:y2, encounters: encounters } );
        //                case 'warp':
        //                    warps.set(obj.name, {x: x1, y:y1, type: obj.properties.type, destination: Node.parse(obj.properties.destination)});
        //                case 'point':
        //                    points.set(obj.name, {mapName: id, x: x1, y: y1, direction: obj.properties.direction == null ? GameConst.DIR_DOWN : obj.properties.direction});
        //            }
        //        }
        //    }
        //}

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