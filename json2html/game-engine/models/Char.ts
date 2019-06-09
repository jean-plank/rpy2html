import { fromNullable, Option } from 'fp-ts/lib/Option';

import { RawChar } from '../../renpy-json-loader/RenpyJson';

export default class Char {
    name: string;
    color: Option<string>;

    constructor(name: string, color: Option<string>) {
        this.name = name;
        this.color = color;
    }

    toString = (): string =>
        `Char("${this.name}${this.color
            .map(_ => ', this.color')
            .getOrElse('')}")`

    static fromRawChar = (char: RawChar): Char =>
        new Char(char.name, fromNullable(char.color))
}
