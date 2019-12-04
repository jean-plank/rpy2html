import GameProps from '../history/GameProps'
import * as SA from '../sound/SoundAction'
import AstNode from './AstNode'

export default class Stop extends AstNode {
    constructor(private chanName: string, idNexts: string[]) {
        super(idNexts)
    }

    toString = (): string => `Stop("${this.chanName}")`

    reduce = (gameProps: GameProps): GameProps => ({
        ...gameProps,
        sounds: {
            ...gameProps.sounds,
            [this.chanName]: SA.stop
        }
    })
}
