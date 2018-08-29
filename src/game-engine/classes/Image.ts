import * as $ from 'jquery';


export class Image {
    private file: string;
    private $img: JQuery<HTMLImageElement>;

    constructor (file: string) {
        this.file = file;
    }

    toString(): string {
        return this.file;
    }

    load(): void {
        if (this.$img == undefined) {
            this.$img = $(document.createElement("img")).attr('src', this.file);
        }
    }

    isLoaded(): boolean {
        return this.$img != undefined;
    }

    addTo($elt: JQuery<HTMLElement>): void {
        $elt.append(this.$img)
    }

    detach(): void {
        this.$img.detach();
    }
}


export class Images {
    [key: string]: Image;
}
