import Block from '../nodes/Block';

export interface AddBlockAction {
    type: 'ADD_BLOCK';
    block: Block;
}

export interface UndoAction {
    type: 'UNDO';
}

export interface RedoAction {
    type: 'REDO';
}

type GameAction = AddBlockAction | UndoAction | RedoAction;
export default GameAction;
