import * as _ from 'lodash';

import Media from './Media';


export default class Image extends Media<HTMLImageElement> {
    load() {
        if (!this.isLoaded()) {
            this.elt = document.createElement('img');
            this.elt.setAttribute('src', this.file);
        }
    }

    toJSON(): { file: string } {
        return { file: this.file };
    }

    static fromAny(img: any): Image | null {
        if (  _.keys(img).length === 1
           && _.has(img, 'file') && _.isString(img.file)) {
            return new Image(img.file);
        }
        return null;
    }
}
