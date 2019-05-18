import { mapOption } from 'fp-ts/lib/Array';
import { none, Option, some } from 'fp-ts/lib/Option';
import { lookup } from 'fp-ts/lib/StrMap';

import AppData from '../app/AppData';
import GameProps from '../store/GameProps';

interface ConstructorArgs {
    idNexts?: string[];
    stopExecution?: boolean;
}

export interface InitArgs {
    data: AppData;
    execThenExecNext: (node: AstNode) => () => void;
}

export default abstract class AstNode {
    stopExecution: boolean;

    protected _nexts: Option<AstNode[]> = none;
    protected execThenExecNext: (node: AstNode) => () => void = () => () => {};
    private idNexts: string[];

    constructor({ idNexts = [], stopExecution = false }: ConstructorArgs = {}) {
        // _nexts will be set in init when all nodes are created
        this.idNexts = idNexts;
        this.stopExecution = stopExecution;
    }

    abstract toString(): string;

    init({ data, execThenExecNext }: InitArgs) {
        this._nexts = some(mapOption(this.idNexts, _ => lookup(_, data.nodes)));
        this.execThenExecNext = execThenExecNext;
    }

    load() {
        if (__DEV) console.log(`%cloading ${this}`, 'color: #bada55');
    }

    reduce(_gameProps: GameProps): Partial<GameProps> {
        if (this.stopExecution) {
            this._nexts.map(_ => _.forEach(_ => _.loadBlock()));
        }
        return {};
    }

    nexts(): AstNode[] {
        return this._nexts.getOrElse([]);
    }

    /**
     * Loads recursively all ressources from this node to the next stopping
     * node.
     */
    loadBlock(): void {
        this.load();
        if (!this.stopExecution) {
            this._nexts.map(_ => _.forEach(_ => _.loadBlock()));
        }
    }
}
