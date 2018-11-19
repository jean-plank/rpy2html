import * as _ from 'lodash';

import GameController from '../GameController';
import IAppDatas from '../IAppDatas';


export default abstract class Node {
    stopExecution: boolean;

    protected game: GameController | null = null;
    protected _nexts: Node[] | null = null;

    private idNexts: number[];

    constructor (idNext?: number[] | null, stopExecution=false) {
        // game and _nexts will be set by GameController when all nodes are
        // created

        if (idNext === undefined || idNext === null) this.idNexts = [];
        else this.idNexts = idNext;

        this.stopExecution = stopExecution;
    }

    abstract toString(): string;

    init(game: GameController, datas: IAppDatas) {
        this.game = game;
        this._nexts = _(this.idNexts)
            .map((id: number) => datas.nodes[id])
            .filter((next: Node | undefined) => next !== undefined)
            .value() as Node[];
    }

    load() {
        // ensures that game and _nexts aren't  null
        this.throwErrorIfNotInitiated();
        if (__DEV) console.log(`%cloading ${this}`, 'color: #bada55');
    }

    execute() {
        // ensures that game and _nexts aren't null
        this.throwErrorIfNotInitiated();
        if (__DEV) console.log(`%cexecuting ${this}`,
                               'color: blue; font-wheight: bold');

        if (this.stopExecution)
            _.forEach(this._nexts, (next: Node) => { next.loadBlock(); });
    }

    nexts(): Node[] {
        // ensures that game and _nexts aren't null
        this.throwErrorIfNotInitiated();
        return this._nexts as Node[];
    }

    /**
     * Loads recursively all ressources from this node to the next stopping
     * node.
     */
    loadBlock() {
        this.load();
        if (!this.stopExecution)
            _.forEach(this._nexts, (next: Node) => { next.loadBlock(); });
    }

    protected throwErrorIfNotInitiated() {
        if (this.game === null || this._nexts === null)
            throw EvalError("Node wasn't initiated.");
    }
}
