import GameProps from '../history/GameProps'
import AstNode from './AstNode'

export default class PyExpr extends AstNode {
    constructor(private code: string, idNexts: string[]) {
        super(idNexts)
    }

    toString = (): string => `PyExpr("${this.code}")`

    reduce = (gameProps: GameProps): GameProps => {
        try {
            eval(this.code)
        } catch (e) {
            console.error('PyExpr evaluation error:', e)
        }
        return gameProps
    }
}
