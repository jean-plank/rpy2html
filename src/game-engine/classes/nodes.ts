import * as _ from 'lodash';
import * as $ from 'jquery';

import { Story } from './Story';
import { Image } from './Image';
import { Sound } from './Sound';
import { Char } from './Char';


export abstract class Node {
    previous: Node;
    story: Story;
    idNext: number | number[];
    next: Node | Node[];
    stopExecution: boolean;

    constructor (idNext?: number | number[], stopExecution=false) {
        this.story = Story.getInstance();
        this.stopExecution = stopExecution;
        this.idNext = idNext;
    }

    abstract toString(): string;

    load(): void {
        console.log(`%cloading ${this}`, 'color: #bada55');

        if (_.isArray(this.idNext)) {
            this.next = _.map(this.idNext, (id: number) => this.story.nodes[id]);
        } else if (this.idNext != undefined) {
            this.next = this.story.nodes[this.idNext];
        }
    }

    execute(previous?: Node): void {
        console.log(`%cexecuting ${this}`, 'color: blue; font-wheight: bold');

        this.previous = previous;
        this.story.state.currentNode = this;

        if (this.stopExecution) {
            _.forEach(this.nexts(), (next: Node) => next.loadBlock());
        }
    }

    nexts(): Node[] {
        if (this.next instanceof Node) {
            return [this.next];
        } else if (_.isArray(this.next)) {
            return this.next;
        } else {
            return [];
        }
    }

    /**
     * Loads recursively all ressources from this node to the next stopping block.
     */
    loadBlock(): void {
        this.load();

        if (!this.stopExecution) {
            _.forEach(this.nexts(), (next: Node) => next.loadBlock());
        }
    }
}


export class Nodes {
    [key: string]: Node;
}


export class Menu extends Node {
    next: MenuItem[];

    displayTxt: string;

    constructor (displayTxt?: string, idNext?: number[]) {
        super(idNext, true);
        this.displayTxt = displayTxt;
    }

    toString(): string {
        const args = [`"${this.displayTxt}"`]
            .concat(_.map(this.next, (next: MenuItem) => `"${next.text}"`))
            .join(", ");

        return `Menu(${args})`;
    }

    execute(previous?: Node): void {
        if (this.displayTxt != undefined && this.displayTxt !== "") {
            this.story.$.dialog.text(this.displayTxt);
        } else {
            this.story.$.textbox.hide();
        }

        function click(siht: Menu, i: number): (e: any) => void {
            return (event: any) => {
                event.stopPropagation();
                siht.story.$.namebox.show();
                siht.story.$.menu.empty();
                siht.story.executeNextNodes(i);
            }
        }

        let i: number = 0;
        _.forEach(this.nexts(), (next: MenuItem) => {
            const btn: JQuery<HTMLButtonElement> = $(document.createElement("button"))
                .text(next.text)
                .one("click", click(this, i));
            this.story.$.menu.append(btn);
            i++;
        });

        super.execute(previous);
    }

    nexts(): MenuItem[] {
        return _.filter(this.next, (next: MenuItem) => eval(next.condition) === true);
    }
}


const word = /\W([a-zA-Z_]\w*)\W/g;
const kwords = [
    // "break", "case", "catch", "class", "const", "continue", "debugger", "default", "delete", "do", "else", "export", "extends", "finally", "for", "function", "if", "import", "in", "instanceof", "new", "return", "super", "switch", "this", "throw", "try", "typeof", "var", "void", "while", "with", "yield",
    // "null", "undefined",
    "true", "false",
];

function convertToJs(code: string): string {
    const match = ` ${code} `.match(word);

    return _.reduce(match, (acc: string, m: string) => {
            const trimedM: string = m.trim();

            if (kwords.indexOf(trimedM) === -1) {
                return acc.replace(trimedM, `window.${trimedM}`);
            } else {
                return acc;
            }
        }, code)
        .replace("==", "===");
}


export class MenuItem extends Node {
    next: Node;

    text: string;
    condition: string;

    constructor (text: string, condition="false", idNext?: number) {
        super(idNext);

        this.text = text;
        this.condition = convertToJs(condition);
    }

    toString(): string {
        return `MenuItem("${this.text}")`;
    }
}


export class Say extends Node {
    next: Node;

    who: Char;
    what: string;

    constructor (whosName: string, what: string, idNext?: number) {
        super(idNext, true);

        if (whosName != undefined) {
            if (this.story.chars[whosName] !== undefined) {
                this.who = this.story.chars[whosName];
            } else {
                console.error(`Say: invalid character name: ${whosName}`);
            }
        }
        this.what = what;
    }

    toString(): string {
        return `Say(${this.who?`"${this.who.name}", `:""}"${this.what}")`;
    }

    execute(previous?: Node): void {
        this.story.$.textbox.show();
        this.story.$.namebox.text("");
        if (this.who != undefined) {
            const color = this.who.color?this.who.color:"default";
            this.story.$.namebox
                .text(this.who.name)
                .css("color", color);
        }
        this.story.$.dialog.text(this.what);

        super.execute(previous);
    }
}


export class If extends Node {
    next: IfBlock[];

    constructor (idNext?: number[]) {
        super(idNext);
    }

    toString(): string {
        return `If()`;
    }

    nexts(): IfBlock[] {
        return [_.find(this.next, (next: IfBlock) => eval(next.condition) === true)];
    }
}


export class IfBlock extends Node {
    next: Node;

    condition: string;

    constructor (condition: string, idNext?: number) {
        super(idNext);

        this.condition = convertToJs(condition);
    }

    toString(): string {
        return `IfBlock("${this.condition}")`;
    }
}


export class PyExpr extends Node {
    next: Node;

    code: string;

    constructor (code: string, idNext?: number) {
        super(idNext);

        this.code = convertToJs(code);
    }

    toString() {
        return `PyExpr(${this.code})`;
    }

    execute(previous?: Node) {
        try {
            eval(this.code);
        } catch (e) {
            console.error('e =', e);
        }

        super.execute(previous);
    }
}


export class Scene extends Node {
    next: Node

    imgName: string;
    image: Image;

    constructor (imgName: string, idNext?: number) {
        super(idNext);

        this.imgName = imgName;
        this.image = this.story.images[imgName];

        if (this.image == undefined) {
            console.error(`Scene: invalid image name: ${imgName}`);
        }
    }

    toString(): string {
        return `Scene(${this.imgName})`;
    }

    load(): void {
        super.load();
        if (this.image != undefined) this.image.load();
    }

    execute(previous?: Node): void {
        this.story.scene(this.image);

        super.execute(previous);
    }
}


export class Show extends Node {
    next: Node;

    imgName: string;
    image: Image;

    constructor (imgName: string, idNext?: number) {
        super(idNext);

        this.imgName = imgName;
        this.image = this.story.images[imgName];

        if (this.image == undefined) {
            console.error(`Show: invalid image name: ${imgName}`);
        }
    }

    toString(): string {
        return `Show(${this.imgName})`;
    }

    load(): void {
        super.load();
        if (this.image != undefined) this.image.load();
    }

    execute(previous?: Node): void {
        if (this.image != undefined
           && this.story.state.shownImgs.indexOf(this.image) === -1)
        {
            if (!this.image.isLoaded()) {
                this.image.load();
                console.error(`Image ${this.image} didn't preload correctly. Loaded now.`);
            }
            this.image.addTo(this.story.$.charImg);
            this.story.state.shownImgs.push(this.image);
        }

        super.execute(previous);
    }
}


export class Hide extends Node {
    next: Node;

    imgName: string;
    image: Image;

    constructor (imgName: string, idNext?: number) {
        super(idNext);
        this.imgName = imgName;
        this.image = this.story.images[imgName];

        if (this.image == undefined) {
            console.error(`Hide: invalid image name: ${imgName}`);
        }
    }

    toString(): string {
        return `Hide(${this.imgName})`;
    }

    execute(previous?: Node): void {
        var i = this.story.state.shownImgs.indexOf(this.image);
        if (i !== -1) {
            this.image.detach();
            this.story.state.shownImgs.splice(i, 1);
        }

        super.execute(previous);
    }
}


export class Play extends Node {
    next: Node;

    chanName: string;
    sndName: string;
    sound: Sound;

    constructor (chanName: string, sndName: string, idNext?: number) {
        super(idNext);

        this.chanName = chanName;
        this.sndName = sndName;
        this.sound = this.story.sounds[sndName];

        if (this.sound == undefined) {
            console.error(`Play: invalid sound name: ${sndName}`);
        }
    }

    toString(): string {
        return `Play(${this.chanName}, ${this.sndName})`;
    }

    load(): void {
        super.load();
        if (this.sound != undefined) this.sound.load();
    }

    execute(previous?: Node): void {
        if (this.story.isAllowedChan(this.chanName)) {
            // Normal channels support playing and queueing audio, but only play back one audio file at a time.
            this.story.chans[this.chanName].play(this.sound);
        } else if (this.chanName === "audio") {
            // The audio channel supports playing back multiple audio files at one time, but does not support queueing sound or stopping playback.
            // TODO
        }

        super.execute(previous);
    }
}


export class Stop extends Node {
    next: Node

    chanName: string

    constructor (chanName: string, idNext?: number) {
        super(idNext);

        this.chanName = chanName;
    }

    toString(): string {
        return `Stop(${this.chanName})`;
    }

    execute(previous?: Node): void {
        if (this.story.isAllowedChan(this.chanName)) {
            this.story.chans[this.chanName].stop();
        } else if (this.chanName === "audio") {
            // TODO
        }

        super.execute(previous);
    }
}
