import { identity } from 'fp-ts/lib/function'

import AstNode from './AstNode'

export default class IfBlock extends AstNode {
    constructor(private rawCondition: string, idNexts: string[]) {
        super(idNexts)
    }

    toString = (): string => `IfBlock("${this.rawCondition}")`

    reduce = identity

    condition = (): boolean => eval(this.rawCondition) === true
}
