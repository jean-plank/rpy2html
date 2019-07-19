import * as E from 'fp-ts/lib/Either'
import { identity } from 'fp-ts/lib/function'
import { pipe } from 'fp-ts/lib/pipeable'
import * as t from 'io-ts'

import convertToJs from '../utils/convertToJs'
import AstNode from './AstNode'

export default class IfBlock extends AstNode {
    private rawCondition: string

    constructor(condition: string, idNexts: string[]) {
        super(idNexts)
        this.rawCondition = convertToJs(condition)
    }

    toString = (): string => `IfBlock("${this.rawCondition}")`

    reduce = identity

    condition = (): boolean => eval(this.rawCondition) === true

    static decode = (ifBlock: unknown): E.Either<t.Errors, IfBlock> =>
        pipe(
            IfBlockType.decode(ifBlock),
            E.map(
                ({ arguments: [condition, idNexts] }) =>
                    new IfBlock(condition, idNexts)
            )
        )
}

const IfBlockType = t.exact(
    t.type({
        class_name: t.literal('IfBlock'),
        arguments: t.tuple([t.string, t.array(t.string)])
    })
)
