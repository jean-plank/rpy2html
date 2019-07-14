import { head } from 'fp-ts/lib/Array'
import { none, Option, some } from 'fp-ts/lib/Option'

import Sound from '../medias/Sound'

export default class Channel {
    private currentlyPlaying: Option<HTMLAudioElement> = none
    private pending: Sound[] = []

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
        this.currentlyPlaying.map(_ => (_.volume = volume))
    }

    isAlreadyPlaying = (sound: Sound): boolean =>
        this.currentlyPlaying.exists(sound.hasSameName)

    // Stops current channel and plays sounds.
    play = (...sounds: Sound[]) => {
        this.stop()
        head(sounds).map(h => {
            this.playSound(h).catch(() =>
                this.confirmAudio(() => this.play(...sounds))
            );
            [, ...this.pending] = sounds
        })
    }

    // Plays immediatly sound but does nothing to the pending queue.
    private playSound = (sound: Sound): Promise<void> =>
        this.playElement(sound.elt(this.volume, this.onEnded))

    private playElement = (elt: HTMLAudioElement): Promise<void> => {
        this.currentlyPlaying.map(Sound.stop)
        this.currentlyPlaying = some(elt)
        return Sound.play(elt)
    }

    // Stops currently playing sound and empties pending queue.
    stop = () => {
        this.currentlyPlaying.map(Sound.stop)
        this.currentlyPlaying = none
        this.pending = []
    }

    // Pauses currently playing sound.
    pause = () => this.currentlyPlaying.map(Sound.pause)

    // Resume after pause
    resume = () =>
        this.currentlyPlaying.map(_ =>
            Sound.play(_).catch(() => this.confirmAudio(this.resume))
        )

    private onEnded = () => {
        head(this.pending)
            .map(h => {
                // if sounds in pending queue
                this.playSound(h);
                [, ...this.pending] = this.pending
            })
            .getOrElseL(() => {
                // if loop start over
                if (this.loop) this.currentlyPlaying.map(this.playElement)
                // else nothing is playing anymore
                else this.currentlyPlaying = none
            })
    }
}
