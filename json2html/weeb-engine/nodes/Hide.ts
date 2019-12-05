import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'

import GameProps from '../history/GameProps'
import NodeWithImage from './NodeWithImage'

export default class Hide extends NodeWithImage {
    reduce = (gameProps: GameProps): GameProps =>
        pipe(
            this.media,
            O.map(image => ({
                ...gameProps,
                shown: gameProps.shown.filter(_ => _ !== image)
            })),
            O.getOrElse(() => gameProps)
        )
}
