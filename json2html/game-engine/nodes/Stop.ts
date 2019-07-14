import { Either } from 'fp-ts/lib/Either'
import { none } from 'fp-ts/lib/Option'
import { insert } from 'fp-ts/lib/StrMap'
import * as t from 'io-ts'

import GameProps from '../history/GameProps'
import AstNode from './AstNode'

export default class Stop extends AstNode {
    constructor(private chanName: string, idNexts: string[]) {
        super(idNexts)
    }

    toString = (): string => `Stop("${this.chanName}")`

    reduce = (gameProps: GameProps): GameProps => ({
        ...gameProps,
        sounds: insert(this.chanName, none, gameProps.sounds)
    })

    static decode = (hide: unknown): Either<t.Errors, Stop> =>
        StopType.decode(hide).map(
            ({ arguments: [chanName, idNexts] }) => new Stop(chanName, idNexts)
        )
}

const StopType = t.exact(
    t.type({
        class_name: t.literal('Stop'),
        arguments: t.tuple([t.string, t.array(t.string)])
    })
)
