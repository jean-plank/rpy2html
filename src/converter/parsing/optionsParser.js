/**
 * This file is called with node directly. Don't use ES6.
 */

const _ = require('lodash');
const utils = require('../utils');


// checks if l can be reconized by one of the readers (l already trimed)
/** @type {Array<String => Any>} */
const readers = [
    // window_title (jp1)
    (l) => {
        // jp1
        let found = l.match(/^config\.window_title\s*=\s*u"(.*)"$/);
        if (found === null) {
            // jp2+
            found = l.match(/^define\s+config\.name\s*=\s*_\("(.*)"\)$/);
            if (found === null) return null;
        }
        return { window_title: found[1] };
    },
    // theme.threeD
    (l) => {
        const found = l.match(/^theme\.threeD\s*\((.*)\)$/)
        if (found === null) return null;
        const res = _(found[1].split(','))
            .map(arg => _.map(
                arg.split('='),
                s => utils.cleanStr(s.trim())))
            .filter(arg => arg.length === 2)
            .map(arg => {
                const res = {};
                res[arg[0]] = arg[1];
                return res;
            })
            .reduce((acc, o) => _.merge(acc, o), {});
        if (_.has(res, 'mm_root')) res.main_menu_background = res.mm_root;
        return _.pick(
            res,
            [ // add here all the names of needed threeD options
              'main_menu_background' ]);
    },
    // main_menu_music (jp1)
    (l) => {
        let found = l.match(
            /^(define\s+)?config\.main_menu_music\s*=\s*"(.*)"$/);
        if (found === null) return null;
        return { main_menu_music: found[2] };
    },
    // window_icon
    (l) => {
        let found = l.match(/^define\s+config\.window_icon\s*=\s*"(.*)"$/);
        if (found === null) return null;
        return { window_icon: found[1] };
    },
];


/**
 * @param {Array<String>} lines
 * @returns {Array<Any>} Recognized lines.
 */
function parseOptions(lines) {
    return _.reduce(
        utils.parseLines(readers, lines, false),
        (acc, o) => _.merge(acc, o), {});
}


module.exports = parseOptions;
