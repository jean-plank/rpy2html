import { Either } from 'fp-ts/lib/Either';
import { some } from 'fp-ts/lib/Option';
import * as t from 'io-ts';

import Media from './Media';

export default class Sound extends Media<HTMLAudioElement> {
    load = () => {
        if (!this.isLoaded()) {
            const elt = document.createElement('audio');
            elt.setAttribute('src', this.file);
            elt.setAttribute('preload', 'auto');
            this.elt = some(elt);
        }
    }

    play = (volume?: number): Promise<void> => {
        const elt = this.getElt();
        if (volume !== undefined) elt.volume = volume;
        return elt.play();
    }

    stop = () => {
        this.elt.map(elt => {
            elt.pause();
            elt.currentTime = 0;
        });
    }

    pause = () => this.elt.map(_ => _.pause());

    onEnded = (f: () => void) => {
        this.loadIfNot();
        this.elt.map(_ => (_.onended = f));
    }

    static decode = (sound: unknown): Either<t.Errors, Sound> =>
        Media.decodeFile(sound).map(_ => new Sound(_))
}
