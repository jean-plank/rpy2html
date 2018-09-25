export class Char {
    name: string;
    color: string;

    constructor (name: string, color?: string) {
        this.name = name;
        this.color = color;
    }
}


export type Chars = {
    [key: string]: Char;
}
