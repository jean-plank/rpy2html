/**
 * This file is called with node directly. Don't use ES6.
 */

const _ = require('lodash');
const path = require('path');
const parseGame = require('./parser');


// parse input file $1
// write to output file `dist/converted.js`

const converterJsOutput = path.join(__dirname, '../../dist/converted.js');
const converterCssOutput = path.join(__dirname, '../../dist/converted.css');

if (process.argv.length === 3) {
    const fName = process.argv[2];
    const res = parseGame(fName);

    console.log('res =', res);
} else {
    console.error('Converter: illegal number of parameters, 1 required');
    process.exit(1);
}


// fs.writeFile(converterJsOutput,
// `
// import { mainApi } from '../src/game-engine/index.js';
// const $ = require('jquery');

// import jp from '/home/eisti/rpy2html/examples/TheStory/game/jpthestory.jpg';


// console.log('jp =', jp);

// $('body').append($('<img>').attr('src', jp));

// console.log(mainApi);
// `);

// fs.writeFile(converterCssOutput,
// `p {
//     font-weight: bold;
// }
// `)
