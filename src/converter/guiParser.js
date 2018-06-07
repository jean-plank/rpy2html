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
function parseGui(lines) {
    const res = _.reduce(utils.parse(readers, lines, false),
        (acc, o) => _.merge(acc, o), {});

    return _.pick(res, ['main_menu_background']);
}


module.exports = parseGui;
