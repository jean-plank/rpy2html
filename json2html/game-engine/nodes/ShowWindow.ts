import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/pipeable'
import * as t from 'io-ts'

import GameProps from '../history/GameProps'
import AstNode from './AstNode'

export default class ShowWindow extends AstNode {
    constructor(private show: boolean, idNexts: string[]) {
        super(idNexts)
    }

    toString = (): string => `ShowWindow(${this.show})`

    reduce = (gameProps: GameProps): GameProps => ({
        ...gameProps,
        showWindow: this.show
    })

    static decode = (showWindow: unknown): E.Either<t.Errors, ShowWindow> =>
        pipe(
            ShowWindowType.decode(showWindow),
            E.map(
                ({ arguments: [show, idNexts] }) =>
                    new ShowWindow(show, idNexts)
            )
        )
}

const ShowWindowType = t.exact(
    t.type({
        class_name: t.literal('ShowWindow'),
        arguments: t.tuple([t.boolean, t.array(t.string)])
    })
)
