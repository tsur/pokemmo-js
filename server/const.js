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
export const PORT = 2828;