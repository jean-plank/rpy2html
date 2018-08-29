import * as $ from 'jquery';

import { StoryDatas, Story } from "./Story";
import { Image } from './Image';
import { Sound } from './Sound';


export class MainMenu {
    private story: Story;

    background: Image;
    music: Sound;


    constructor (story: Story, datas: StoryDatas) {
        this.story = story;

        $('#game-name').text(datas.name);

        $('#game-version').text(datas.version);

        if (!datas.showName) $('#game-infos').hide();

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
        this.story.state.currentNode = null;
        this.story.$.mainMenu.show();
        this.story.scene(this.background);

        if (this.music != undefined) {
            this.story.chans.music.play(this.music);
        }
        this.story.$.textbox.hide();
    }

    hide(): void {
        this.story.$.mainMenu.hide();
        this.story.$.scene.css("background-color", "");
        this.story.$.textbox.show();
    }
}
