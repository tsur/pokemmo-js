"use strict";

import R from 'ramda';
import fs from 'fs';

/**
 *
 * @param path {string} file path
 * @param encoding {string} file encoding
 */
export const loadFile = R.compose(JSON.parse, str => str.replace(/\/\/[^\n\r]*/gm, ''), fs.readFileSync);

/**
 *
 * @returns {string}
 */
export function uuid() {

    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

/**
 *
 * @param iterator
 */
export const iterate = iterator => g => {

    const _iterate = () => g(() => iterator(_iterate));

    iterator(_iterate);

};

export const initMatrix = (value, w, h) => R.map(() => R.map(()=> value, R.range(0,h)), R.range(0,w));