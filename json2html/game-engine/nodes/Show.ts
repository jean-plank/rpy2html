import { Either } from 'fp-ts/lib/Either'
import * as t from 'io-ts'

import GameProps from '../history/GameProps'
import NodeWithImage from './NodeWithImage'

export default class Show extends NodeWithImage {
    reduce = (gameProps: GameProps): GameProps =>
        this.media
            .filter(_ => !gameProps.charImgs.includes(_))
            .map(_ => ({
                ...gameProps,
                charImgs: [...gameProps.charImgs, _]
            }))
            .getOrElse(gameProps)

    static decode = (show: unknown): Either<t.Errors, Show> =>
        ShowType.decode(show).map(
            ({ arguments: [imgName, idNexts] }) => new Show(imgName, idNexts)
        )
}

const ShowType = t.exact(
    t.type({
        class_name: t.literal('Show'),
        arguments: t.tuple([t.string, t.array(t.string)])
    })
)
