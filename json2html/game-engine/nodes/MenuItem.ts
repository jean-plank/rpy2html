import { Either } from 'fp-ts/lib/Either';
import * as t from 'io-ts';

import convertToJs from '../utils/convertToJs';

import AstNode from './AstNode';

interface Args {
    condition?: string;
    idNexts?: string[];
}

export default class MenuItem extends AstNode {
    text: string;
    condition: boolean;

    constructor(text: string, condition: string, { idNexts = [] }: Args = {}) {
        super({ idNexts });
        this.text = text;
        this.condition = eval(convertToJs(condition)) === true;
    }

    toString = (): string => `MenuItem("${this.text}")`;

    static decode = (menuItem: unknown): Either<t.Errors, MenuItem> =>
        MenuItemType.decode(menuItem).map(
            ({ arguments: [imgName, condition, idNexts] }) =>
                new MenuItem(imgName, condition, { idNexts })
        )
}

const MenuItemType = t.exact(
    t.type({
        class_name: t.literal('MenuItem'),
        arguments: t.tuple([t.string, t.string, t.array(t.string)])
    })
);
