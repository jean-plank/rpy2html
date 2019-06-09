import { Either } from 'fp-ts/lib/Either';
import { some } from 'fp-ts/lib/Option';
import * as t from 'io-ts';

import Media from './Media';

export default class Image extends Media<HTMLImageElement> {
    load = () => {
        if (!this.isLoaded()) {
            const elt = document.createElement('img');
            elt.setAttribute('src', this.file);
            this.elt = some(elt);
        }
    }

    static decode = (image: unknown): Either<t.Errors, Image> =>
        Media.decodeFile(image).map(_ => new Image(_))
}
