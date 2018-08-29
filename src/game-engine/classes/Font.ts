export class Fonts {
    [key: string]: Font;
}


export class Font {
    private url: string;

    constructor (url: string) {
        this.url = url;
    }

    face(name: string): string {
        return `@font-face {
    font-family: ${name};
    src: url("${this.url}");
}`;
    }
}
