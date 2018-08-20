/**
 * This file is called with node directly. Don't use ES6.
 */

const _ = require('lodash');
const utils = require('../utils');
const Block = require('../classes').Block;
const Action = require('../classes').Action;


// checks if l can be reconized by one of the readers
/** @type {Array<String => Action>} */
const readers = [
    // image imageName = "image_file.png"
    (l) => {
        let found = l.match(/^image\s+([\w\-]+)\s*=\s*"(.+\.\w+)"$/);
        if (found === null) return null;
        return new Action(
            'declareImg',
            { name: found[1].replace('-', '_'), file: found[2] });
    },

    // scene imageName
    (l) => {
        let found = l.match(/^scene\s+(\w+)$/);
        if (found === null) return null;
        return new Action('showScene', { imgName: found[1] });
    },

    // show imageName
    (l) => {
        const found = l.match(/^show\s+(\w+)$/);
        if (found === null) return null;
        return new Action('showImg', { imgName: found[1] });
    },

    // hide imageName
    (l) => {
        const found = l.match(/^hide\s+(\w+)$/);
        if (found === null) return null;
        return new Action('hideImg', { imgName: found[1] });
    },

    // play music "music_file.ogg" [options]
    (l) => {
        const found = l.match(/^play\s+music\s+"(.+\.\w+)"\s*(.*)$/);
        if (found === null) return null;
        // if (found[2] ===  '')
        const opts = _(found[2].split(/\s/))
            .compact()
            .chunk(2)
            .reduce(
                (acc, tuple) => {
                    let val = null;
                    if (tuple.length === 2) val = tuple[1];
                    const res = {};
                    res[tuple[0]] = val;
                    return _.merge(acc, res);
                },
                {});
        return new Action('playMusic', { fileName: found[1], options: opts });
    },

    // play sound "sound_file.ogg"
    (l) => {
        const found = l.match(/^play\s+sound\s+"(.+\.\w+)"$/);
        if (found === null) return null;
        return new Action('playSound', { fileName: found[1] });
    },

    // stop sound
    (l) => {
        const found = l.match(/^stop\s+sound$/);
        if (found === null) return null;
        return new Action('stopSound');
    },

    // voice "voice_file.ogg"
    (l) => {
        const found = l.match(/^voice\s+"(.+\.\w+)"$/);
        if (found === null) return null;
        return new Action('voice', { fileName: found[1] });
    },

    // stop music
    (l) => {
        const found = l.match(/^stop\s+music$/);
        if (found === null) return null;
        return new Action('stopMusic');
    },

    // define charName = Character("Name", color="#c8ffc8")
    (l) => {
        const found = l.match(
            /^define\s+(\w+)\s*=\s*Character\s*\(\s*(".*"|'.*')\s*,\s*color\s*=\s*(".*"|'.*')\s*\)$/
        );
        if (found === null) return null;
        return new Action(
            'defineChar',
            { name: found[1],
              display: utils.cleanStr(found[2]),
              color: utils.cleanStr(found[3]) });
    },

    // "Simple text."
    // charName "Text."
    (l) => {
        const found = l.match(/^(\w*)\s*"(.*)"$/);
        if (found === null) return null;
        if (found[1] === '') return new Action('text', found[2]);
        return new Action('charSays', { char: found[1], text: found[2] });
    },

    // $ varName = value
    (l) => {
        const found = l.match(/^\$\s+(\w+)\s*=\s*(.+)$/);
        if (found === null) return null;
        return new Action('var', { name: found[1], value: found[2] });
    },

    // $ renpy.movie_cutscene("video_name.mp4")
    (l) => {
        const found = l.match(
            /^\$\s+renpy.movie_cutscene\(\s*(".*"|'.*')\s*\)$/);
        if (found === null) return null;
        return new Action('playVideo', { fileName: found[1] });
    },

    // jump label_name
    (l) => {
        const found = l.match(/^jump\s+(\w+)$/);
        if (found === null) return null;
        return new Action('jump', { labelName: found[1] });
    },

    // return
    (l) => {
        const found = l.match(/^return$/);
        if (found === null) return null;
        return new Action('return');
    },
];


/**
 * @param {Array<String>} lines
 * @returns {Array<Any>} Recognized lines.
 */
function parseScript(lines) {
    function parseScriptRec(lines, acc) {
        if (lines.length === 0) return acc.value();
        else {
            const l = _.head(lines);
            const found = l.match(/^(\S.*):\s*$/);
            if (found === null) {
                const parsed = utils.parseLine(readers, l, true);
                if (parsed === null) return parseScriptRec(_.tail(lines), acc);
                else return parseScriptRec(_.tail(lines), acc.concat(parsed));
            } else {
                const linesTail = _(lines).tail();
                const blockLines = linesTail
                    .takeWhile(l => _.startsWith(l, '    '))
                    .map(l => l.slice(4))
                    .value();
                const linesRemain = linesTail.slice(blockLines.length).value();
                const newAcc = acc.concat(
                    new Block(
                        found[1],
                        parseScript(blockLines)));
                return parseScriptRec(linesRemain, newAcc);
            }
        }
    }
    return parseScriptRec(lines, _([]));
}


module.exports = parseScript;
