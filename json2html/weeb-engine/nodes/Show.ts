import * as E from 'fp-ts/lib/Either'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import * as t from 'io-ts'

import GameProps from '../history/GameProps'
import NodeWithImage from './NodeWithImage'

export default class Show extends NodeWithImage {
    reduce = (gameProps: GameProps): GameProps =>
        pipe(
            this.media,
            O.filter(_ => !gameProps.shown.includes(_)),
            O.map(_ => ({
                ...gameProps,
                shown: [...gameProps.shown, _]
            })),
            O.getOrElse(() => gameProps)
        )

    static decode = (show: unknown): E.Either<t.Errors, Show> =>
        pipe(
            ShowType.decode(show),
            E.map(
                ({ arguments: [imgName, idNexts] }) =>
                    new Show(imgName, idNexts)
            )
        )
}

const ShowType = t.exact(
    t.type({
        class_name: t.literal('Show'),
        arguments: t.tuple([t.string, t.array(t.string)])
    })
)
