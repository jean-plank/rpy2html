import { Do } from 'fp-ts-contrib/lib/Do'
import * as A from 'fp-ts/lib/Array'
import * as E from 'fp-ts/lib/Either'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'

import { GameState } from '../history/gameStateReducer'
import { HistoryAction } from '../history/historiable'
import statesFromHistory from '../history/statesFromHistory'
import AstNode from '../nodes/AstNode'
import QuickSave from '../saves/QuickSave'

const loadAction = (
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
export default loadAction
