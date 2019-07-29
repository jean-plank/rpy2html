import * as A from 'fp-ts/lib/Array'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import { Reducer } from 'react'

import { lang } from '../context'
import AstNode from '../nodes/AstNode'
import QuickSave from './QuickSave'
import Save from './Save'
import Saves from './Saves'

interface QuickSaveAction {
    type: 'QUICK_SAVE'
    history: AstNode[]
}

interface SaveAction {
    type: 'SAVE'
    history: AstNode[]
    slot: number
}

interface DeleteAction {
    type: 'DELETE'
    slot: number
}

export type SavesAction = QuickSaveAction | SaveAction | DeleteAction | 'EMPTY'

const savesReducer: Reducer<Saves, SavesAction> = (prevState, action) => {
    if (action === 'EMPTY') return Saves.empty

    if (action.type === 'QUICK_SAVE') {
        const newState = {
            ...prevState,
            quickSave: O.some(QuickSave.fromNodes(action.history))
        }
        Saves.store(newState)
        return newState
    }

    if (action.type === 'SAVE') {
        const date = new Date().toLocaleDateString(lang, {
            day: 'numeric',
            month: 'short',
            weekday: 'short',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        })
        return updateSlot(
            prevState,
            action.slot,
            O.some(Save.fromNodes(action.history, date))
        )
    }

    if (action.type === 'DELETE') {
        return updateSlot(prevState, action.slot, O.none)
    }

    return prevState
}
export default savesReducer

const updateSlot = (
    prevState: Saves,
    slot: number,
    newValue: O.Option<Save>
): Saves =>
    pipe(
        A.updateAt(slot, newValue)(prevState.slots),
        O.map(slots => {
            const newState = {
                ...prevState,
                slots
            }
            Saves.store(newState)
            return newState
        }),
        O.getOrElse(() => prevState)
    )
