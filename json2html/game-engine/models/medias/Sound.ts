import { some } from 'fp-ts/lib/Option';

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
        this.elt.map(_ => (_.onended = f));
    }
}
