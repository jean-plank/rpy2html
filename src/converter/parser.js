/**
 * This file is called with node directly. Don't use ES6.
 */

const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const parseOptions = require('./optionsParser');
const parseScript = require('./scriptParser');
const parseGui = require('./guiParser');


/**
 * Parses the folder fName.
 * `options.rpy` and `script.rpy` must be present in fName/game.
 * If there si a `gui.rpy` it will be parsed too.
 * @param {string} fName
 * @returns {string} The content.
 */
function parseGame(fName) {
    const options = fileLines(path.join(fName, 'game/options.rpy'));
    const script = fileLines(path.join(fName, 'game/script.rpy'));
    const gui = fileLines(path.join(fName, 'game/gui.rpy'));

    if (options === null || script === null) {
        let missing;
        if (_([options, script]).isEqual([null, null])) {
            missing = 'options.rpy and script.rpy';
        } else {
            missing = options==null?'options.rpy':'script.rpy';
        }
        console.error(
            `${fName} is not a valid RenPy directory: missing ${missing}`);
        process.exit(1);
    }

    return parseOptions(options)
        .concat(parseScript(script))
        .concat((gui === null)?[]:parseGui(gui));
}


/**
 * Parses the file fName.
 * @param {string} fName
 * @returns {lodash<array<string>>} Non empty lines of the file.
 */
function fileLines(fName) {
    let lines;

    try {
        lines = fs.readFileSync(fName).toString().split('\n');
    } catch (e) {
        return null;
    }

    // joins the parenthesis split on several lines into one
    return _(lines).filter(l => !l.match(/(^\s*#|^\s*$)/))
        .join('\n')
        .replace(/\(([^\(\)]*)\)/gm,
            m => _.map(m.split('\n'), l => l.trim()).join(''));
}


module.exports = parseGame;
