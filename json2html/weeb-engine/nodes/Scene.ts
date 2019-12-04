import * as O from 'fp-ts/lib/Option'

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
}
