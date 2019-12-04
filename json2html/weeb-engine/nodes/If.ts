import { identity } from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'

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
            O.fold(
                () => [],
                _ => [_]
            )
        )
}
