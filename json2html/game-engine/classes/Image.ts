import * as _ from 'lodash';

import Media from './Media';


export default class Image extends Media<HTMLImageElement> {
    load() {
        if (!this.isLoaded()) {
            this.elt = document.createElement('img');
            this.elt.setAttribute('src', this.file);
        }
    }

    static fromAny(image: any): Image | null {
        const file = Media.fileFromAny(image);
        if (file !== null) return new Image(file); else return null;
    }
}
