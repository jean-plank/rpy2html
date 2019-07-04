import { Either } from 'fp-ts/lib/Either';
import { identity } from 'fp-ts/lib/function';
import { Option } from 'fp-ts/lib/Option';
import * as t from 'io-ts';

import AstNode from './AstNode';
import IfBlock from './IfBlock';

export default class If extends AstNode {
    protected _nexts: Option<IfBlock[]>;

    toString = (): string => `If()`;

    reduce = identity;

    nexts = (): IfBlock[] =>
        this._nexts
            .mapNullable(_ => _.find(_ => _.condition()))
            .fold([], _ => [_])

    static decode = (i: unknown): Either<t.Errors, If> =>
        IfType.decode(i).map(({ arguments: [idNexts] }) => new If(idNexts))
}

const IfType = t.exact(
    t.type({
        class_name: t.literal('If'),
        arguments: t.tuple([t.array(t.string)])
    })
);
