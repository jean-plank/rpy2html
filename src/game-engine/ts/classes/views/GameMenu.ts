import * as _ from "lodash";
import * as $ from "jquery";

import { StoryDatas } from "../Story";
import { Menu } from "./Menu";
import { translations as transl, Language as Lang } from "../../translations";
import { View } from "./View";
import { actionBtn, actionKey, existingSaves, storeSave } from "../../utils";
import { MenuButton } from "./MenuButton";


export class GameMenu extends Menu {
    private previousView: View;
    private lang: string;

    constructor (datas: StoryDatas) {
        super(datas);

        this.$menuItems = this.story.$.gameMenu.find(".menu-items").first();
        this.$submenu = this.story.$.gameMenu.find(".submenu>div").first();
        this.story.$.gameMenu.hide();

        this.lang = _.has(transl, datas.lang)?datas.lang:"en";

        const lang = transl[datas.lang];
        const btns: MenuButton[] = [
            new MenuButton("save", lang.menu.save),
            new MenuButton("load", lang.menu.load),
            // new MenuButton("prefs", lang.menu.prefs),
            new MenuButton("mmenu", lang.menu.mmenu),
            new MenuButton("help", lang.menu.help),
            new MenuButton("quit", lang.menu.quit),
        ];

        _.forEach(btns, (btn: MenuButton) =>
            this.$menuItems.append(
                $("<button>")
                    .attr("name", btn.name)
                    .prop("disabled", btn.disabled)
                    .text(btn.txt)));

        this.background = datas.game_menu_bg;
        this.overlay = datas.game_menu_overlay;
    }

    show(): void {
        this.previousView = this.story.currentView;
        super.show();

        this.story.$.gameMenu.show();
    }

    hide(): void {
        super.hide();
        this.hideCurrentSubMenu();
        this.story.$.gameMenu.hide();

        if (this.previousView != undefined) {
            this.story.currentView = this.previousView;
        }
    }

    onLeftClick(event: any): void {
        if (!actionBtn(event, {
            "save": () => this.showSave(),
            "load": () => this.showLoad(),
            "prefs": () => {},
            "mmenu": () => this.story.views.confirm.confirmMMenu(),
            "help": () => this.showHelp(),
            "quit": () => {
                this.hideCurrentSubMenu();
                this.story.views.confirm.confirmQuit();
            },
        })) {
            const $slot: JQuery<HTMLElement> = $(event.target).closest(".slot");

            if ($slot.length !== 0) {
                const opts: Intl.DateTimeFormatOptions = {
                    day: "numeric",
                    month: "long",
                    weekday: "long",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                };
                storeSave({ img: this.story.shownScene.file,
                            date: new Date()
                                .toLocaleDateString(this.lang, opts), },
                          $slot.index());
            }
        }
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
                this.hide();
            },
        });
    }

    onWheel(event: any): void {}

    private showSave(): void {
        const content: JQuery<HTMLElement>[] =
            _.map(existingSaves(), (save) => {
                const $slot = $("<div>").addClass("slot");
                if (save !== null) {
                    $slot.append(
                        $("<img>").attr("src", save.img),
                        $("<div>").addClass("date")
                                  .text(save.date));
                }
                return $slot;
            });
        this.showSubmenu("save", ...content);
    }
}
