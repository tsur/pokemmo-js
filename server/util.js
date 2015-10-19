"use strict";

import R from 'ramda';
import fs from 'fs';

export const loadFile = R.compose(JSON.parse, str => str.replace(/\/\/[^\n\r]*/gm, ''), fs.readFileSync);

export function uuid() {

    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}