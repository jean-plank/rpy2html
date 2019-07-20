import { GameHistoryState } from '../history/gameHistoryReducer'
import historyFromState from '../history/historyFromState'
import { SavesAction } from './savesReducer'

const saveAction = (state: GameHistoryState, slot?: number): SavesAction => {
    const history = historyFromState(state)
    if (slot === undefined) return { type: 'QUICK_SAVE', history }
    return { type: 'SAVE', history, slot }
}
export default saveAction
