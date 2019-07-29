import * as A from 'fp-ts/lib/Array'
import * as E from 'fp-ts/lib/Either'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import * as t from 'io-ts'

import GameProps from '../history/GameProps'
import MenuItem from './MenuItem'
import NodeWithChar from './NodeWithChar'

export default class Menu extends NodeWithChar {
    protected _nexts: O.Option<MenuItem[]>

    toString = (): string => {
        const args: string = A.compact([
            pipe(
                this.who,
                O.map(_ => _.name)
            ),
            O.some(this.what),
            ...this.nexts().map(_ => O.some(_.text))
        ])
            .map(_ => `"${_}"`)
            .join(', ')
        return `Menu(${args})`
    }

    reduce = (gameProps: GameProps): GameProps =>
        this.what === ''
            ? {
                  ...gameProps,
                  textboxHide: true,
                  choices: this.nexts()
              }
            : {
                  ...gameProps,
                  textboxChar: this.who,
                  textboxText: this.what,
                  choices: this.nexts()
              }

    nexts = (): MenuItem[] =>
        pipe(
            this._nexts,
            O.map(_ => _.filter(_ => _.condition)),
            O.getOrElse(() => [])
        )

    static decode = (menu: unknown): E.Either<t.Errors, Menu> =>
        pipe(
            MenuType.decode(menu),
            E.map(
                ({ arguments: [what, idNexts] }) =>
                    new Menu(O.none, what, idNexts)
            )
        )
}

const MenuType = t.exact(
    t.type({
        class_name: t.literal('Menu'),
        arguments: t.tuple([t.string, t.array(t.string)])
    })
)
