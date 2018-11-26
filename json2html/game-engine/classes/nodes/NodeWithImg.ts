import * as _ from 'lodash';

import Node from './Node';
import IAppDatas from '../IAppDatas';

import GameController from '../GameController';
import Image from '../Image';


export default abstract class NodeWithImg extends Node {
    protected image: Image | null = null;

    private imgName: string;

    constructor (imgName: string, idNext?: number[] | null) {
        super(idNext);
        this.imgName = imgName;
    }

    toString(): string {
        return `${this.constructor.name}("${this.imgName}")`;
    }

    init(game: GameController, datas: IAppDatas) {
        super.init(game, datas);

        if (_.has(datas.images, this.imgName)) {
            this.image = datas.images[this.imgName];
        } else {
            console.warn(
                `${this.constructor.name}: invalid image name: ${this.imgName}`);
        }
    }
}
