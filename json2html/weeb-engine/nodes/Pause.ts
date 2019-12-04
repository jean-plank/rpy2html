import GameProps from '../history/GameProps'
import AstNode from './AstNode'

export default class Pause extends AstNode {
    constructor(idNexts: string[]) {
        super(idNexts, true)
    }

    toString = (): string => `Pause()`

    reduce = (gameProps: GameProps): GameProps => ({
        ...gameProps,
        textboxHide: !gameProps.showWindow
    })
}
