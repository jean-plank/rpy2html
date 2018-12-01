import * as _ from 'lodash';

import Node from './Node';
import IAppDatas from '../IAppDatas';

import GameController from '../GameController';
import Video from '../Video';


export default class PlayVideo extends Node {
    private video: Video | null = null;
    private vidName: string;

    constructor (vidName: string, idNext?: number[] | null) {
        super(idNext, true);
        this.vidName = vidName;
    }

    toString(): string {
        return `PlayVideo("${this.vidName}")`;
    }

    init(game: GameController, datas: IAppDatas) {
        super.init(game, datas);

        if (_.has(datas.videos, this.vidName)) {
            this.video = datas.videos[this.vidName];
        } else {
            console.warn(`PlayVideo: invalid video name: ${this.vidName}`);
        }
    }

    load() {
        super.load(); // ensures that game isn't null
        if (this.video !== null) {
            this.video.load();
            const f = () => {
                (this.game as GameController).execNextIfNotMenu();
            };
            this.video.onEnded(f);
        }
    }

    execute() {
        super.execute(); // ensures that game isn't null
        if (this.video !== null) {
            (this.game as GameController).cutscene(this.video);
        }
    }

    beforeNext() {
        super.beforeNext();
        if (this.video !== null) this.video.stop();
        if (this.game !== null) this.game.afterCutscene();
    }
}
