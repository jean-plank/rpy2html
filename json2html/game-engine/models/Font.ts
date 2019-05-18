import { RawDefinition } from '../../renpy-json-loader/RenpyJson';

export default class Font {
    private url: string;
    private bold: boolean;

    constructor(url: string, bold: boolean) {
        this.url = url;
        this.bold = bold;
    }

    face = (name: string): string => `@font-face {
    font-family: ${name};
    src: url("${this.url}");${
        this.bold
            ? `
    font-weight:bold`
            : ''
    }
}`

    static fromRawDefinition = (font: RawDefinition): Font =>
        new Font(font.src, font.bold)
}
