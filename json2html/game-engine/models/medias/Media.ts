import { basename } from 'path'

export default abstract class Media {
    constructor(public file: string) {}

    toString = (): string =>
        `${this.constructor.name}("${basename(this.file)}")`

    abstract load(): void
}
