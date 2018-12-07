import * as _ from 'lodash';

import Node from './Node';
import IAppDatas from '../IAppDatas';

import GameController from '../GameController';
import Video from '../Video';
import { IGameProps } from '../GameProps';


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
        super.load();
        if (this.video !== null) this.video.load();
    }

    execute(gameProps: IGameProps): Partial<IGameProps> {
        const res = super.execute(gameProps);
        if (this.video !== null) {
            res.video = this.video.clone();
        }
        return res;
    }

    beforeNext(gameProps: IGameProps): Partial<IGameProps> {
        const res = super.beforeNext(gameProps);
        if (this.video !== null) this.video.stop();
        res.video = null;
        return res;
    }
}
