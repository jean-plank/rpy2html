import * as _ from 'lodash';
import * as $ from 'jquery';

import { Channel } from '../Channel';
import { Sound } from '../Sound';
import { View } from './View';
import { translations as transl, Language as Lang } from "../../translations";
import { actionKey } from "../../utils";


class Btn {
    txt: string;
    action: (e: any) => void;

    constructor (txt: string, action: (e: any) => void) {
        this.txt = txt;
        this.action = action;
    }
}


export class Confirm extends View {
    private $message: JQuery<HTMLElement>;
    private $items: JQuery<HTMLElement>;
    private previousView: View;
    private buttons: Btn[];
    private escapeAction: (e: any) => void;
    private confirmAudioShown: boolean;
    private lang: Lang;

    constructor (strLang: string) {
        super();

        this.confirmAudioShown = false;

        this.$message = $("#confirm-msg");
        this.$items = this.story.$.confirm.find(".items").first();
        this.hide();

        this.lang = _.has(transl, strLang)?transl[strLang]:transl["en"];
    }

    show(): void {
        this.previousView = this.story.currentView;
        super.show();

        this.story.$.confirm.show();
    }

    hide(): void {
        super.hide();
        this.story.$.confirm.hide();

        if (this.previousView != undefined) {
            this.story.currentView = this.previousView;
        }
    }

    confirmAudio(chan: Channel, ...snd: Sound[]): void {
        if (!this.confirmAudioShown) {
            const siht = this;

            this.confirmAudioShown = true;
            this.confirm(
                this.lang.confirm.audio,
                [new Btn(this.lang.confirm.audioBtn, () => chan.play(...snd))],
                () => {
                    chan.play(...snd);
                    siht.hide(); });
        }
    }

    confirmQuit(): void {
        const siht = this;

        this.confirm(
            this.lang.confirm.quit,
            [   new Btn(
                    this.lang.confirm.yes,
                    () => window.location.assign(
                        window.location.protocol+"//"+window.location.host)),
                new Btn(this.lang.confirm.no, () => {})],
            () => siht.hide());
    }

    confirmMMenu(): void {
        const siht = this;

        this.confirm(
            this.lang.confirm.mmenu,
            [   new Btn(
                    this.lang.confirm.yes,
                    () => {
                        siht.story.currentView.hide();
                        siht.story.views.mainMenu.show();
                    }),
                new Btn(
                    this.lang.confirm.no,
                    () => {})],
            () => siht.hide());
    }

    private confirm(msg: string, buttons: Btn[], escapeAction: (e: any) => void): void {
        this.show();

        this.buttons = buttons;
        this.escapeAction = escapeAction;

        this.$message.html(msg);
        this.$items.empty();

        _.forEach(buttons, (btn: Btn) =>
            this.$items.append($("<button>").text(btn.txt)));
    }

    onLeftClick(event: any): void {
        const $btn = $(event.target).closest("button");

        if ($btn.length === 0) {
            const $confirmFrame = $(event.target).closest("#confirm>.frame");

            if ($confirmFrame.length === 0) {
                // if click wasn't on #confirm>.frame
                this.escapeAction(event);
            }
        } else {
            this.story.currentView.hide();
            this.buttons[$btn.index()].action(event);
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
                this.escapeAction(event);
            },
        });
    }

    onWheel(event: any): void {}
}
