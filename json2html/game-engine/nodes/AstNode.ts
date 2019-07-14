import { filterMap, isEmpty } from 'fp-ts/lib/Array'
import { none, Option, some } from 'fp-ts/lib/Option'
import { lookup, StrMap } from 'fp-ts/lib/StrMap'

import Char from '../Char'
import GameProps from '../history/GameProps'
import Image from '../medias/Image'
import Sound from '../medias/Sound'
import Video from '../medias/Video'

export interface InitArgs {
    id: string
    data: AppData
    execThenExecNext: (node: AstNode) => () => void
}

export interface AppData {
    nodes: StrMap<AstNode>
    chars: StrMap<Char>
    sounds: StrMap<Sound>
    videos: StrMap<Video>
    images: StrMap<Image>
}

export default abstract class AstNode {
    id: string

    protected _nexts: Option<AstNode[]> = none
    protected execThenExecNext: (node: AstNode) => () => void = () => () => {}

    // _nexts will be set in init when all nodes are created
    constructor(
        private idNexts: string[],
        public stopExecution: boolean = false
    ) {}

    abstract toString(): string

    init({ id, data, execThenExecNext }: InitArgs) {
        this._nexts = some(
            filterMap((_: string) => lookup(_, data.nodes))(this.idNexts)
        )
        this.execThenExecNext = execThenExecNext
        this.id = id
    }

    abstract reduce(gameProps: GameProps): GameProps

    nexts(): AstNode[] {
        return this._nexts.getOrElse([])
    }

    protected load() {}

    /**
     * Loads recursively all ressources from this node to the next stopping
     * node.
     */
    loadBlock() {
        this.load()
        if (!this.stopExecution) this.nexts().forEach(_ => _.loadBlock())
    }

    followingBlock(): Option<AstNode[]> {
        if (isEmpty(this.nexts())) return none
        return some(this.followingBlockRec([]))
    }

    private followingBlockRec(acc: AstNode[]): AstNode[] {
        const nexts = this.nexts()
        if (nexts.length === 0) return acc
        if (nexts.length !== 1) {
            throw EvalError(`Node ${this} has more than one next node`)
        }
        const next = nexts[0]
        if (next.stopExecution) return [...acc, next]
        return next.followingBlockRec([...acc, next])
    }
}
