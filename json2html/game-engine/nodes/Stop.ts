import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/pipeable'
import * as t from 'io-ts'

import GameProps from '../history/GameProps'
import * as SA from '../sound/SoundAction'
import AstNode from './AstNode'

export default class Stop extends AstNode {
    constructor(private chanName: string, idNexts: string[]) {
        super(idNexts)
    }

    toString = (): string => `Stop("${this.chanName}")`

    reduce = (gameProps: GameProps): GameProps => ({
        ...gameProps,
        sounds: {
            ...gameProps.sounds,
            [this.chanName]: SA.stop
        }
    })

    static decode = (hide: unknown): E.Either<t.Errors, Stop> =>
        pipe(
            StopType.decode(hide),
            E.map(
                ({ arguments: [chanName, idNexts] }) =>
                    new Stop(chanName, idNexts)
            )
        )
}

const StopType = t.exact(
    t.type({
        class_name: t.literal('Stop'),
        arguments: t.tuple([t.string, t.array(t.string)])
    })
)
