/**
 * This file is called with node directly. Don't use ES6.
 */

const _ = require('lodash');
const utils = require('./utils');


// checks if l can be reconized by one of the readers
const readers = [
    // generic define gui.something
    (l) => {
        let found = l.match(
            /^define\s+gui\.(\w+)\s*=\s*(.*)$/);
        if (found === null) return null;
        const res = {};
        const val = utils.parsePython(found[2]);
        if (val === undefined) return null;
        res[found[1]] = val;
        return res;
    },
];


/**
 * @param {Array<String>} lines
 * @returns {Array<Any>} Recognized lines.
 */
function parseScript(lines) {
    const blocks = getBlocks(_.concat(_.head(lines).slice(1), _.tail(lines)));

    return blocks;
}


function getBlocks(lines) {
    return _(lines).reduce((acc, l) => {
        if (_.startsWith(l, '    ')) {
            const last = acc.last();
            if (Array.isArray(last)) {
                return acc.slice(0, -1).concat([_.concat(last, l.slice(4))]);
            } else {
                return acc.concat([[l.slice(4)]]);
            }
        } else {
            return acc.concat(l);
        }
    }, _([]))
    .map(l => {
        if (Array.isArray(l)) {
            return getBlocks(l);
        } else {
            return l.trim();
        }
    })
    .value();
}


module.exports = parseScript;
