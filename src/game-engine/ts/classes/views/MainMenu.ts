import * as _ from 'lodash';
import * as $ from 'jquery';

import { StoryDatas, Story } from "../Story";
import { Image } from '../Image';
import { Sound } from '../Sound';
import { View } from './View';
import { translations as transl, Language as Lang } from '../../translations';


export class MainMenu extends View {
    private background: Image;
    private music: Sound;

    constructor (datas: StoryDatas) {
        super();

        this.story.$.mainMenu.hide();

        type Btn = {
            id: string;
            txt: string;
            disabled: boolean;
        };

        const lang: Lang =
            _.has(transl, datas.lang)?transl[datas.lang]:transl["en"];
        const btns: Array<Btn> = [
            { id: "start-btn", txt: lang.mainMenu.start, disabled: false },
            { id: "load-btn", txt: lang.mainMenu.load, disabled: true },
            { id: "prefs-btn", txt: lang.mainMenu.prefs, disabled: true },
            { id: "help-btn", txt: lang.mainMenu.help, disabled: true },
            { id: "quit-btn", txt: lang.mainMenu.quit, disabled: false },
        ];

        _.forEach(btns, (btn: Btn) =>
            this.story.$.mainMenu.children(".items").first().append(
                $('<button>')
                    .attr("id", btn.id)
                    .prop("disabled", btn.disabled)
                    .text(btn.txt)));


        if (datas.showName) {
            $('#game-name').text(datas.name);
            $('#game-version').text(datas.version);
        }

        if (datas.main_menu_bg != undefined) {
            this.background = this.story.images[datas.main_menu_bg];
            if (this.background != undefined) this.background.load();
        }
        if (datas.main_menu_music != undefined) {
            this.music = this.story.sounds[datas.main_menu_music];
            if (this.music != undefined) this.music.load();
        }
    }

    show(): void {
        this.story.hideCurrentView();
        super.show();

        this.story.$.mainMenu.show();
        this.story.scene(this.background);
        this.story.chans.music.play(this.music);

        this.story.$.textbox.hide();
    }

    hide(): void {
        super.hide();

        this.story.$.mainMenu.hide();
        this.story.$.scene.empty();
        this.story.$.textbox.show();
    }

    onClick(story: Story, event: any) {
        const btn = $(event.target).closest("button");

        if (btn.length !== 0) {
            switch (btn.attr('id')) {
                case 'start-btn':
                    story.views.game.start();
                    break;

                case 'quit-btn':
                    story.views.confirm.confirmQuit();
                    break;
            }
        }
    }

    onKeyup(story: Story, event: any): void {
        switch (event.which) {
            case 38: // up arrow
                break;

            case 40: // down arrow
                break;

            case 37: // left arrow
                break;

            case 39: // right arrow
                break;

            case 13: // enter
                break;

            case 27: // escape
                event.preventDefault();
                story.views.confirm.confirmQuit();
                break;
        }
    }

    onWheel(story: Story, event: any): void {}
}
