/**
 * This file is called with node directly. Don't use ES6.
 */

const _ = require('lodash');


/**
 * @param {Array<Function>} readers Function that can recognize a line.
 * @param {Array<String>} lines Lines to recognize
 * @param {Boolean} warn Warn non recognized lines.
 * @returns {Array<Any>} Returns the recognized lines converted with the found
 * reader.
 */
function parse(readers, lines, warn=true) {
    return _(lines).map(l => {
        const lTrimed = l.trim();
        let readLine;
        // find the first truthy reader
        const found = _.find(readers, f => readLine = f(lTrimed));

        if (found === undefined) {
            if (warn) console.warn(`[WARN] line not read: "${l}"`);
            return null;
        } else {
            return readLine;
        }
    })
    // remove non truthy lines
    .compact()
    .value();
}


/**
 * '"toto"' => 'toto'
 * "'toto'" => 'toto'
 * 'toto' => 'toto'
 * @param {String} str the string to clean
 * @returns {String} Returns str cleaned.
 */
function cleanStr(str) {
    return str.replace(/(^".*"$|^'.*'$)/, m => m.slice(1, -1));
}


/**
 * @param {String} str
 * @returns {Any}
 * null is str is a python None.
 * A boolean if str is a python boolean.
 * undefined else.
 */
function parseBool(str) {
    switch (str) {
        case 'True': return true;
        case 'False': return false;
        case 'None': return null;
        default: return undefined;
    }
}

/**
 * @param {String} str
 * @returns {Any}
 * null if str is a python None.
 * A number if str is a python number.
 * A boolean if str is a python boolean.
 * A string if str is a python string.
 * undefined else.
 */
function parsePython(str) {
    let res = parseFloat(str);
    if (Number.isNaN(res)) {
        res = parseBool(str);
        if (res === undefined) {
            if (str.match(/(^".*"$|^'.*'$)/)) {
                return str.slice(1, -1);
            } else {
                return undefined;
            }
        }
    }
    return res;
}


module.exports = {
    parse: parse,
    cleanStr: cleanStr,
    parsePython: parsePython,
};
