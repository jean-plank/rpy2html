export class Char {
    name: string;
    color: string;

    constructor (name: string, color?: string) {
        this.name = name;
        this.color = color;
    }
}


export class Chars {
    [key: string]: Char;
}
