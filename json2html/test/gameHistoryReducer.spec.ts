import { none, some } from 'fp-ts/lib/Option';
import { StrMap } from 'fp-ts/lib/StrMap';

import gameHistoryReducer, {
    emptyGameHistoryState
} from '../game-engine/gameHistory/gameHistoryReducer';
import GameProps from '../game-engine/gameHistory/GameProps';
import { GameState } from '../game-engine/gameHistory/gameStateReducer';
import { HistoryState } from '../game-engine/gameHistory/historiable';
import Image from '../game-engine/models/Image';
import Sound from '../game-engine/models/medias/Sound';
import AstNode, { AppData } from '../game-engine/nodes/AstNode';
import Play from '../game-engine/nodes/Play';
import Show from '../game-engine/nodes/Show';

describe(gameHistoryReducer, () => {
    const execThenExecNext = () => () => {};

    it('should empty', () => {
        const empty = gameHistoryReducer({} as HistoryState<GameState>, {
            type: 'EMPTY'
        });
        expect(empty).toEqual({
            past: [],
            present: none,
            future: []
        });
    });

    const data = {
        sounds: new StrMap({
            music1: new Sound('fmusic1'),
            sound1: new Sound('fsound1')
        }),
        images: new StrMap({
            toto: new Image('ftoto'),
            titi: new Image('ftiti')
        })
    } as AppData;
    const node1 = new Play('music', 'music1');
    const node2 = new Play('sound', 'sound1');
    const node3 = new Show('toto');
    const node4 = new Show('titi');
    const block1: AstNode[] = [node1, node2];
    const block2: AstNode[] = [node3, node4];
    [block1, block2].map(_ =>
        _.map(_ => _.init({ id: '', data, execThenExecNext }))
    );

    const block1Props = {
        ...GameProps.empty,
        sounds: new StrMap({
            music: some(new Sound('fmusic1')),
            sound: some(new Sound('fsound1'))
        })
    };
    const block2Props = {
        ...GameProps.empty,
        charImgs: [new Image('ftoto'), new Image('ftiti')],
        sounds: new StrMap({
            music: some(new Sound('fmusic1')),
            sound: none
        })
    };

    it('should have one block', () => {
        const state = gameHistoryReducer(emptyGameHistoryState, {
            type: 'ADD_BLOCK',
            block: block1
        });
        expect(state.toString()).toBe(
            {
                past: [],
                present: some([block1Props, block1]),
                future: []
            }.toString()
        );
    });

    it('should have two blocks', () => {
        const state = gameHistoryReducer(
            gameHistoryReducer(emptyGameHistoryState, {
                type: 'ADD_BLOCK',
                block: block1
            }),
            {
                type: 'ADD_BLOCK',
                block: block2
            }
        );

        expect(state.toString()).toEqual(
            {
                past: [[block1Props, block1]],
                present: some([block2Props, block2]),
                future: []
            }.toString()
        );
    });

    it('should undo', () => {
        const state = gameHistoryReducer(
            gameHistoryReducer(
                gameHistoryReducer(emptyGameHistoryState, {
                    type: 'ADD_BLOCK',
                    block: block1
                }),
                {
                    type: 'ADD_BLOCK',
                    block: block2
                }
            ),
            { type: 'UNDO' }
        );

        expect(state.toString()).toEqual(
            {
                past: [],
                present: some([block1Props, block1]),
                future: [[block2Props, block2]]
            }.toString()
        );
    });

    it('should redo', () => {
        const state = gameHistoryReducer(
            gameHistoryReducer(
                gameHistoryReducer(
                    gameHistoryReducer(emptyGameHistoryState, {
                        type: 'ADD_BLOCK',
                        block: block1
                    }),
                    {
                        type: 'ADD_BLOCK',
                        block: block2
                    }
                ),
                { type: 'UNDO' }
            ),
            { type: 'REDO' }
        );

        expect(state.toString()).toEqual(
            {
                past: [[block1Props, block1]],
                present: some([block2Props, block2]),
                future: []
            }.toString()
        );
    });
});
