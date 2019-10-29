import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/pipeable'
import * as t from 'io-ts'

import GameProps from '../history/GameProps'
import convertToJs from '../utils/convertToJs'
import AstNode from './AstNode'

export default class PyExpr extends AstNode {
    private code: string

    constructor(code: string, idNexts: string[]) {
        super(idNexts)
        this.code = convertToJs(code)
    }

    toString = (): string => `PyExpr("${this.code}")`

    reduce = (gameProps: GameProps): GameProps => {
        try {
            eval(this.code)
        } catch (e) {
            console.error('PyExpr evaluation error:', e)
        }
        return gameProps
    }

    static decode = (pyExpr: unknown): E.Either<t.Errors, PyExpr> =>
        pipe(
            PyExprType.decode(pyExpr),
            E.map(({ arguments: [code, idNexts] }) => new PyExpr(code, idNexts))
        )
}

const PyExprType = t.exact(
    t.type({
        class_name: t.literal('PyExpr'),
        arguments: t.tuple([t.string, t.array(t.string)])
    })
)