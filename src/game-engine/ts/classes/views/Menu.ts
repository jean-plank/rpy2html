import * as _ from "lodash";
import * as $ from "jquery";

import { View } from "./View";
import { StoryDatas } from "../Story";
import { existingSaves } from "../../utils";


export abstract class Menu extends View {
    private help: JQuery<HTMLElement>;
    protected $menuItems: JQuery<HTMLElement>;
    protected $submenu: JQuery<HTMLElement>;
    protected subMenuShown: boolean;
    protected background: string;
    protected overlay: string;

    constructor (datas: StoryDatas) {
        super();

        this.help = $(datas.help);
    }

    protected showBackground(url: string): void {
        this.story.$.menuBg.attr("src", url).show();
    }

    protected hideBackground(): void {
        this.story.$.menuBg.removeAttr("src").hide();
    }

    protected showOverlay(url: string): void {
        this.story.$.menuOverlay.attr("src", url).show();
    }

    protected hideOverlay(): void {
        this.story.$.menuOverlay.removeAttr("src").hide();
    }

    show(): void {
        this.story.hideCurrentView();
        super.show();

        this.showBackground(this.background);
        this.showOverlay(this.overlay);
    }

    hide(): void {
        super.hide();

        this.hideBackground();
        this.hideOverlay();
    }

    protected hideCurrentSubMenu(): void {
        this.$menuItems.children("button.selected").removeClass("selected");
        this.$submenu.empty();
        this.subMenuShown = false;
    }

    protected showSubmenu(btnName: string, ...content: JQuery<HTMLElement>[]): void {
        this.hideCurrentSubMenu();
        this.$menuItems.children(`button[name=${btnName}]`)
            .addClass("selected");
        this.$submenu.append(content);
        this.subMenuShown = true;
    }

    protected showLoad(): void {
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
        this.showSubmenu("load", ...content);
    }

    protected showHelp(): void {
        this.showSubmenu("help", this.help);
    }
}
