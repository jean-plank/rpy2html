import { Either } from 'fp-ts/lib/Either';
import { none, Option } from 'fp-ts/lib/Option';
import * as t from 'io-ts';

import Choice from '../models/Choice';
import GameProps from '../store/GameProps';
import MenuItem from './MenuItem';
import NodeWithChar from './NodeWithChar';

export default class Menu extends NodeWithChar {
    protected _nexts: Option<MenuItem[]>;

    toString = (): string =>
        `Menu(${this.who
            .map(_ => `"${_.name}"`)
            .fold([], _ => [_])
            .concat(`"${this.what}"`, this.nexts().map(_ => `"${_.text}"`))
            .join(', ')})`

    reduce = (gameProps: GameProps): Partial<GameProps> => {
        const res = super.reduce(gameProps);
        const choices: Choice[] = this.nexts().map(
            next =>
                new Choice(next.text, (e: React.MouseEvent) => {
                    e.stopPropagation();
                    this.execThenExecNext(next)();
                })
        );
        if (this.what === '') {
            return {
                ...res,
                textboxHide: true,
                choices
            };
        }
        return {
            ...res,
            textboxChar: this.who,
            textboxText: this.what,
            choices
        };
    }

    nexts = (): MenuItem[] =>
        this._nexts.map(_ => _.filter(_ => _.condition)).getOrElse([])

    static decode = (menu: unknown): Either<t.Errors, Menu> =>
        // TODO: correct menu with caption parsing
        MenuType.decode(menu).map(
            ({ arguments: [what, idNexts] }) =>
                new Menu(none, what, { idNexts })
        )
}

const MenuType = t.exact(
    t.type({
        class_name: t.literal('Menu'),
        arguments: t.tuple([t.string, t.array(t.string)])
    })
);
