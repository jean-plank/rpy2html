import { Reducer } from 'react';

import AstNode from '../nodes/AstNode';
import GameProps from './GameProps';

export type GameState = [GameProps, AstNode[]];
export const emptyGameState: GameState = [GameProps.empty, []];

export interface GameAction {
    type: 'ADD_BLOCK';
    block: AstNode[];
}

const gameStateReducer: Reducer<GameState, GameAction> = (
    [prevProps],
    { block }
): GameState => {
    const cleanedProps = GameProps.cleaned(prevProps);
    const newProps = block.reduce<GameProps>(
        (props, node) => ({ ...props, ...node.reduce(props) }),
        cleanedProps
    );
    return [newProps, block];
};
export default gameStateReducer;
