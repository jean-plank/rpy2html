export class MenuButton {
    name: string;
    txt: string;
    disabled: boolean;

    constructor (name: string, txt: string, disabled=false) {
        this.name = name;
        this.txt = txt;
        this.disabled = disabled;
    }
}
