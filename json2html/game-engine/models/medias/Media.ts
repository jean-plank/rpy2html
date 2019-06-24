import { none, Option, Some } from 'fp-ts/lib/Option';

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
}
