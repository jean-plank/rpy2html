import * as A from 'fp-ts/lib/Array'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'

import { Listenable } from '../medias/Media'
import SoundElement from '../medias/SoundElement'

export default class Channel {
    private currentlyPlaying: O.Option<HTMLAudioElement> = O.none
    private pending: Listenable[] = []

    constructor(
        private confirmAudio: (okAction: () => void) => void,
        private volume: number,
        private loop = false
    ) {}

    toString = (): string =>
        `Channel(${this.currentlyPlaying}, [${this.pending
            .map(_ => _.toString())
            .join(', ')}])`

    setVolume = (volume: number) => {
        this.volume = volume
        pipe(
            this.currentlyPlaying,
            O.map(_ => (_.volume = volume))
        )
    }

    isAlreadyPlaying = (sound: Listenable): boolean =>
        pipe(this.currentlyPlaying, O.exists(sound.hasSameName))

    // Stops current channel and plays sounds.
    play = (...sounds: Listenable[]) => {
        this.stop()
        pipe(
            A.head(sounds),
            O.map(h => {
                this.playSound(h).catch(() =>
                    this.confirmAudio(() => this.play(...sounds))
                )
                ;[, ...this.pending] = sounds
            })
        )
    }

    // Plays immediatly sound but does nothing to the pending queue.
    private playSound = (sound: Listenable): Promise<void> =>
        this.playElement(sound.soundElt(this.volume, this.onEnded))

    private playElement = (elt: HTMLAudioElement): Promise<void> => {
        pipe(this.currentlyPlaying, O.map(SoundElement.stop))
        this.currentlyPlaying = O.some(elt)
        return SoundElement.play(elt)
    }

    // Stops currently playing sound and empties pending queue.
    stop = () => {
        pipe(this.currentlyPlaying, O.map(SoundElement.stop))
        this.currentlyPlaying = O.none
        this.pending = []
    }

    // Pauses currently playing sound.
    pause = () => pipe(this.currentlyPlaying, O.map(SoundElement.pause))

    // Resume after pause
    resume = () =>
        pipe(
            this.currentlyPlaying,
            O.map(_ =>
                SoundElement.play(_).catch(() => this.confirmAudio(this.resume))
            )
        )

    private onEnded = () =>
        pipe(
            A.head(this.pending),
            O.map(h => {
                // if sounds in pending queue
                this.playSound(h)
                ;[, ...this.pending] = this.pending
            }),
            O.getOrElse(() => {
                // if loop start over
                if (this.loop) {
                    pipe(this.currentlyPlaying, O.map(this.playElement))
                }
                // else nothing is playing anymore
                else this.currentlyPlaying = O.none
            })
        )
}
