import * as _ from 'lodash';
import * as $ from 'jquery';

import * as utils from '../utils';
import { Channel, Channels } from  './Channel';
import { Image, Images } from  './Image';
import { Fonts } from './Font';
import { Sound, Sounds } from  './Sound';
import { Chars } from  './Char';
import { Node, Nodes, Menu } from  './nodes';
import { StoryHistory } from './StoryHistory';
import { MainMenu } from './views/MainMenu';
import { Confirm } from './views/Confirm';
import { View } from './views/View';
import { Game } from './views/Game';
import { GameMenu } from './views/GameMenu';


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

    $: {
        container: JQuery<HTMLElement>;
        scene: JQuery<HTMLElement>;
        charImg: JQuery<HTMLElement>;
        textbox: JQuery<HTMLElement>;
        namebox: JQuery<HTMLElement>;
        dialog: JQuery<HTMLElement>;
        choice: JQuery<HTMLElement>;
        mainMenu: JQuery<HTMLElement>;
        confirm: JQuery<HTMLElement>;
    };
    shownImgs: Array<Image>;
    chans: Channels;

    currentView: View;
    views: {
        confirm: Confirm;
        game: Game;
        gameMenu: GameMenu;
        mainMenu: MainMenu;
    };
    images: Images;
    sounds: Sounds;
    chars: Chars;
    currentNode: Node;
    history: StoryHistory;

    nodes: Nodes;


    private constructor() {
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

        this.shownImgs = [];

        this.chans = {
            music: new Channel(true, 0.5),
            sound: new Channel(),
            voice: new Channel(),
        }
    }

    public static getInstance(): Story {
        return this._instance || (this._instance = new this());
    }

    isAllowedChan(chanName: string): boolean {
        return (  this.chans != undefined
               && chanName != undefined
               && _.has(this.chans, chanName));
    }

    setDatas(datas: StoryDatas): void {
        this.images = datas.images;
        this.sounds = datas.sounds;
        this.chars = datas.chars;

        this.views = {
            confirm: new Confirm(),
            game: new Game(),
            gameMenu: new GameMenu(),
            mainMenu: new MainMenu(datas),
        }

        // init head
        document.title = datas.name;
        if (datas.icon != undefined) {
            $("link[rel='shortcut icon']").attr("href", datas.icon);
        }

        $("head").append($(`<style>${utils.getStyle(datas)}</style>`));
    }

    setNodes(nodes: Nodes): void {
        this.nodes = nodes;
        nodes[0].loadBlock();

        this.views.mainMenu.show();

        // events
        const siht = this;
        $(document)
            .on("click", (e) => siht.currentView.onClick(siht, e))
            .on("keyup", (e) => siht.currentView.onKeyup(siht, e))
            .on("wheel", (e) => siht.currentView.onWheel(siht, e))
            .on("beforeunload", () => siht.views.confirm.confirmQuit());
    }

    hideCurrentView(): void {
        if (this.currentView != undefined) {
            this.currentView.hide();
        }
    }

    cleanup() {
        this.$.choice.empty();
        this.$.scene.empty();
        this.$.charImg.empty();
        this.shownImgs = [];
    }

    scene(img: Image): void {
        this.cleanup();

        if (!img.isLoaded()) {
            img.load();
            console.error(`Image ${img} didn't preload correctly. Loaded now.`);
        }

        img.addTo(this.$.scene);
    }
}
