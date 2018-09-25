export class Font {
    private url: string;
    private bold: boolean;

    constructor (url: string, bold?: boolean) {
        this.url = url;
        this.bold = bold;
    }

    face(name: string): string {
        return `@font-face {
    font-family: ${name};
    src: url("${this.url}");
    ${this.bold?"font-weight: bold;":""}
}`;
    }
}


export type Fonts = {
    [key: string]: Font;
}
