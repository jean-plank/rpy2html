import * as A from 'fp-ts/lib/Array'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'

import GameProps from '../history/GameProps'
import NodeWithChar from './NodeWithChar'

export default class Say extends NodeWithChar {
    toString = (): string => {
        const args: string = A.compact([
            pipe(
                this.who,
                O.map(_ => _.name)
            ),
            O.some(this.what)
        ])
            .map(_ => `"${_}"`)
            .join(', ')
        return `Say(${args})`
    }

    reduce = (gameProps: GameProps): GameProps => ({
        ...gameProps,
        textboxChar: this.who,
        textboxText: this.what
    })
}
