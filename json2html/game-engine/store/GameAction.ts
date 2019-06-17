import AstNode from '../nodes/AstNode';
import GameProps from './GameProps';

export interface AddBlockAction {
    type: 'ADD_BLOCK';
    block: AstNode[];
}

export interface SetPastAction {
    type: 'SET_PAST';
    past: Array<[GameProps, AstNode[]]>;
}

export interface UndoAction {
    type: 'UNDO';
}

export interface RedoAction {
    type: 'REDO';
}

type GameAction = AddBlockAction | SetPastAction | UndoAction | RedoAction;
export default GameAction;
