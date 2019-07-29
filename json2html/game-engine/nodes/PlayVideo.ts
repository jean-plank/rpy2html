import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/pipeable'
import * as R from 'fp-ts/lib/Record'
import * as t from 'io-ts'

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

    static decode = (playVideo: unknown): E.Either<t.Errors, PlayVideo> =>
        pipe(
            PlayVideoType.decode(playVideo),
            E.map(
                ({ arguments: [vidName, idNexts] }) =>
                    new PlayVideo(vidName, idNexts)
            )
        )
}

const PlayVideoType = t.exact(
    t.type({
        class_name: t.literal('Video'),
        arguments: t.tuple([t.string, t.array(t.string)])
    })
)
