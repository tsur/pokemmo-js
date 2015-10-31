"use strict";

import R from 'ramda';
import fs from 'fs';
import crypto from 'crypto';

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

/**
 *
 * @param value
 * @param w
 * @param h
 */
export const initMatrix = (value, w, h) => R.map(() => R.map(()=> value, R.range(0,h)), R.range(0,w));

/**
 *
 * @param pass
 * @param salt
 */
export function sha512(pass, salt) {

    const hasher = crypto.createHash('sha512');

    if (!salt) hasher.update(pass, 'ascii');
    else hasher.update(`${pass}#${salt}`, 'ascii');

    return hasher.digest('base64');
}