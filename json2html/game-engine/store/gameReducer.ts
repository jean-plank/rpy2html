import { head, init, last, tail } from 'fp-ts/lib/Array';
import { none, Option, some } from 'fp-ts/lib/Option';
import { Reducer } from 'redux';

import AstNode from '../nodes/AstNode';
import GameAction, {
    AddBlockAction,
    RedoAction,
    UndoAction
} from './GameAction';
import GameProps from './GameProps';
import isAddBlockAction from './isAddBlockAction';

export interface GameState {
    past: Array<[GameProps, AstNode[]]>;
    present: Option<[GameProps, AstNode[]]>;
    future: Array<[GameProps, AstNode[]]>;
}

const gameReducer: Reducer<GameState, GameAction> = (
    state: GameState | undefined,
    action: GameAction
): GameState => {
    if (action.type === 'SET_PAST') {
        return {
            past: init(action.past).getOrElse([]),
            present: last(action.past),
            future: []
        };
    }

    if (state === undefined) {
        return {
            past: [],
            present: none,
            future: []
        };
    }
    const { past, present, future } = state;

    if (present.isSome()) {
        return reduceSomePresent(state, past, present.value, future, action);
    }

    return {
        past: [],
        present: some(gamePropsReducer(undefined, action)),
        future: []
    };
};
export default gameReducer;

const reduceSomePresent = (
    state: GameState,
    past: Array<[GameProps, AstNode[]]>,
    present: [GameProps, AstNode[]],
    future: Array<[GameProps, AstNode[]]>,
    action: UndoAction | RedoAction | AddBlockAction
): GameState => {
    switch (action.type) {
        case 'UNDO':
            return last(past)
                .chain(previous =>
                    init(past).map(newPast => ({
                        past: newPast,
                        present: some(previous),
                        future: [present, ...future]
                    }))
                )
                .getOrElse(state);
        case 'REDO':
            return head(future)
                .chain(next =>
                    tail(future).map(newFuture => ({
                        past: [...past, present],
                        present: some(next),
                        future: newFuture
                    }))
                )
                .getOrElse(state);
        case 'ADD_BLOCK':
            const newPresent = gamePropsReducer(present, action);
            if (present === newPresent) return state;
            return {
                past: [...past, present],
                present: some(newPresent),
                future: []
            };
    }
};

const gamePropsReducer: Reducer<[GameProps, AstNode[]], GameAction> = (
    state: [GameProps, AstNode[]] | undefined,
    action: GameAction
): [GameProps, AstNode[]] => {
    if (!isAddBlockAction(action)) {
        return [GameProps.empty, []];
    }

    const [props] = state === undefined ? [GameProps.empty, []] : state;
    const cleanedProps = GameProps.cleaned(props);
    // const currentNode = last(previousBlock);

    const newProps = action.block.reduce<GameProps>((props, node) => {
        // const maybeCleanedUp = previousNode
        //     .map(_ => _.cleanup(props))
        //     .getOrElse(props);
        return { ...props, ...node.reduce(props) };
    }, cleanedProps);
    return [newProps, action.block];
};
