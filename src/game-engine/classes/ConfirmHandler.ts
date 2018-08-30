import * as _ from 'lodash';
import * as $ from 'jquery';

import { Channel } from './Channel';
import { Sound } from './Sound';
import { Story } from './Story';


export class ConfirmHandler {
    private $confirm: JQuery<HTMLElement>;
    private $message: JQuery<HTMLElement>;
    private $items: JQuery<HTMLElement>;

    hidden: boolean;

    constructor () {
        this.$confirm = Story.getInstance().$.confirm;
        this.$message = $("#confirm-msg");
        this.$items = this.$confirm.find(".items").first();
        this.hide();
    }

    hide(): void {
        this.$confirm.hide();
        this.hidden = true;
    }

    notifyAudio(chan: Channel, snd: Sound | Array<Sound>) {
        this.confirm(
            "Be aware that this page is playing audio.",
            { "STFU and take me to the game": () => chan.play(snd) });
    }

    confirm(msg: string, btns: { [txt: string]: (e: any) => void }): void {
        function onclick(siht: ConfirmHandler, f: (e: any) => void): (e: any) => void {
            return (event: any) => {
                event.stopPropagation();
                f(event);
                siht.hide();
            }
        }

        this.$confirm.show();
        this.hidden = false;
        this.$message.text(msg);
        this.$items.empty();
        _.forEach(btns, (f: (e: any) => void, txt: string) =>
            this.$items.append(
                $("<button>")
                    .text(txt)
                    .click(onclick(this, f))));
    }
}
