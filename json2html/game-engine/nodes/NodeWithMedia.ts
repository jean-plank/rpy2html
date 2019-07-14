import { none, Option } from 'fp-ts/lib/Option'

import Media from '../medias/Media'
import AstNode, { AppData, InitArgs } from './AstNode'

export default abstract class NodeWithMedia<T extends Media> extends AstNode {
    protected media: Option<T> = none

    constructor(
        private fromData: (data: AppData, mediaName: string) => Option<T>,
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
        this.media.map(_ => _.load())
    }

    init({ id, data, execThenExecNext }: InitArgs) {
        super.init({ id, data, execThenExecNext })
        this.media = this.fromData(data, this.mediaName)
        if (this.media.isNone()) {
            console.warn(
                `${this.constructor.name}: invalid name: ${this.mediaName}`
            )
        }
    }
}
