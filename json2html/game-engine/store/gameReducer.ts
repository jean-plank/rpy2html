import { head, init, last, tail } from 'fp-ts/lib/Array';
import { none, Option, some } from 'fp-ts/lib/Option';
import { Reducer } from 'redux';

import Block from '../nodes/Block';
import GameAction from './GameAction';
import GameProps from './GameProps';
import isAddBlockAction from './isAddBlockAction';

export interface GameState {
    past: Array<[GameProps, Block]>;
    present: Option<[GameProps, Block]>;
    future: Array<[GameProps, Block]>;
}

const gameReducer: Reducer<GameState, GameAction> = (
    state: GameState | undefined,
    action: GameAction
): GameState => {
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
    past: Array<[GameProps, Block]>,
    present: [GameProps, Block],
    future: Array<[GameProps, Block]>,
    action: GameAction
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
        default:
            const newPresent = gamePropsReducer(present, action);
            if (present === newPresent) return state;
            return {
                past: [...past, present],
                present: some(newPresent),
                future: []
            };
    }
};

const gamePropsReducer: Reducer<[GameProps, Block], GameAction> = (
    state: [GameProps, Block] | undefined,
    action: GameAction
): [GameProps, Block] => {
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
