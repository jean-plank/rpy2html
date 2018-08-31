import * as _ from 'lodash';
import * as $ from 'jquery';

import { Channel, Channels } from  './Channel';
import { Image, Images } from  './Image';
import { Font, Fonts } from './Font';
import { Sound, Sounds } from  './Sound';
import { Chars } from  './Char';
import { Node, Nodes, Menu } from  './nodes';
import { MainMenu } from './MainMenu';
import { ConfirmHandler } from './ConfirmHandler';


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
    currentNode: Node;
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


function getBgOrElse(urlBg: string, color?: string): string {
    if (urlBg != undefined) {
        return `background-image: url("${urlBg}");`;
    } else if (color != undefined) {
        return `background-color: ${color};`;
    } else {
        return "";
    }
}


export class Story {
    private static _instance: Story;

    $: StoryElements;
    state: StoryState;
    chans: Channels;

    images: Images;
    sounds: Sounds;
    chars: Chars;
    confirmHandler: ConfirmHandler;
    mainMenu: MainMenu;

    nodes: Nodes;

    private constructor() {
        this._initElts();

        this.state = {
            scene: null,
            shownImgs: [],
            audio: [],
            currentNode: null,
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

        this._initHead(datas);
        this._initCss(datas);
    }

    private _initHead(datas: StoryDatas): void {
        document.title = datas.name;

        if (datas.icon != undefined) {
            $("link[rel='shortcut icon']").attr("href", datas.icon);
        }
    }

    private _initCss(datas: StoryDatas): void {
        const fonts: string = _.reduce(datas.fonts,
            (acc: string, font: Font, name: string) => acc + font.face(name),
            "");
        const style: JQuery<HTMLElement> = $(`<style>
#${this.$.textbox.attr("id")} {
    ${getBgOrElse(datas.textbox_bg, "rgba(0,0,0,0.8)")}
}

#${this.$.namebox.attr("id")} {
    ${getBgOrElse(datas.namebox_bg)}
}

${fonts}

#${this.$.mainMenu.attr("id")} {
    ${getBgOrElse(datas.main_menu_overlay, "rgba(0,0,0,0.5)")}
}

#${this.$.choice.attr("id")}>button {
    ${getBgOrElse(datas.choice_btn_bg, "rgba(0,0,0,0.8)")}
}

#${this.$.choice.attr("id")}>button:hover {
    ${getBgOrElse(datas.choice_btn_hover, "rgba(0,0.6,0.8,0.8)")}
}

#${this.$.confirm.attr("id")} {
    ${getBgOrElse(datas.confirm_overlay, "rgba(0,0,0,0.6)")}
}

.frame {
    ${getBgOrElse(datas.frame_bg, "black")};
}
</style>`);

        $("head").append(style);
    }

    private _initEvents(): void {
        const siht = this;

        function nextIfNotMenu(): void {
            if (  !(siht.state.currentNode instanceof Menu)
               && siht.confirmHandler.hidden) {
                siht.executeNextNodes();
            }
        }

        function keyup(event: any): void {
            /*
            Ren'Py help:

            * `Enter`: Advances dialogue and activates the interface.
            * `Space`: Advances dialogue without selecting choices.
            * `Arrow Keys`: Navigate the interface.
            * `Escape`: Accesses the game menu.
            * `Ctrl`: Skips dialogue while held down.
            * `Tab`: Toggles dialogue skipping.
            * `Page Up`: Rolls back to earlier dialogue.
            * `Page Down`: Rolls forward to later dialogue.
            * `H`: Hides the user interface.
            * `S`: Takes a screenshot.
            * `V`: Toggles assistive self-voicing.

            * `Left Click`: Advances dialogue and activates the interface.
            * `Middle Click`: Hides the user interface.
            * `Right Click`: Accesses the game menu.
            * `Mouse Wheel Up`, `Click Rollbalck Side`: Rolls back to earlier dialogue.
            * `Mouse Wheel Down`: Rolls forward to later dialogue.
             */


            const keyEvents: { [id: number]: (e: any) => void } = {
                // 38: () => {},   // up arrow
                // 40: () => {},   // down arrow
                // 37: () => {},   // left arrow
                39: nextIfNotMenu, // right arrow
                27: () => {        // escape
                    if (siht.confirmHandler.hidden) {
                        siht._quit();
                    } else {
                        siht.confirmHandler.hide();
                    }},
                32: nextIfNotMenu, // space
                // 13: () => {},   // enter
                // 17: () => {},   // control
                // 9: () => {},    // tab
                // 33: () => {},   // page up
                // 72: () => {},   // h
                // 86: () => {},   // v

            }
            const f: (e: any) => void = keyEvents[event.which];

            if (f != undefined) f(event);
        }

        function wheel(event: any): void {
            if (event.originalEvent.deltaY < 0) {
                // console.log("scroll up");
            } else if (event.originalEvent.deltaY > 0) {
                nextIfNotMenu();
            }
        }

        // navigation events
        this.$.container.on("click", nextIfNotMenu);
        $(document).on("keyup", keyup);
        this.$.container.on("wheel", wheel);

        // main menu button
        $('#start-btn').click(this.startStory());
        $('#quit-btn').click(() => this._quit());
    }

    private _quit(): void {
        this.confirmHandler.confirm(
            "Are you sure you want to quit?",
            {   "Yes": () => window.location.assign(".."),
                "No": () => {} })
    }

    setNodes(nodes: Nodes): void {
        this.nodes = nodes;

        this.mainMenu.show();
        nodes[0].loadBlock();
        this._initEvents();
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
                siht.nodes[0].execute();
                if (!siht.state.currentNode.stopExecution) {
                    siht.executeNextNodes();
                }
            }
        };
    }

    executeNextNodes(id?: number): void {
        if (this.state.currentNode != undefined) {
            const nexts = this.state.currentNode.nexts();

            if (nexts.length === 0) {
                this.mainMenu.show();
            } else {
                let next: Node;
                if (this.state.currentNode instanceof Menu) {
                    if (id !== undefined) {
                        next = nexts[id];
                    } else {
                        console.error(`Missing id for next of menu.`);
                    }
                } else if (nexts.length === 1) {
                    next = nexts[0];
                } else {
                    console.error(`Current node has more than one next node.`);
                }
                if (next != undefined) {
                    next.execute(this.state.currentNode);
                    if (!next.stopExecution) {
                        this.executeNextNodes();
                    }
                }
            }
        }
    }

    scene(img: Image): void {
        if (img != undefined && this.state.scene !== img) {
            this.$.scene.empty();
            this.$.charImg.empty();
            this.state.shownImgs = [];

            if (!img.isLoaded()) {
                img.load();
                console.error(`Image ${img} didn't preload correctly. Loaded now.`);
            }

            img.addTo(this.$.scene);
            this.state.scene = img;
        }
    }
}
