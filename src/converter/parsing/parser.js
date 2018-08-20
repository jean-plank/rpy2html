/**
 * This file is called with node directly. Don't use ES6.
 */

const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const utils = require('../utils');
const parseOptions = require('./optionsParser');
const parseScript = require('./scriptParser');
const parseGui = require('./guiParser');


/**
 * Parses the folder fName.
 * `options.rpy` and `script.rpy` must be present in fName/game.
 * If there si a `gui.rpy` it will be parsed too.
 * @param {String} fName Folder name
 * @returns {String} The content.
 */
function parseGame(fName) {
    // const lOptions = fileLines(path.join(fName, 'game/options.rpy'));
    const lScript = fileLines(path.join(fName, 'game/script.rpy'));
    const lGui = fileLines(path.join(fName, 'game/gui.rpy'));

    // if (lOptions === null || lScript === null) {
    //     let missing;
    //     if (_([lOptions, lScript]).isEqual([null, null]))
    //         missing = 'options.rpy and script.rpy';
    //     else missing = lOptions==null?'options.rpy':'script.rpy';
    //     console.error(
    //         `${fName} is not a valid RenPy directory: missing ${missing}`);
    //     process.exit(1);
    // }

    // const options = parseOptions(lOptions);
    const options = {};
    const gui = parseGui(lGui);
    const defaultOpts = { window_title: path.basename(fName),
                          window_icon: null,
                          main_menu_background: null,
                          main_menu_music: null };

    return { options: _.merge(defaultOpts, options, gui),
             script: parseScript(lScript) };
}


function cleanFileContent(fileContent) {
    // remove first character (which is a strange invisible one)
    if (fileContent.charCodeAt(0) === 65279) fileContent = fileContent.slice(1);

    return _(fileContent.split('\n'))
        // remove commented and empty lines
        .filter(l => !l.match(/(^\s*#|^\s*$)/))
        // remove comments from the end of the line
        .map(utils.removeComments)
        .join('\n')
        // join the parenthesis and the quotes split on several lines into one
        .replace(
            /(\([^\(\)]*\)|"[^"]*")/gm,
            m => _.map(m.split('\n'), l => l.trim()).join(''))
        .split('\n');
}


/**
 * Parses the file fName.
 * @param {String} fName
 * @returns {Array<String>} Non empty lines of the file. null if reading file
 * failed.
 */
function fileLines(fName) {
    let res;
    try {
        res = fs.readFileSync(fName).toString();
    } catch (e) {
        return null;
    }
    return cleanFileContent(res);
}


module.exports = parseGame;
