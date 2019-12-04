import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import * as R from 'fp-ts/lib/Record'

import GameProps from '../history/GameProps'
import { Listenable } from '../medias/Media'
import Sound from '../medias/Sound'
import * as SA from '../sound/SoundAction'
import NodeWithMedia from './NodeWithMedia'

export default class Play extends NodeWithMedia<Sound> {
    constructor(
        private chanName: string,
        mediaName: string,
        private loop: boolean,
        idNexts: string[]
    ) {
        super(
            (data, mediaName) =>
                pipe(
                    R.lookup<Listenable>(mediaName, data.sounds),
                    O.alt(() => R.lookup(mediaName, data.videos))
                ),
            mediaName,
            idNexts
        )
    }

    toString = (): string => `Play("${this.chanName}", "${this.mediaName}")`

    reduce = (gameProps: GameProps): GameProps =>
        (this.chanName === 'audio' ? this.reduceAudio : this.reduceSounds)(
            gameProps
        )

    private reduceAudio = (gameProps: GameProps): GameProps =>
        pipe(
            this.media,
            O.map(audio => ({
                ...gameProps,
                audios: [...gameProps.audios, audio]
            })),
            O.getOrElse(() => gameProps)
        )

    private reduceSounds = (gameProps: GameProps): GameProps =>
        pipe(
            this.media,
            O.map<Sound, GameProps>(audio => ({
                ...gameProps,
                sounds: {
                    ...gameProps.sounds,
                    [this.chanName]: SA.play([audio, this.loop])
                }
            })),
            O.getOrElse(() => gameProps)
        )
}
