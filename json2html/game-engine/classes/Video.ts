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

    stop() {
        if (this.elt !== null) {
            this.elt.pause();
            this.elt.currentTime = 0;
        }
    }

    onEnded(f: () => void) {
        this.getElt().onended = f;
    }

    static fromAny(video: any): Video | null {
        if (  _.keys(video).length === 1
           && _.has(video, 'file') && _.isString(video.file)) {
            return new Video(video.file);
        }
        return null;
    }
}
