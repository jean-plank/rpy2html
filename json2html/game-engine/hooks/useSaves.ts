import * as O from 'fp-ts/lib/Option'
import { useReducer } from 'react'

import { transl } from '../context'
import GameProps from '../history/GameProps'
import { HistoryState } from '../history/historiable'
import AstNode from '../nodes/AstNode'
import saveAction from '../saves/saveAction'
import Saves from '../saves/Saves'
import savesReducer from '../saves/savesReducer'

export interface SavesHook {
    saves: Saves
    emptySaves: () => void
    deleteSave: (slot: number) => void
    save: (slot: number) => void
    quickSave: () => void
    noQuickSave: boolean
}

const useSaves = (
    gameState: HistoryState<[GameProps, AstNode[]]>,
    notify: (message: string) => void
): SavesHook => {
    const [saves, dispatchSavesAction] = useReducer(
        savesReducer,
        Saves.fromStorage()
    )

    const emptySaves = () => dispatchSavesAction('EMPTY')

    const deleteSave = (slot: number) => {
        console.warn(
            `Save slot ${slot} was deleted because it couldn't be restored.`
        )
        dispatchSavesAction({ type: 'DELETE', slot })
    }

    const save = (slot: number) =>
        dispatchSavesAction(saveAction(gameState, slot))

    const quickSave = () => {
        dispatchSavesAction(saveAction(gameState))
        notify(transl.armless.saved)
    }

    const noQuickSave = O.isNone(saves.quickSave)

    return { saves, emptySaves, deleteSave, save, quickSave, noQuickSave }
}
export default useSaves
