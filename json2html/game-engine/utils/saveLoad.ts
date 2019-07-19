import { Do } from 'fp-ts-contrib/lib/Do'
import * as A from 'fp-ts/lib/Array'
import * as E from 'fp-ts/lib/Either'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'

import { GameHistoryState } from '../history/gameHistoryReducer'
import { GameState } from '../history/gameStateReducer'
import { HistoryAction } from '../history/historiable'
import statesFromHistory from '../history/statesFromHistory'
import AstNode from '../nodes/AstNode'
import QuickSave from '../saves/QuickSave'
import { SavesAction } from '../saves/savesReducer'

export const loadAction = (
    firstNode: AstNode,
    save: QuickSave
): O.Option<HistoryAction<GameState>> =>
    Do(O.option)
        .bindL('newPast', () =>
            O.fromEither(
                pipe(
                    statesFromHistory(firstNode, save.history),
                    E.mapLeft(_ =>
                        console.error('Error while loading save:', _)
                    )
                )
            )
        )
        .bindL('present', ({ newPast }) => A.last(newPast))
        .return(({ newPast, present }) => ({
            type: 'RESET',
            past: pipe(
                A.init(newPast),
                O.getOrElse(() => [])
            ),
            present
        }))

export const saveAction = (
    state: GameHistoryState,
    slot?: number
): SavesAction => {
    const history = historyFromState(state)
    if (slot === undefined) return { type: 'QUICK_SAVE', history }
    return { type: 'SAVE', history, slot }
}

export const historyFromState = ({
    past,
    present
}: GameHistoryState): AstNode[] => {
    const res = past.reduce<AstNode[]>((acc, [, _]) => [...acc, ..._], [])
    return pipe(
        present,
        O.map(([, _]) => [...res, ..._]),
        O.getOrElse(() => res)
    )
}
