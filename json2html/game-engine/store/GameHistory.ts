import { isEmpty, last } from 'fp-ts/lib/Array';
import { Option } from 'fp-ts/lib/Option';
import { createStore, Store } from 'redux';

import AstNode from '../nodes/AstNode';
import Block from '../nodes/Block';
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

    nodes = (): Block => {
        const { past, present } = this.state();
        const res = past.reduce<Block>((acc, [, _]) => acc.concat(_), []);
        return present.map(([, _]) => res.concat(_)).getOrElse(res);
    }

    nothingToUndo = (): boolean => isEmpty(this.state().past);

    nothingToRedo = (): boolean => isEmpty(this.state().future);

    subscribe = (listener: (gameProps: GameProps) => void) =>
        this.store.subscribe(() => this.props().map(_ => listener(_)))

    addBlock = (block: Block) =>
        this.store.dispatch({ type: 'ADD_BLOCK', block })

    undo = () => this.store.dispatch({ type: 'UNDO' });

    redo = () => this.store.dispatch({ type: 'REDO' });
}
