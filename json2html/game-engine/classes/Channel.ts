import * as _ from 'lodash';

import Sound from './Sound';

import App from '../components/App';


export default class Channel {
    private app: App;
    private currentlyPlaying: Sound | null;
    private pending: Sound[];
    private loop: boolean;
    private volume: number;

    constructor (app: App, loop=false, volume=0.7) {
        this.app = app;
        this.currentlyPlaying = null;
        this.loop = loop;
        this.volume = volume;
        this.stop();
    }

    // Stops current channel and plays sounds.
    play(...sounds: Sound[]) {
        this.stop();

        const head = _.head(sounds);
        if (head !== undefined) {
            this._play(head)
                .catch(() => {
                    this.app.confirmAudio(() => { this.play(...sounds); });
                });

            this.pending = _.tail(sounds);
        }
    }

    // Plays immediatly sound but does nothing to the pending queue.
    private _play(sound: Sound): Promise<void> {
        if (this.currentlyPlaying !== null) this.currentlyPlaying.stop();

        sound.onEnded(this.onEnded());
        this.currentlyPlaying = sound;
        return sound.play(this.volume);
    }

    // Stops currently playing sound and empties pending queue.
    stop() {
        if (this.currentlyPlaying !== null) this.currentlyPlaying.stop();

        this.currentlyPlaying = null;
        this.pending = [];
    }

    // Pauses currently playing sound.
    pause() {
        if (this.currentlyPlaying !== null) this.currentlyPlaying.pause();
    }

    //
    resume() {
        if (this.currentlyPlaying !== null) {
            this.currentlyPlaying
                .play()
                .catch(() => { this.app.confirmAudio(this.resume); });
        }
    }

    private onEnded(): () => void {
        const siht = this;

        return () => {
            const head = _.head(siht.pending);
            if (head !== undefined) {
                // if sounds in pending queue
                siht._play(head);
                siht.pending = _.tail(siht.pending);
            } else if (siht.loop) {
                // if loop start over
                if (siht.currentlyPlaying !== null) {
                    siht._play(siht.currentlyPlaying);
                }
            } else {
                // else nothing is playing anymore
                siht.currentlyPlaying = null;
            }
        };
    }
}
