import { Either } from 'fp-ts/lib/Either';
import * as t from 'io-ts';

import GameProps from '../gameHistory/GameProps';
import AstNode from './AstNode';

interface Args {
    idNexts?: string[];
}

export default class ShowWindow extends AstNode {
    private show: boolean;

    constructor(show: boolean, { idNexts = [] }: Args = {}) {
        super({ idNexts });
        this.show = show;
    }

    toString = (): string => `ShowWindow(${this.show})`;

    reduce = (gameProps: GameProps): GameProps => ({
        ...gameProps,
        showWindow: this.show
    })

    static decode = (showWindow: unknown): Either<t.Errors, ShowWindow> =>
        ShowWindowType.decode(showWindow).map(
            ({ arguments: [show, idNexts] }) =>
                new ShowWindow(show, { idNexts })
        )
}

const ShowWindowType = t.exact(
    t.type({
        class_name: t.literal('ShowWindow'),
        arguments: t.tuple([t.boolean, t.array(t.string)])
    })
);