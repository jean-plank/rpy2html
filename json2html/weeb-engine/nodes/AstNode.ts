import * as A from 'fp-ts/lib/Array'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import * as R from 'fp-ts/lib/Record'

import Char from '../../renpy-json-loader/Char'
import GameProps from '../history/GameProps'
import Image from '../medias/Image'
import Sound from '../medias/Sound'
import Video from '../medias/Video'
import Obj from '../Obj'

export interface InitArgs {
    id: string
    data: AppData
}

export interface AppData {
    nodes: Obj<AstNode>
    chars: Obj<Char>
    sounds: Obj<Sound>
    videos: Obj<Video>
    images: Obj<Image>
}

export default abstract class AstNode {
    id: string

    protected _nexts: O.Option<AstNode[]> = O.none

    // _nexts will be set in init when all nodes are created
    constructor(
        private idNexts: string[],
        public stopExecution: boolean = false
    ) {}

    abstract toString(): string

    init({ id, data }: InitArgs) {
        this._nexts = O.some(
            A.filterMap((_: string) => R.lookup(_, data.nodes))(this.idNexts)
        )
        this.id = id
    }

    abstract reduce(gameProps: GameProps): GameProps

    nexts(): AstNode[] {
        return pipe(
            this._nexts,
            O.getOrElse(() => [])
        )
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

    followingBlock(): O.Option<AstNode[]> {
        if (A.isEmpty(this.nexts())) return O.none
        return O.some(this.followingBlockRec([]))
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
