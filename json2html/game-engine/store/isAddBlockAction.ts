import * as t from 'io-ts';

import GameAction, { AddBlockAction } from './GameAction';

const addBlockType = t.exact(
    t.type({
        type: t.literal('ADD_BLOCK')
    })
);

const isAddBlockAction = (action: GameAction): action is AddBlockAction => {
    return addBlockType.decode(action).isRight();
};
export default isAddBlockAction;
