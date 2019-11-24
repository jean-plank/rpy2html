import * as E from 'fp-ts/lib/Either'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import * as t from 'io-ts'

import GameProps from '../history/GameProps'
import NodeWithImage from './NodeWithImage'

export default class Hide extends NodeWithImage {
    reduce = (gameProps: GameProps): GameProps =>
        pipe(
            this.media,
            O.map(image => ({
                ...gameProps,
                charImgs: gameProps.shown.filter(_ => _ !== image)
            })),
            O.getOrElse(() => gameProps)
        )

    static decode = (hide: unknown): E.Either<t.Errors, Hide> =>
        pipe(
            HideType.decode(hide),
            E.map(
                ({ arguments: [imgName, idNexts] }) =>
                    new Hide(imgName, idNexts)
            )
        )
}

const HideType = t.exact(
    t.type({
        class_name: t.literal('Hide'),
        arguments: t.tuple([t.string, t.array(t.string)])
    })
)
