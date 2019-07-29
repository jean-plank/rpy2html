import * as E from 'fp-ts/lib/Either'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import * as R from 'fp-ts/lib/Record'
import * as t from 'io-ts'

import GameProps from '../history/GameProps'
import Sound from '../medias/Sound'
import * as SA from '../sound/SoundAction'
import NodeWithMedia from './NodeWithMedia'

export default class Play extends NodeWithMedia<Sound> {
    constructor(private chanName: string, sndName: string, idNexts: string[]) {
        super(
            (data, sndName) => R.lookup(sndName, data.sounds),
            sndName,
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
            O.map(audio => ({
                ...gameProps,
                sounds: {
                    ...gameProps.sounds,
                    [this.chanName]: SA.play(audio)
                }
            })),
            O.getOrElse(() => gameProps)
        )

    static decode = (play: unknown): E.Either<t.Errors, Play> =>
        pipe(
            PlayType.decode(play),
            E.map(
                ({ arguments: [chanName, sndName, idNexts] }) =>
                    new Play(chanName, sndName, idNexts)
            )
        )
}

const PlayType = t.exact(
    t.type({
        class_name: t.literal('Play'),
        arguments: t.tuple([t.string, t.string, t.array(t.string)])
    })
)
