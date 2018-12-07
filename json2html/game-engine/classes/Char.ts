import * as _ from 'lodash';


export default class Char {
    name: string;
    color: string | undefined;

    constructor (name: string, color?: string) {
        this.name = name;
        this.color = color;
    }

    toString(): string {
        return `Char("${this.name}${this.color !== undefined
            ? ', this.color'
            : ''}")`;
    }

    static fromAny(char: any): Char | null {
        if (  _.keys(char).length === 2
           && _.has(char, 'name') && _.isString(char.name)
           && _.has(char, 'color') &&
               (_.isString(char.color) || char.color === undefined)) {
            return new Char(char.name, char.color);
        } else return null;
    }
}
