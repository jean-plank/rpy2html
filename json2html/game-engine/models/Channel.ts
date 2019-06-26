import { head } from 'fp-ts/lib/Array';
import { none, Option, some } from 'fp-ts/lib/Option';

import Sound from './medias/Sound';

export default class Channel {
    private confirmAudio: (okAction: () => void) => void;
    private currentlyPlaying: Option<Sound>;
    private pending: Sound[];
    private loop: boolean;
    private volume: number;

    constructor(
        confirmAudio: (okAction: () => void) => void,
        loop = false,
        volume = 0.7
    ) {
        this.confirmAudio = confirmAudio;
        this.currentlyPlaying = none;
        this.pending = [];
        this.loop = loop;
        this.volume = volume;
        this.stop();
    }

    toString = (): string =>
        `Channel(${this.currentlyPlaying}, [${this.pending
            .map(_ => _.toString())
            .join(', ')}])`

    isAlreadyPlaying = (sound: Sound): boolean =>
        this.currentlyPlaying.exists(_ => _.file === sound.file)

    // Stops current channel and plays sounds.
    play = (...sounds: Sound[]) => {
        this.stop();
        head(sounds).map(h => {
            this._play(h).catch(() =>
                this.confirmAudio(() => this.play(...sounds))
            );
            [, ...this.pending] = sounds;
        });
    }

    // Plays immediatly sound but does nothing to the pending queue.
    private _play = (sound: Sound): Promise<void> => {
        this.currentlyPlaying.map(_ => _.stop());
        sound.onEnded(this.onEnded);
        this.currentlyPlaying = some(sound);
        return sound.play(this.volume);
    }

    // Stops currently playing sound and empties pending queue.
    stop = () => {
        this.currentlyPlaying.map(_ => _.stop());
        this.currentlyPlaying = none;
        this.pending = [];
    }

    // Pauses currently playing sound.
    pause = () => this.currentlyPlaying.map(_ => _.pause());

    // Resume after pause
    resume = () =>
        this.currentlyPlaying.map(_ =>
            _.play().catch(() => this.confirmAudio(this.resume))
        )

    private onEnded = () => {
        head(this.pending)
            .map(h => {
                // if sounds in pending queue
                this._play(h);
                [, ...this.pending] = this.pending;
            })
            .getOrElseL(() => {
                // if loop start over
                if (this.loop) this.currentlyPlaying.map(_ => this._play(_));
                // else nothing is playing anymore
                else this.currentlyPlaying = none;
            });
    }
}
