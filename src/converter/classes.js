/**
 * This file is called with node directly. Don't use ES6.
 */


/**
 * @class Block
 * @member {String}                 name
 * @member {Array<String or Block>} lines
 */
class Block {
    constructor (name, lines) {
        // if (lines.length === 0) throw RangeError('Block can\'t be empty.');
        this.name = name;
        this.lines = lines;
    }
}


/**
 * @class Action
 * @member {String} name
 * @member {Object} args
 */
class Action {
    constructor (name, args={}) {
        this.name = name;
        // _.forEach(args, (value, key) => this[key] = value);
        this.args = args;
    }
}


module.exports = {
    Block: Block,
    Action: Action,
}
