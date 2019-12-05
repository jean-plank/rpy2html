import GameProps from '../history/GameProps'
import evalOrLog from '../utils/evalOrLog'
import AstNode from './AstNode'

export default class PyExpr extends AstNode {
    constructor(private code: string, idNexts: string[]) {
        super(idNexts)
    }

    toString = (): string => `PyExpr("${this.code}")`

    reduce = (gameProps: GameProps): GameProps => {
        evalOrLog(this.constructor.name, this.code)
        return gameProps
    }
}
