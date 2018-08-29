import * as _ from 'lodash';
import * as $ from 'jquery';

import { Channel, Channels } from  './Channel';
import { Image, Images } from  './Image';
import { Font, Fonts } from './Font';
import { Sound, Sounds } from  './Sound';
import { Chars } from  './Char';
import { Node, Nodes, Menu } from  './nodes';
import { MainMenu } from './MainMenu';


class StoryElements {
    container: JQuery<HTMLElement>;
    scene: JQuery<HTMLElement>;
    charImg: JQuery<HTMLElement>;
    textbox: JQuery<HTMLElement>;
    namebox: JQuery<HTMLElement>;
    dialog: JQuery<HTMLElement>;
    menu: JQuery<HTMLElement>;
    mainMenu: JQuery<HTMLElement>;
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
    menu_btn_bg: string;
    menu_btn_hover: string;
    textbox_bg: string;
    namebox_bg: string;
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

    mainMenu: MainMenu;

    $: StoryElements;
    state: StoryState;
    chans: Channels;

    images: Images;
    sounds: Sounds;
    chars: Chars;

    nodes: Nodes;

    private constructor() {
        this.$ = {
            container: $('#container'),
            scene: $('#scene'),
            charImg: $('#char-img'),
            textbox: $('#textbox'),
            namebox: $('#namebox'),
            dialog: $('#dialog'),
            menu: $('#menu'),
            mainMenu: $('#main-menu')
        }

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

    initiateStory(datas: StoryDatas): void {
        this.images = datas.images;
        this.sounds = datas.sounds;
        this.chars = datas.chars;

        this._initHead(datas);
        this._initCss(datas);
        this._initEvents();
        this.mainMenu = new MainMenu(this, datas);

        this.mainMenu.show();
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

#${this.$.menu.attr("id")}>button {
    ${getBgOrElse(datas.menu_btn_bg, "rgba(0,0,0,0.8)")}
}

#${this.$.menu.attr("id")}>button:hover {
    ${getBgOrElse(datas.menu_btn_hover, "rgba(0,0.6,0.8,0.8)")}
}
</style>`);

        $("head").append(style);
    }

    private _initEvents(): void {
        const siht = this;

        function nextIfNotNode(): void {
            if (!(siht.state.currentNode instanceof Menu)) {
                siht.executeNextNodes();
            }
        }

        function keyup(event: any): void {
            if (event.which === 37) {
                // left arrow
            } else if (event.which === 39) {
                nextIfNotNode();
            }
        }

        function wheel(event: any): void {

            if (event.originalEvent.deltaY < 0) {
                // console.log("scroll up");
            } else if (event.originalEvent.deltaY > 0) {
                nextIfNotNode();
            }
        }

        this.$.container.on("click", nextIfNotNode);
        $(document).on("keyup", keyup);
        this.$.container.on("wheel", wheel);
    }

    setNodes(nodes: Nodes): void {
        this.nodes = nodes;
        nodes[0].loadBlock();
        $('#start-btn').click(this.startStory());
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
