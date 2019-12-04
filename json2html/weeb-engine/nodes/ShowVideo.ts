import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import * as R from 'fp-ts/lib/Record'

import GameProps from '../history/GameProps'
import { isDisplayable, Listenable } from '../medias/Media'
import * as SoundAction from '../sound/SoundAction'
import AstNode from './AstNode'

export default class ShowVideo extends AstNode {
    constructor(private chanName: string, idNexts: string[]) {
        super(idNexts)
    }

    toString = (): string => `ShowVideo("${this.chanName}")`

    reduce = (gameProps: GameProps): GameProps => {
        const onPlay = ([media]: [Listenable, boolean]): GameProps => {
            if (isDisplayable(media) && !gameProps.shown.includes(media)) {
                return {
                    ...gameProps,
                    shown: [...gameProps.shown, media]
                }
            }
            return gameProps
        }

        return pipe(
            R.lookup(this.chanName, gameProps.sounds),
            O.map(_ =>
                pipe(
                    _,
                    SoundAction.fold({
                        onStop: () => gameProps,
                        onPlaying: () => gameProps,
                        onPlay
                    })
                )
            ),
            O.getOrElse(() => gameProps)
        )
    }
}
