import * as _ from 'lodash';

import Media from './Media';


export default class Video extends Media<HTMLVideoElement> {
    load() {
        if (!this.isLoaded()) {
            this.elt = document.createElement('video');
            this.elt.setAttribute('src', this.file);
            this.elt.setAttribute('preload', 'auto');
        }
    }

    play() {
        this.getElt().play();
    }

    pause() {
        if (this.isLoaded()) (this.elt as HTMLVideoElement).pause();
    }

    stop() {
        if (this.isLoaded()) {
            const elt = this.elt as HTMLVideoElement;
            elt.pause();
            elt.currentTime = 0;
        }
    }

    clone(): Video {
        const res = new Video(this.file);
        res.load();
        return res;
    }

    onEnded(f: () => void) {
        this.getElt().onended = f;
    }

    static fromAny(video: any): Video | null {
        const file = Media.fileFromAny(video);
        if (file !== null) return new Video(file); else return null;
    }
}
