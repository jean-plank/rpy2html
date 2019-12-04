import { identity } from 'fp-ts/lib/function'

import AstNode from './AstNode'

export default class MenuItem extends AstNode {
    constructor(
        public text: string,
        private rawCondition: string,
        idNexts: string[]
    ) {
        super(idNexts)
    }

    toString = (): string => `MenuItem("${this.text}")`

    reduce = identity

    condition = (): boolean => eval(this.rawCondition) === true
}
