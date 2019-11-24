import * as E from 'fp-ts/lib/Either'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import * as t from 'io-ts'

import GameProps from '../history/GameProps'
import NodeWithImage from './NodeWithImage'

export default class Scene extends NodeWithImage {
    reduce = (gameProps: GameProps): GameProps => ({
        ...gameProps,
        scene: this.media,
        shown: [],
        textboxChar: O.none,
        textboxText: ''
    })

    static decode = (scene: unknown): E.Either<t.Errors, Scene> =>
        pipe(
            SceneType.decode(scene),
            E.map(
                ({ arguments: [imgName, idNexts] }) =>
                    new Scene(imgName, idNexts)
            )
        )
}

const SceneType = t.exact(
    t.type({
        class_name: t.literal('Scene'),
        arguments: t.tuple([t.string, t.array(t.string)])
    })
)
