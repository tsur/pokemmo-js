"use strict";

import R from 'ramda';
import fs from 'fs';

/**
 * GAME CONSTANTS
 * @type {number}
 */
export const SPEED_HACK_N = 12;
export const DIR_DOWN = 0;
export const DIR_LEFT = 1;
export const DIR_UP = 2;
export const DIR_RIGHT = 3;
export const LOAD_MAPS = [
    'pallet',
    'pallet_hero_home_1f',
    'pallet_hero_home_2f',
    'pallet_oaklab',
    'pallet_rival_home',
    'pewter',
    'viridianforest'
];
export const POKEMON_STARTERS = ["1", "4", "7", "10", "13", "16", "25", "29", "32", "43", "60", "66", "69", "74", "92", "133"];
export const CHARACTER_SPRITES = ["red", "red_-135", "JZJot", "22jM7"];

/**
 * MAP CONSTANTS
 * @type {string}
 */
export const LAYER_TILELAYER = "tilelayer";
export const LAYER_OBJECTGROUP = "objectgroup";
export const SD_NONE= 0;
export const SD_SOLID= 1;
export const SD_WATER= 2;
export const SD_LEDGE_DOWN= 3;
export const SD_LEDGE_LEFT= 4;
export const SD_LEDGE_UP= 5;
export const SD_LEDGE_RIGHT= 6;
export const SD_GRASS= 7;

/**
 * SERVER CONSTANTS
 * @type {number}
 */

export const DB_HOST = '127.0.0.1';
export const DB_PORT = 27017;
export const PORT = 2828;
export const MAX_CLIENTS= 100;