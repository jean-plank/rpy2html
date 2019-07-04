import { Either } from 'fp-ts/lib/Either';
import * as t from 'io-ts';

import GameProps from '../gameHistory/GameProps';
import AstNode from './AstNode';

export default class Pause extends AstNode {
    constructor(idNexts: string[]) {
        super(idNexts, true);
    }

    toString = (): string => `Pause()`;

    reduce = (gameProps: GameProps): GameProps => ({
        ...gameProps,
        textboxHide: !gameProps.showWindow
    })

    static decode = (pause: unknown): Either<t.Errors, Pause> =>
        PauseType.decode(pause).map(
            ({ arguments: [idNexts] }) => new Pause(idNexts)
        )
}

const PauseType = t.exact(
    t.type({
        class_name: t.literal('Pause'),
        arguments: t.tuple([t.array(t.string)])
    })
);
