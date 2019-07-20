import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'

import AstNode from '../nodes/AstNode'
import { GameHistoryState } from './gameHistoryReducer'

const historyFromState = ({ past, present }: GameHistoryState): AstNode[] => {
    const res = past.reduce<AstNode[]>((acc, [, _]) => [...acc, ..._], [])

    return pipe(
        present,
        O.map(([, _]) => [...res, ..._]),
        O.getOrElse(() => res)
    )
}
export default historyFromState
