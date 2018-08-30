import * as _ from 'lodash';

import { Story } from './Story';
import { Sound } from './Sound';


export class Channel {
    private currentlyPlaying: Sound;
    private pending: Array<Sound>;
    private loop: boolean;
    private volume: number;

    constructor (loop=false, volume=0.7) {
        this.loop = loop;
        this.volume = volume;
        this.stop();
    }

    /**
     * Stop current channel and plays sound.
     */
    play(sound: Sound | Array<Sound>): void {
        let promise: Promise<void>;
        this.stop();

        if (_.isArray(sound)) {
            promise = this._play(_.head(sound));
            this.pending = _.tail(sound);
        } else {
            promise = this._play(sound);
        }

        if (promise != undefined) {
            const siht = this;

            promise.catch(() =>
                Story.getInstance().confirmHandler.notifyAudio(siht, sound));
        }
    }

    private _play(sound: Sound): Promise<void> {
        if (this.currentlyPlaying != undefined) {
            this.currentlyPlaying.stop();
        }

        if (!sound.isLoaded()) {
            sound.load();
            console.error(`Sound ${sound} didn't preload correctly. Loaded now.`);
        }

        const res: Promise<void> = sound.play(this.volume);
        sound.oneEnded(this.oneEnded());
        this.currentlyPlaying = sound;

        return res;
    }

    /**
     * Stops currently playing sound and empties pending queue.
     */
    stop(): void {
        if (this.currentlyPlaying != undefined) {
            this.currentlyPlaying.stop();
        }

        this.currentlyPlaying = null;
        this.pending = [];
    }

    private oneEnded(): () => void {
        const siht = this;

        return () => {
            if (_.head(siht.pending) != undefined) {
                // if sounds in pending queue
                siht._play(_.head(siht.pending));
                siht.pending = _.tail(siht.pending);
            } else if (siht.loop) {
                // if loop start over
                siht._play(siht.currentlyPlaying);
            } else {
                // else nothing is playing anymore
                siht.currentlyPlaying = null;
            }
        };
    }
}


export class Channels {
    [key: string]: Channel;
}
