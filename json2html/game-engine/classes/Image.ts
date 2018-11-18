import * as _ from 'lodash';

import { basename } from 'path';


export default class Image {
    private elt: HTMLImageElement | null = null;
    file: string;

    constructor (file: string) {
        this.file = file;
    }

    toString(): string {
        return `Image("${basename(this.file)}")`;
    }

    toJSON(): { file: string } {
        return { file: this.file };
    }

    static fromAny(img: any): Image | null {
        if (  _.keys(img).length === 1
           && _.has(img, 'file') && _.isString(img.file))
            return new Image(img.file);
        return null;
    }

    isLoaded(): boolean {
        return this.elt !== null;
    }

    load(): void {
        if (!this.isLoaded()) {
            this.elt = document.createElement('img');
            this.elt.setAttribute('src', this.file);
        }
    }

    getElt(): Node {
        if (!this.isLoaded()) {
            this.load(); // ensures that this.elt isn't null
            console.warn(`${this.toString()} didn't preload correctly. Loaded now.`);
        }
        return (this.elt as HTMLImageElement).cloneNode();
    }
}
