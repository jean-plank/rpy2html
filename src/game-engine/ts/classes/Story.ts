import * as _ from 'lodash';
import * as $ from 'jquery';

import * as utils from '../utils';
import { Channel, Channels } from  './Channel';
import { Image, Images } from  './Image';
import { Fonts } from './Font';
import { Sounds } from  './Sound';
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
    lang="en";
    help: string;
    showName: boolean;
    icon: string;
    main_menu_bg: string;
    main_menu_music: string;
    main_menu_overlay: string;
    game_menu_bg: string;
    game_menu_overlay: string;
    choice_btn_bg: string;
    choice_btn_hover: string;
    slot_bg: string;
    slot_hover: string;
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
        menuBg: JQuery<HTMLElement>;
        menuOverlay: JQuery<HTMLElement>;
        mainMenu: JQuery<HTMLElement>;
        subMainMenu: JQuery<HTMLElement>;
        gameMenu: JQuery<HTMLElement>;
        confirm: JQuery<HTMLElement>;
    };
    shownScene: Image;
    shownImgs: Image[];
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
            menuBg: $("#menu-bg"),
            menuOverlay: $("#menu-overlay"),
            mainMenu: $('#main-menu'),
            subMainMenu: $('#main-menu .submenu').first(),
            gameMenu: $("#game-menu"),
            confirm: $('#confirm'),
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

    isAllowedChan(chanName: string): boolean {
        return (  this.chans != undefined
               && chanName != undefined
               && _.has(this.chans, chanName));
    }

    setDatas(datas: StoryDatas): void {
        this.images = datas.images;
        this.sounds = datas.sounds;
        this.chars = datas.chars;

        this.$.menuBg.hide();
        this.$.menuOverlay.hide();

        this.views = {
            confirm: new Confirm(datas.lang),
            game: new Game(),
            mainMenu: new MainMenu(datas),
            gameMenu: new GameMenu(datas),
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
        type Actions = { [key: number]: () => void; };
        $(document)
            .on("click", (e) => {
                const acts: Actions = {
                    1: () => siht.currentView.onLeftClick(e),
                    2: () => siht.currentView.onMiddleClick(e),
                    3: () => siht.currentView.onRightClick(e),
                }
                acts[e.which]();
            })
            .on("keyup", (e) => siht.currentView.onKeyup(e))
            .on("wheel", (e) => siht.currentView.onWheel(e))
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
        this.shownScene = null;
        this.shownImgs = [];
    }
}
