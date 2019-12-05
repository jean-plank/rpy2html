import { identity } from 'fp-ts/lib/function'

import evalOrLog from '../utils/evalOrLog'
import AstNode from './AstNode'

export default class IfBlock extends AstNode {
    constructor(private rawCondition: string, idNexts: string[]) {
        super(idNexts)
    }

    toString = (): string => `IfBlock("${this.rawCondition}")`

    reduce = identity

    condition = (): boolean =>
        evalOrLog(this.constructor.name, this.rawCondition) === true
}
