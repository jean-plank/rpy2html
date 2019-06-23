import { Do } from 'fp-ts-contrib/lib/Do';
import { init, last } from 'fp-ts/lib/Array';
import { fromEither, Option, option } from 'fp-ts/lib/Option';

import { GameHistoryState } from '../gameHistory/gameHistoryReducer';
import { GameState } from '../gameHistory/gameStateReducer';
import { HistoryAction } from '../gameHistory/historiable';
import statesFromHistory from '../gameHistory/statesFromHistory';
import AstNode from '../nodes/AstNode';
import QuickSave from '../storage/QuickSave';
import { SavesAction } from '../storage/savesReducer';

export const loadAction = (
    firstNode: AstNode,
    save: QuickSave
): Option<HistoryAction<GameState>> =>
    Do(option)
        .bindL('newPast', () =>
            fromEither(
                statesFromHistory(firstNode, save.history).mapLeft(_ =>
                    console.error('Error while loading save:', _)
                )
            )
        )
        .bindL('present', ({ newPast }) => last(newPast))
        .return(({ newPast, present }) => ({
            type: 'RESET',
            past: init(newPast).getOrElse([]),
            present
        }));

export const saveAction = (
    state: GameHistoryState,
    slot?: number
): SavesAction => {
    const history = historyFromState(state);
    if (slot === undefined) return { type: 'QUICK_SAVE', history };
    return { type: 'SAVE', history, slot };
};

export const historyFromState = ({
    past,
    present
}: GameHistoryState): AstNode[] => {
    const res = past.reduce<AstNode[]>((acc, [, _]) => [...acc, ..._], []);
    return present.map(([, _]) => [...res, ..._]).getOrElse(res);
};
