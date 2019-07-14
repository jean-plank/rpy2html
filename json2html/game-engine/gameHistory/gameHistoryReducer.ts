import gameStateReducer, {
    emptyGameState,
    GameAction,
    GameState
} from './gameStateReducer'
import historiable, { HistoryAction, HistoryState } from './historiable'

export type GameHistoryState = HistoryState<GameState>
export const emptyGameHistoryState: GameHistoryState = HistoryState.empty()

export type GameHistoryAction = HistoryAction<GameState> | GameAction

const gameHistoryReducer = historiable<GameState, GameAction>(
    emptyGameState,
    gameStateReducer
)
export default gameHistoryReducer
