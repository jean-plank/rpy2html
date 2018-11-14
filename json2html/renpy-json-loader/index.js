const path = require('path');
const fs = require('fs');
const Ajv = require('ajv');
const schemas = [
    require('./validation-jsons/renpyJson.json'),
    require('./validation-jsons/nodes.json'),
    require('./validation-jsons/fonts.json'),
    require('./validation-jsons/style.json'),
];


module.exports = function (source, map, meta) {
    const callback = this.async();

    if (typeof source !== 'string')
        return callback(EvalError(`JSON loader: source isn't string`));

    const content = JSON.parse(source);
    const ajv = new Ajv({
        allErrors: true,
        schemas: schemas
    });
    const validate = ajv.getSchema('renpyJson');

    if (!validate(content))
        return callback(EvalError(`Invalid JSON:\n${
            JSON.stringify(validate.errors, null, 2)
        }`));

    loadAllFiles(this, content, (err, res) => {
        if (err) return callback(err);
        callback(null, res, map, meta);
    });
}


async function loadAllFiles(webpack, content, callback) {
    try {
        content.help = await loadHelp(webpack, content.lang);
        content.images = await loadFiles(webpack, content.images);
        content.sounds = await loadFiles(webpack, content.sounds);
        content.fonts = await loadFiles(
            webpack,
            content.fonts,
            font => font.src,
            (font, newSrc) => ({ src: newSrc,
                                 bold: font.bold })
        );

        callback(null, JSON.stringify(content).replace(/\u2028/g, '\\u2028')
                                              .replace(/\u2029/g, '\\u2029'));
    } catch (err) {
        callback(err);
    }
}


/**
 * @param {A => string}                     getPath In case file isn't
 * directly the path.
 * @param {(file: A, newPath: string) => A} changePath In case file isn't
 * directly the path.
 */
function loadFiles(webpack, files, getPath=f=>f, changePath=(_file, newPath) => newPath) {
    return new Promise(async resolve => {
        const res = {};
        for (const key in files) {
            if (files.hasOwnProperty(key))
                res[key] =
                    await loadFile(webpack, files[key], getPath, changePath);
        }
        resolve(res);
    });
}


function loadFile(webpack, file, getPath, changePath) {
    return new Promise((resolve, reject) =>
        webpack.loadModule(
            getPath(file),
            (err, _source, _sourceMap, module) => {
                if (err) return reject(err);
                for (const res in module.buildInfo.assets) {
                    return resolve(changePath(file, res));
                }
                reject(EvalError(`Loading file: didn't find output file: "${
                    file
                }"`));
            }));
}


function loadHelp(webpack, lang) {
    return new Promise((resolve, reject) => {
        let file = path.join(__dirname, `../game-engine/help/${lang}.md`);

        if (fs.existsSync(file) && fs.lstatSync(file).isFile())
            webpack.loadModule(file, (err, res, _sourceMap, module) => {
                if (err) return reject(err);
                return resolve(eval(res));
            });
        else reject(EvalError(`Couldn't find help file: "${lang}.md"`));
    });
}
