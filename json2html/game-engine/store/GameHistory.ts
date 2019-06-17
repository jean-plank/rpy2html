import { isEmpty, last } from 'fp-ts/lib/Array';
import { Option } from 'fp-ts/lib/Option';
import { createStore, Store } from 'redux';

import AstNode from '../nodes/AstNode';
import GameAction from './GameAction';
import GameProps from './GameProps';
import gameReducer, { GameState } from './gameReducer';

export default class GameHistory {
    private store: Store<GameState, GameAction>;

    constructor() {
        this.store = createStore(gameReducer);
    }

    state = (): GameState => this.store.getState();

    props = (): Option<GameProps> => this.state().present.map(([_]) => _);

    currentNode = (): Option<AstNode> =>
        this.state().present.chain(([, _]) => last(_))

    nodes = (): AstNode[] => {
        const { past, present } = this.state();
        const res = past.reduce<AstNode[]>((acc, [, _]) => [...acc, ..._], []);
        return present.map(([, _]) => [...res, ..._]).getOrElse(res);
    }

    nothingToUndo = (): boolean => isEmpty(this.state().past);

    nothingToRedo = (): boolean => isEmpty(this.state().future);

    subscribe = (listener: (gameProps: GameProps) => void) =>
        this.store.subscribe(() => this.props().map(_ => listener(_)))

    addBlock = (block: AstNode[]) =>
        this.store.dispatch({ type: 'ADD_BLOCK', block })

    setPast = (past: Array<[GameProps, AstNode[]]>) =>
        this.store.dispatch({ type: 'SET_PAST', past })

    undo = () => this.store.dispatch({ type: 'UNDO' });

    redo = () => this.store.dispatch({ type: 'REDO' });
}
