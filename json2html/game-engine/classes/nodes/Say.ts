import * as _ from 'lodash';

import Node from './Node';
import Char from '../Char';
import IAppDatas from '../IAppDatas';

import GameController from '../GameController';


export default class Say extends Node {
    private whosName: string | null;
    private who: Char | null;
    private what: string;

    constructor (whosName: string | null, what: string, idNext?: number[] | null) {
        super(idNext, true);
        this.whosName = whosName;
        this.who = null;
        this.what = what;
    }

    toString(): string {
        return `Say(${this.who?`"${this.who.name}", `:""}"${this.what}")`;
    }

    init(game: GameController, datas: IAppDatas): void {
        super.init(game, datas);

        if (this.whosName !== null) {
            if (_.has(datas.chars, this.whosName))
                this.who = datas.chars[this.whosName];
            else console.warn(`Say: invalid character name: ${this.whosName}`);
        }
    }

    execute(): void {
        super.execute(); // ensures that game isn't null
        (this.game as GameController).say(this.who, this.what);
    }
}
