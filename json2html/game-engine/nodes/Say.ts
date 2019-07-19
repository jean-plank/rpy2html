import * as A from 'fp-ts/lib/Array'
import * as E from 'fp-ts/lib/Either'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import * as t from 'io-ts'

import GameProps from '../history/GameProps'
import NodeWithChar from './NodeWithChar'

export default class Say extends NodeWithChar {
    toString = (): string => {
        const args: string = A.compact([
            pipe(
                this.who,
                O.map(_ => _.name)
            ),
            O.some(this.what)
        ])
            .map(_ => `"${_}"`)
            .join(', ')
        return `Say(${args})`
    }

    reduce = (gameProps: GameProps): GameProps => ({
        ...gameProps,
        textboxChar: this.who,
        textboxText: this.what
    })

    static decode = (say: unknown): E.Either<t.Errors, Say> =>
        pipe(
            SayType.decode(say),
            E.map(
                ({ arguments: [whosName, what, idNexts] }) =>
                    new Say(O.fromNullable(whosName), what, idNexts)
            )
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
)
