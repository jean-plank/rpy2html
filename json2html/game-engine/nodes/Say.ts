import { catOptions } from 'fp-ts/lib/Array';
import { Either } from 'fp-ts/lib/Either';
import { fromNullable, some } from 'fp-ts/lib/Option';
import * as t from 'io-ts';

import GameProps from '../store/GameProps';
import NodeWithChar from './NodeWithChar';

export default class Say extends NodeWithChar {
    toString = (): string => {
        const args: string = catOptions([
            this.who.map(_ => _.name),
            some(this.what)
        ])
            .map(_ => `"${_}"`)
            .join(', ');
        return `Say(${args})`;
    }

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
