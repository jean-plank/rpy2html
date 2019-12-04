import * as R from 'fp-ts/lib/Record'

import GameProps from '../history/GameProps'
import Video from '../medias/Video'
import NodeWithMedia from './NodeWithMedia'

export default class PlayVideo extends NodeWithMedia<Video> {
    constructor(vidName: string, idNexts: string[]) {
        super(
            (data, vidName) => R.lookup(vidName, data.videos),
            vidName,
            idNexts,
            true
        )
    }

    reduce = (gameProps: GameProps): GameProps => ({
        ...gameProps,
        video: this.media
    })
}
