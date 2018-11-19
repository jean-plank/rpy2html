import * as _ from 'lodash';

import Node from './Node';

import IAppDatas from '../IAppDatas';
import GameController from '../GameController';
import Char from '../Char';


export default abstract class NodeWithChar extends Node {
    who: Char | null;
    what: string;

    private whosName: string | null;

    constructor (whosName: string | null, what: string, idNext?: number[] | null) {
        super(idNext, true);
        this.whosName = whosName;
        this.who = null;
        this.what = what;
    }

    init(game: GameController, datas: IAppDatas): void {
        super.init(game, datas);

        if (this.whosName !== null) {
            if (_.has(datas.chars, this.whosName))
                this.who = datas.chars[this.whosName];
            else console.warn(`Say: invalid character name: ${this.whosName}`);
        }
    }
}
