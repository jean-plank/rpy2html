import * as E from 'fp-ts/lib/Either'
import { identity } from 'fp-ts/lib/function'
import { pipe } from 'fp-ts/lib/pipeable'
import * as t from 'io-ts'

import convertToJs from '../utils/convertToJs'
import AstNode from './AstNode'

export default class MenuItem extends AstNode {
    condition: boolean

    constructor(public text: string, condition: string, idNexts: string[]) {
        super(idNexts)
        this.condition = eval(convertToJs(condition)) === true
    }

    toString = (): string => `MenuItem("${this.text}")`

    reduce = identity

    static decode = (menuItem: unknown): E.Either<t.Errors, MenuItem> =>
        pipe(
            MenuItemType.decode(menuItem),
            E.map(
                ({ arguments: [imgName, condition, idNexts] }) =>
                    new MenuItem(imgName, condition, idNexts)
            )
        )
}

const MenuItemType = t.exact(
    t.type({
        class_name: t.literal('MenuItem'),
        arguments: t.tuple([t.string, t.string, t.array(t.string)])
    })
)
