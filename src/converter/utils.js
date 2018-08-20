/**
 * This file is called with node directly. Don't use ES6.
 */

const _ = require('lodash');


/**
 * @param {Array<String => Any>} readers Functions that can recognize a line.
 * @param {String}               line    Line to recognize.
 * @param {Boolean}              warn    If non recognized line should be
 *                                       warned.
 * @returns {Any} Returns the recognized line converted with the found reader.
 *                Returns null if no reader found.
 */
function parseLine(readers, line, warn=true) {
    const trimed = line.trim();
    let readLine;
    // find the first truthy reader
    const found = _.find(readers, f => readLine = f(trimed));
    if (found === undefined) {
        if (warn) console.warn(`[WARN] line not read: "${trimed}"`);
        return null;
    } else return readLine;
}


function parseLines(readers, lines, warn=true) {
    return _(lines)
        .map(l => parseLine(readers, l, warn))
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
 * @returns {Boolean} null is str is a python None.
 *                    A boolean if str is a python boolean.
 *                    undefined else.
 */
function parseBool(str) {
    switch (str) {
        case 'True': return true;
        case 'False': return false;
        case 'None': return null;
    }
}

/**
 * @param {String} str
 * @returns {Any} null if str is a python None.
 *                A number if str is a python number.
 *                A boolean if str is a python boolean.
 *                A string if str is a python string.
 *                undefined else.
 */
function parsePython(str) {
    let res = parseFloat(str);
    if (Number.isNaN(res)) {
        res = parseBool(str);
        if (res === undefined) {
            if (str.match(/(^".*"$|^'.*'$)/)) return str.slice(1, -1);
            else return undefined;
        }
    }
    return res;
}


/**
 * Remove python comments.
 * @param {String} line
 */
function removeComments(line) {
    // _.takeWhile(list, cond) concatenated with the next element
    function myTakeWhile(list, cond, acc) {
        if (list.length === 0) return acc;
        if (!cond(list[0])) return _.concat(acc, list[0]);
        return myTakeWhile(_.tail(list), cond, _.concat(acc, list[0]))

    }
    const closedQuotes = /^([^'"]*|([^'"]*("([^"]|\\")*"|'([^']|\\')*'))+[^'"]*)$/;
    const chunks = line.split('#');
    if (chunks.length > 1) {
        if (chunks[0].match(closedQuotes)) return chunks[0];
        else return myTakeWhile(
            _.tail(chunks),
            (chunk) => chunk.match(closedQuotes),
            [chunks[0]]).join('#');
    }
    return line;
}


module.exports = {
    parseLine: parseLine,
    parseLines: parseLines,
    cleanStr: cleanStr,
    parsePython: parsePython,
    removeComments: removeComments,
};
