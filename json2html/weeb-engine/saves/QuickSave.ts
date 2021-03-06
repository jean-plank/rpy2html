import * as t from 'io-ts'

import AstNode from '../nodes/AstNode'

export default class QuickSave {
    history: string[]

    static fromNodes = (history: AstNode[]): QuickSave => ({
        history: history.map(_ => _.id)
    })
}

export const QuickSaveType = t.exact(
    t.type({
        history: t.array(t.string)
    })
)
