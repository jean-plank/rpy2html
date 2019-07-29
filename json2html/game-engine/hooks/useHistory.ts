import { Do } from 'fp-ts-contrib/lib/Do'
import * as A from 'fp-ts/lib/Array'
import * as E from 'fp-ts/lib/Either'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import { useReducer } from 'react'

import * as context from '../context'
import gameHistoryReducer, {
    emptyGameHistoryState
} from '../history/gameHistoryReducer'
import { GameState } from '../history/gameStateReducer'
import { HistoryAction } from '../history/historiable'
import statesFromHistory from '../history/statesFromHistory'
import AstNode from '../nodes/AstNode'
import Menu from '../nodes/Menu'
import QuickSave from '../saves/QuickSave'
import SoundService from '../sound/SoundService'

export interface HistoryHook {
    present: O.Option<GameState>
    empty: () => void
    addBlock: (block: AstNode[]) => void
    undo: () => void
    redo: () => void
    currentNode: () => O.Option<AstNode>
    noPast: () => boolean
    noFuture: () => boolean
    historyFromState: () => AstNode[]
    loadSave: (save: QuickSave) => void
    quickLoad: () => void
    skip: () => void
}

const useHistory = (
    quickSave: () => O.Option<QuickSave>,
    soundService: SoundService,
    notify: (message: string) => void,
    showGame: () => void,
    showMainMenu: () => void
): HistoryHook => {
    const [{ past, present, future }, dispatchGameHistoryAction] = useReducer(
        gameHistoryReducer,
        emptyGameHistoryState
    )

    const empty = () => dispatchGameHistoryAction({ type: 'EMPTY' })

    const addBlock = (block: AstNode[]) =>
        dispatchGameHistoryAction({ type: 'ADD_BLOCK', block })

    const undo = () => dispatchGameHistoryAction({ type: 'UNDO' })

    const redo = () => dispatchGameHistoryAction({ type: 'REDO' })

    const currentNode = (): O.Option<AstNode> =>
        Do(O.option)
            .bind('present', present)
            .bindL('currentNode', ({ present: [, block] }) => A.last(block))
            .return(({ currentNode }) => currentNode)

    const noPast = () => A.isEmpty(past)

    const noFuture = () => A.isEmpty(future)

    const historyFromState = (): AstNode[] => {
        const res = past.reduce<AstNode[]>((acc, [, _]) => [...acc, ..._], [])

        return pipe(
            present,
            O.map(([, _]) => [...res, ..._]),
            O.getOrElse(() => res)
        )
    }

    const loadSave = (save: QuickSave) =>
        pipe(
            loadAction(context.firstNode, save),
            O.map(_ => {
                soundService.stopChannels()
                dispatchGameHistoryAction(_)
                showGame()
            }),
            O.getOrElse(() => notify("Couldn't restore save"))
        )

    const quickLoad = () => {
        pipe(
            quickSave(),
            O.map(loadSave)
        )
    }

    const skip = () => {
        pipe(
            currentNode(),
            O.map(currentNode => {
                if (!(currentNode instanceof Menu)) {
                    pipe(
                        skipFromNode(currentNode),
                        O.map(_ => {
                            _.map(addBlock)
                        }),
                        O.getOrElse(showMainMenu)
                    )
                }
            })
        )
    }

    return {
        present,
        empty,
        addBlock,
        undo,
        redo,
        currentNode,
        noPast,
        noFuture,
        historyFromState,
        loadSave,
        quickLoad,
        skip
    }
}
export default useHistory

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

const skipFromNode = (node: AstNode): O.Option<AstNode[][]> =>
    pipe(
        node.followingBlock(),
        O.chain(block =>
            pipe(
                A.last(block),
                O.map(skipRec([block]))
            )
        )
    )

const skipRec = (
    acc: AstNode[][]
): ((node: AstNode) => AstNode[][]) => node => {
    if (node instanceof Menu) return acc
    return pipe(
        node.followingBlock(),
        O.fold(
            () => acc,
            block => {
                const newAcc = [...acc, block]
                return pipe(
                    A.last(block),
                    O.map(skipRec(newAcc)),
                    O.getOrElse(() => newAcc)
                )
            }
        )
    )
}
