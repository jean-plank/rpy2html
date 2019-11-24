import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import * as R from 'fp-ts/lib/Record'

import Char from '../../renpy-json-loader/Char'
import AstNode, { InitArgs } from './AstNode'

export default abstract class NodeWithChar extends AstNode {
    who: O.Option<Char> = O.none

    constructor(
        private whosName: O.Option<string>,
        public what: string,
        idNexts: string[]
    ) {
        super(idNexts, true)
    }

    init({ id, data }: InitArgs) {
        super.init({ id, data })
        this.who = pipe(
            this.whosName,
            O.chain(name => {
                const res = R.lookup(name, data.chars)
                if (O.isNone(res)) {
                    console.warn(`Say: invalid character name: ${name}`)
                }
                return res
            })
        )
    }
}
