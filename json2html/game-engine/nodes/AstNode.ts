import { mapOption } from 'fp-ts/lib/Array';
import { none, Option, some } from 'fp-ts/lib/Option';
import { lookup, StrMap } from 'fp-ts/lib/StrMap';

import GameProps from '../gameHistory/GameProps';
import Char from '../models/Char';
import Image from '../models/medias/Image';
import Sound from '../models/medias/Sound';
import Video from '../models/medias/Video';
import NodeWithMedia from './NodeWithMedia';

interface ConstructorArgs {
    idNexts?: string[];
    stopExecution?: boolean;
}

export interface InitArgs {
    id: string;
    data: AppData;
    execThenExecNext: (node: AstNode) => () => void;
}

export interface AppData {
    nodes: StrMap<AstNode>;
    chars: StrMap<Char>;
    sounds: StrMap<Sound>;
    videos: StrMap<Video>;
    images: StrMap<Image>;
}

export default abstract class AstNode {
    stopExecution: boolean;
    id: string;

    protected _nexts: Option<AstNode[]> = none;
    protected execThenExecNext: (node: AstNode) => () => void = () => () => {};
    private idNexts: string[];

    constructor({ idNexts = [], stopExecution = false }: ConstructorArgs) {
        // _nexts will be set in init when all nodes are created
        this.idNexts = idNexts;
        this.stopExecution = stopExecution;
    }

    abstract toString(): string;

    init({ id, data, execThenExecNext }: InitArgs) {
        this._nexts = some(mapOption(this.idNexts, _ => lookup(_, data.nodes)));
        this.execThenExecNext = execThenExecNext;
        this.id = id;
    }

    abstract reduce(gameProps: GameProps): GameProps;

    nexts(): AstNode[] {
        return this._nexts.getOrElse([]);
    }

    /**
     * Loads recursively all ressources from this node to the next stopping
     * node.
     */
    loadBlock() {
        if (this instanceof NodeWithMedia) {
            if (__DEV) console.log(`%cloading ${this}`, 'color: #bada55');
            this.load();
        }
        if (!this.stopExecution) this.nexts().forEach(_ => _.loadBlock());
    }

    followingBlock = (): AstNode[] => this.followingBlockRec([]);

    private followingBlockRec = (acc: AstNode[]): AstNode[] => {
        const nexts = this.nexts();
        if (nexts.length === 0) return acc;
        if (nexts.length !== 1) {
            throw EvalError(`Node ${this} has more than one next node`);
        }
        const next = nexts[0];
        if (next.stopExecution) return [...acc, next];
        return next.followingBlockRec([...acc, next]);
    }
}
