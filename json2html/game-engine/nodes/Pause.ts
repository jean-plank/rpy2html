import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/pipeable'
import * as t from 'io-ts'

import GameProps from '../history/GameProps'
import AstNode from './AstNode'

export default class Pause extends AstNode {
    constructor(idNexts: string[]) {
        super(idNexts, true)
    }

    toString = (): string => `Pause()`

    reduce = (gameProps: GameProps): GameProps => ({
        ...gameProps,
        textboxHide: !gameProps.showWindow
    })

    static decode = (pause: unknown): E.Either<t.Errors, Pause> =>
        pipe(
            PauseType.decode(pause),
            E.map(({ arguments: [idNexts] }) => new Pause(idNexts))
        )
}

const PauseType = t.exact(
    t.type({
        class_name: t.literal('Pause'),
        arguments: t.tuple([t.array(t.string)])
    })
)
