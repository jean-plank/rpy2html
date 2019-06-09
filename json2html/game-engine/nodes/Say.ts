import { Either } from 'fp-ts/lib/Either';
import { fromNullable } from 'fp-ts/lib/Option';
import * as t from 'io-ts';

import GameProps from '../store/GameProps';
import NodeWithChar from './NodeWithChar';

export default class Say extends NodeWithChar {
    toString = (): string =>
        `Say(${this.who
            .map(_ => `"${_.name}"`)
            .fold([], _ => [_])
            .concat(`"${this.what}"`)
            .join(', ')})`

    reduce = (gameProps: GameProps): Partial<GameProps> => ({
        ...super.reduce(gameProps),
        textboxChar: this.who,
        textboxText: this.what
    })

    static decode = (say: unknown): Either<t.Errors, Say> =>
        SayType.decode(say).map(
            ({ arguments: [whosName, what, idNexts] }) =>
                new Say(fromNullable(whosName), what, { idNexts })
        )
}

const SayType = t.exact(
    t.type({
        class_name: t.literal('Say'),
        arguments: t.tuple([
            t.union([t.string, t.null]),
            t.string,
            t.array(t.string)
        ])
    })
);
