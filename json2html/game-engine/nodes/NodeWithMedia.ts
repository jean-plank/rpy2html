import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'

import Media from '../medias/Media'
import AstNode, { AppData, InitArgs } from './AstNode'

export default abstract class NodeWithMedia<T extends Media> extends AstNode {
    protected media: O.Option<T> = O.none

    constructor(
        private fromData: (data: AppData, mediaName: string) => O.Option<T>,
        public mediaName: string,
        idNexts: string[],
        stopExecution = false
    ) {
        super(idNexts, stopExecution)
    }

    toString(): string {
        return `${this.constructor.name}("${this.mediaName}")`
    }

    protected load() {
        super.load()
        if (__DEV) console.log(`%cloading ${this}`, 'color: #bada55')
        pipe(
            this.media,
            O.map(_ => _.load())
        )
    }

    init({ id, data, execThenExecNext }: InitArgs) {
        super.init({ id, data, execThenExecNext })
        this.media = this.fromData(data, this.mediaName)
        if (O.isNone(this.media)) {
            console.warn(
                `${this.constructor.name}: invalid name: ${this.mediaName}`
            )
        }
    }
}
