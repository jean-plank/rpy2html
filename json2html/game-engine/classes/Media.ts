import { basename } from 'path';

export default abstract class Media<T> {
    protected elt: T | null = null;
    file: string;

    constructor (file: string) {
        this.file = file;
    }

    toString(): string {
        return `${this.constructor.name}("${basename(this.file)}")`;
    }

    isLoaded(): boolean {
        return this.elt !== null;
    }

    getElt(): T {
        this.loadIfNot();
        return (this.elt as T);
    }

    abstract load(): void;

    protected loadIfNot() {
        if (!this.isLoaded()) {
            this.load();
            throw Error(
                `${this.toString()} didn't preload correctly. Loaded now.`);
            // console.warn(
            //     `${this.toString()} didn't preload correctly. Loaded now.`);
        }
    }
}
