import * as _ from 'lodash';
import * as $ from 'jquery';

import * as utils from '../utils';
import { Story } from './Story';
import { Image } from './Image';
import { Sound } from './Sound';
import { Char } from './Char';


export abstract class Node {
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

    execute(): void {
        console.log(`%cexecuting ${this}`, 'color: blue; font-wheight: bold');

        this.story.currentNode = this;

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


export type Nodes = {
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

    execute(): void {
        super.execute();

        if (this.displayTxt != undefined && this.displayTxt !== "") {
            this.story.$.dialog.text(this.displayTxt);
        } else {
            this.story.$.textbox.hide();
        }

        // function click(siht: Menu, i: number): (e: any) => void {
        //     return (event: any) => {
        //         event.stopPropagation();
        //         siht.story.executeNextBlock(i);
        //     }
        // }

        let i: number = 0;
        _.forEach(this.nexts(), (next: MenuItem) => {
            const btn: JQuery<HTMLButtonElement> = $(document.createElement("button"))
                .text(next.text)
                // .one("click", click(this, i));
            this.story.$.choice.append(btn);
            i++;
        });
    }

    nexts(): MenuItem[] {
        return _.filter(this.next, (next: MenuItem) => eval(next.condition) === true);
    }
}


export class MenuItem extends Node {
    next: Node;

    text: string;
    condition: string;

    constructor (text: string, condition="false", idNext?: number) {
        super(idNext);

        this.text = text;
        this.condition = utils.convertToJs(condition);
    }

    toString(): string {
        return `MenuItem("${this.text}")`;
    }

    execute(): void {
        super.execute();

        this.story.$.textbox.show();
        this.story.$.choice.empty();
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

    execute(): void {
        super.execute();

        this.story.$.textbox.show();
        this.story.$.namebox.text("");
        if (this.who != undefined) {
            const color = this.who.color?this.who.color:"default";
            this.story.$.namebox
                .text(this.who.name)
                .css("color", color);
        }
        this.story.$.dialog.text(this.what);
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

        this.condition = utils.convertToJs(condition);
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

        this.code = utils.convertToJs(code);
    }

    toString() {
        return `PyExpr(${this.code})`;
    }

    execute(): void {
        super.execute();

        try {
            eval(this.code);
        } catch (e) {
            console.error('e =', e);
        }
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

    execute(): void {
        super.execute();

        this.story.scene(this.image);
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

    execute(): void {
        super.execute();

        if (this.image != undefined
           && this.story.shownImgs.indexOf(this.image) === -1)
        {
            if (!this.image.isLoaded()) {
                this.image.load();
                console.error(`Image ${this.image} didn't preload correctly. Loaded now.`);
            }
            this.image.addTo(this.story.$.charImg);
            this.story.shownImgs.push(this.image);
        }
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

    execute(): void {
        super.execute();

        var i = this.story.shownImgs.indexOf(this.image);
        if (i !== -1) {
            this.image.detach();
            this.story.shownImgs.splice(i, 1);
        }
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

    execute(): void {
        super.execute();

        if (this.story.isAllowedChan(this.chanName)) {
            // Normal channels support playing and queueing audio, but only play back one audio file at a time.
            this.story.chans[this.chanName].play(this.sound);
        } else if (this.chanName === "audio") {
            // The audio channel supports playing back multiple audio files at one time, but does not support queueing sound or stopping playback.
            // TODO
        }
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

    execute(): void {
        super.execute();

        if (this.story.isAllowedChan(this.chanName)) {
            this.story.chans[this.chanName].stop();
        } else if (this.chanName === "audio") {
            // TODO
        }
    }
}
