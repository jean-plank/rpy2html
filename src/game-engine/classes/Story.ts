import * as _ from 'lodash';
import * as $ from 'jquery';

import { Channel, Channels } from  './Channel';
import { Image, Images } from  './Image';
import { Fonts } from './Font';
import { Sound, Sounds } from  './Sound';
import { Chars } from  './Char';
import { Node, Nodes, Menu } from  './nodes';
import { StoryHistory } from './StoryHistory';
import { MainMenu } from './MainMenu';
import { ConfirmHandler } from './ConfirmHandler';
import { EventsHandler } from './EventsHandler';
import * as utils from '../utils';


class StoryElements {
    container: JQuery<HTMLElement>;
    scene: JQuery<HTMLElement>;
    charImg: JQuery<HTMLElement>;
    textbox: JQuery<HTMLElement>;
    namebox: JQuery<HTMLElement>;
    dialog: JQuery<HTMLElement>;
    choice: JQuery<HTMLElement>;
    mainMenu: JQuery<HTMLElement>;
    confirm: JQuery<HTMLElement>;
}


class StoryState {
    scene: Image;
    shownImgs: Array<Image>;
    audio: Array<Sound>;
}


export class StoryDatas {
    name="Some Ren'Py Game";
    version="1.0";
    showName: boolean;
    icon: string;
    main_menu_bg: string;
    main_menu_music: string;
    main_menu_overlay: string;
    choice_btn_bg: string;
    choice_btn_hover: string;
    textbox_bg: string;
    namebox_bg: string;
    confirm_overlay: string;
    frame_bg: string;
    images: Images;
    fonts: Fonts;
    sounds: Sounds;
    chars: Chars;
}


export class Story {
    private static _instance: Story;

    $: StoryElements;
    state: StoryState;
    chans: Channels;

    images: Images;
    sounds: Sounds;
    chars: Chars;
    currentNode: Node;
    history: StoryHistory;
    confirmHandler: ConfirmHandler;
    eventsHandler: EventsHandler;
    mainMenu: MainMenu;

    nodes: Nodes;

    private constructor() {
        this._initElts();

        this.state = {
            scene: null,
            shownImgs: [],
            audio: [],
        }

        this.chans = {
            music: new Channel(true, 0.5),
            sound: new Channel(),
            voice: new Channel(),
        }
    }

    private _initElts(): void {
        this.$ = {
            container: $('#container'),
            scene: $('#scene'),
            charImg: $('#char-img'),
            textbox: $('#textbox'),
            namebox: $('#namebox'),
            dialog: $('#dialog'),
            choice: $('#choice'),
            mainMenu: $('#main-menu'),
            confirm: $('#confirm'),
        }

        // Main menu buttons
        class Btn {
            id: string;
            txt: string;
            disabled: boolean;
        }

        const btns: Array<Btn> = [
            { id: "start-btn", txt: "Start", disabled: false },
            { id: "load-btn", txt: "Load", disabled: true },
            { id: "pref-btn", txt: "Preferences", disabled: true },
            { id: "about-btn", txt: "About", disabled: true },
            { id: "help-btn", txt: "Help", disabled: true },
            { id: "quit-btn", txt: "Quit", disabled: false },
        ];

        _.forEach(btns, (btn: Btn) =>
            this.$.mainMenu.children(".items").first().append(
                $('<button>')
                    .attr("id", btn.id)
                    .prop("disabled", btn.disabled)
                    .text(btn.txt)));
    }

    public static getInstance(): Story {
        return this._instance || (this._instance = new this());
    }

    /**
     * Checks that channel is a valid Channel of story.state.
     */
    isAllowedChan(chanName: string): boolean {
        return ( this.chans
               && chanName
               && _.has(this.chans, chanName));
    }

    setDatas(datas: StoryDatas): void {
        this.images = datas.images;
        this.sounds = datas.sounds;
        this.chars = datas.chars;
        this.confirmHandler = new ConfirmHandler();
        this.mainMenu = new MainMenu(datas);

        // init head
        document.title = datas.name;
        if (datas.icon != undefined) {
            $("link[rel='shortcut icon']").attr("href", datas.icon);
        }

        $("head").append($(`<style>${utils.getStyle(datas)}</style>`));
    }

    setNodes(nodes: Nodes): void {
        this.nodes = nodes;

        this.mainMenu.show();
        nodes[0].loadBlock();
        this.eventsHandler = new EventsHandler();
    }

    startStory(): (e: any) => void {
        const siht = this;

        return (event: any) => {
            event.stopPropagation();

            if (  siht.images == undefined
               || siht.sounds == undefined
               || siht.chars == undefined)
            {
                console.error(`Story must be initiated before starting.`);
            } else if (siht.nodes == undefined) {
                console.error(`Story must have its nodes set before starting.`);
            } else {
                siht.mainMenu.hide();
                siht.history = new StoryHistory();
                siht.nodes[0].execute();
                if (!siht.currentNode.stopExecution) {
                    siht.executeNextBlock(undefined, [siht.nodes[0]]);
                }
            }
        };
    }

    executeNextBlock(id?: number, acc: Array<Node>=[]): void {
        if (this.currentNode != undefined) {
            const nexts = this.currentNode.nexts();

            if (nexts.length === 0) {
                this.mainMenu.show();
            } else {
                let next: Node;

                if (this.currentNode instanceof Menu) {
                    if (id === undefined) {
                        console.error(`Missing id for next of menu.`);
                    } else {
                        next = nexts[id];
                    }
                } else if (nexts.length === 1) {
                    next = nexts[0];
                } else {
                    console.error(`Current node has more than one next node.`);
                }

                if (next === undefined) {
                    this.history.addBlock(acc);
                } else {
                    next.execute();
                    acc.push(next);

                    if (next.stopExecution) {
                        this.history.addBlock(acc);
                    } else {
                        this.executeNextBlock(undefined, acc);
                    }
                }
            }
        }
    }

    cleanup() {
        this.$.scene.empty();
        this.state.scene = null;

        this.$.charImg.empty();
        this.state.shownImgs = [];
    }

    scene(img: Image): void {
        if (img != undefined && this.state.scene !== img) {
            this.cleanup();

            if (!img.isLoaded()) {
                img.load();
                console.error(`Image ${img} didn't preload correctly. Loaded now.`);
            }

            img.addTo(this.$.scene);
            this.state.scene = img;
        }
    }
}
