import * as E from 'fp-ts/lib/Either'
import { identity } from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import * as t from 'io-ts'

import AstNode from './AstNode'
import IfBlock from './IfBlock'

export default class If extends AstNode {
    protected _nexts: O.Option<IfBlock[]>

    toString = (): string => `If()`

    reduce = identity

    nexts = (): IfBlock[] =>
        pipe(
            this._nexts,
            O.mapNullable(_ => _.find(_ => _.condition())),
            O.fold(() => [], _ => [_])
        )

    static decode = (i: unknown): E.Either<t.Errors, If> =>
        pipe(
            IfType.decode(i),
            E.map(({ arguments: [idNexts] }) => new If(idNexts))
        )
}

const IfType = t.exact(
    t.type({
        class_name: t.literal('If'),
        arguments: t.tuple([t.array(t.string)])
    })
)
