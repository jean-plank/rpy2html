import { Either } from 'fp-ts/lib/Either'
import * as t from 'io-ts'

import GameProps from '../gameHistory/GameProps'
import NodeWithImage from './NodeWithImage'

export default class Hide extends NodeWithImage {
    reduce = (gameProps: GameProps): GameProps =>
        this.media
            .map(image => ({
                ...gameProps,
                charImgs: gameProps.charImgs.filter(_ => _ !== image)
            }))
            .getOrElse(gameProps)

    static decode = (hide: unknown): Either<t.Errors, Hide> =>
        HideType.decode(hide).map(
            ({ arguments: [imgName, idNexts] }) => new Hide(imgName, idNexts)
        )
}

const HideType = t.exact(
    t.type({
        class_name: t.literal('Hide'),
        arguments: t.tuple([t.string, t.array(t.string)])
    })
)
