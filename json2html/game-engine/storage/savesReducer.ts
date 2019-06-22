import { updateAt } from 'fp-ts/lib/Array';
import { some } from 'fp-ts/lib/Option';
import { Reducer } from 'react';

import { lang } from '../context';
import AstNode from '../nodes/AstNode';
import QuickSave from './QuickSave';
import Save from './Save';
import Saves from './Saves';

interface QuickSaveAction {
    type: 'QUICK_SAVE';
    history: AstNode[];
}

interface SaveAction {
    type: 'SAVE';
    history: AstNode[];
    slot: number;
}

export type SavesAction = QuickSaveAction | SaveAction | 'EMPTY';

const savesReducer: Reducer<Saves, SavesAction> = (prevState, action) => {
    if (action === 'EMPTY') return Saves.empty;

    if (action.type === 'QUICK_SAVE') {
        const newState = {
            ...prevState,
            quickSave: some(QuickSave.fromNodes(action.history))
        };
        Saves.store(newState);
        return newState;
    }

    if (action.type === 'SAVE') {
        const date = new Date().toLocaleDateString(lang, {
            day: 'numeric',
            month: 'short',
            weekday: 'short',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });
        return updateAt(
            action.slot,
            some(Save.fromNodes(action.history, date)),
            prevState.slots
        )
            .map(slots => {
                const newState = {
                    ...prevState,
                    slots
                };
                Saves.store(newState);
                return newState;
            })
            .getOrElse(prevState);
    }

    return prevState;
};
export default savesReducer;
