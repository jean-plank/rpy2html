import * as _ from "lodash";
import * as $ from "jquery";

import { StoryDatas, Story } from "../Story";
import { Sound } from "../Sound";
import { Menu } from "./Menu";
import { translations as transl, Language as Lang } from "../../translations";
import { actionBtn, actionKey } from "../../utils";
import { MenuButton } from "./MenuButton";


export class MainMenu extends Menu {
    private gameMenuOverlay: string;
    private music: Sound;

    constructor (datas: StoryDatas) {
        super(datas);

        this.$menuItems = this.story.$.mainMenu.find(".menu-items").first();
        this.$submenu = this.story.$.mainMenu.find(".submenu>div").first();
        this.story.$.mainMenu.hide();

        const lang: Lang =
            _.has(transl, datas.lang)?transl[datas.lang]:transl["en"];
        const btns: MenuButton[] = [
            new MenuButton("start", lang.menu.start),
            new MenuButton("load", lang.menu.load),
            // new MenuButton("prefs", lang.menu.prefs),
            new MenuButton("help", lang.menu.help),
            new MenuButton("quit", lang.menu.quit),
        ];

        _.forEach(btns, (btn: MenuButton) =>
            this.$menuItems.append(
                $("<button>")
                    .attr("name", btn.name)
                    .prop("disabled", btn.disabled)
                    .text(btn.txt)));

        if (datas.showName) {
            $("#game-name").text(datas.name);
            $("#game-version").text(datas.version);
        }

        this.background = datas.main_menu_bg;
        this.overlay = datas.main_menu_overlay;
        this.gameMenuOverlay = datas.game_menu_overlay;

        if (datas.main_menu_music != undefined) {
            this.music = this.story.sounds[datas.main_menu_music];
            if (this.music != undefined) this.music.load();
        }
    }

    show(): void {
        super.show();

        this.story.$.mainMenu.show();
        this.story.chans.music.play(this.music);
    }

    hide(): void {
        super.hide();

        this.story.$.mainMenu.hide();
    }

    onLeftClick(event: any): void {
        actionBtn(event, {
            "start": () => {
                this.hideCurrentSubMenu();
                this.story.views.game.start();
            },
            "load": () => this.showLoad(),
            "prefs": () => {},
            "help": () => this.showHelp(),
            "quit": () => {
                this.hideCurrentSubMenu();
                this.story.views.confirm.confirmQuit();
            },
        });
    }

    onMiddleClick(event: any): void {}

    onRightClick(event: any): void {}

    onKeyup(event: any): void {
        actionKey(event, {
            38: () => {}, // up arrow
            40: () => {}, // down arrow
            37: () => {}, // left arrow
            39: () => {}, // right arrow
            13: () => {}, // enter
            27: () => { // escape
                event.preventDefault();
                if (this.subMenuShown) {
                    this.hideCurrentSubMenu();
                } else {
                    this.story.views.confirm.confirmQuit();
                }
            },
        });
    }

    onWheel(event: any): void {}

    protected hideCurrentSubMenu(): void {
        super.hideCurrentSubMenu();
        this.showOverlay(this.overlay);
    }

    protected showSubmenu(btnName: string, ...content: JQuery<HTMLElement>[]): void {
        super.showSubmenu(btnName, ...content);
        this.showOverlay(this.gameMenuOverlay);
    }
}
