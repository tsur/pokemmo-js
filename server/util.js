"use strict";

import R from 'ramda';
import fs from 'fs';

export const loadFile = R.compose(JSON.parse, str => str.replace(/\/\/[^\n\r]*/gm, ''), fs.readFileSync);