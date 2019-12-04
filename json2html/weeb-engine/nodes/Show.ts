import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'

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
}
