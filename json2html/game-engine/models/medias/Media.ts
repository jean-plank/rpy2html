import { basename } from 'path';

export default abstract class Media {
    file: string;

    constructor(file: string) {
        this.file = file;
    }

    toString = (): string =>
        `${this.constructor.name}("${basename(this.file)}")`

    abstract load(): void;
}
