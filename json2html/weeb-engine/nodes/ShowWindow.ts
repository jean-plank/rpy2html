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
}
