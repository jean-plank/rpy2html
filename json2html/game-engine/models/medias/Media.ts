import { Either } from 'fp-ts/lib/Either';
import { none, Option, Some } from 'fp-ts/lib/Option';
import * as t from 'io-ts';

import { basename } from 'path';

export default abstract class Media<T extends HTMLElement = HTMLElement> {
    protected elt: Option<T> = none;
    file: string;

    constructor(file: string) {
        this.file = file;
    }

    toString = (): string =>
        `${this.constructor.name}("${basename(this.file)}")`

    isLoaded = (): boolean => this.elt.isSome();

    getElt = (): T => {
        this.loadIfNot();
        return (this.elt as Some<T>).value;
    }

    abstract load(): void;

    protected loadIfNot = () => {
        if (!this.isLoaded()) {
            console.error(
                `${this.toString()} didn't preload correctly. Loaded now.`
            );
            this.load();
        }
    }

    protected static decodeFile = (media: unknown): Either<t.Errors, string> =>
        MediaType.decode(media).map(_ => _.file)
}

const MediaType = t.exact(
    t.type({
        file: t.string
    })
);
