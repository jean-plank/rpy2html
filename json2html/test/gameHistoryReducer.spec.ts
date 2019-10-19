import * as O from 'fp-ts/lib/Option'

import gameHistoryReducer, {
    emptyGameHistoryState
} from '../weeb-engine/history/gameHistoryReducer'
import GameProps from '../weeb-engine/history/GameProps'
import { GameState } from '../weeb-engine/history/gameStateReducer'
import { HistoryState } from '../weeb-engine/history/historiable'
import Image from '../weeb-engine/medias/Image'
import Sound from '../weeb-engine/medias/Sound'
import AstNode, { AppData } from '../weeb-engine/nodes/AstNode'
import Play from '../weeb-engine/nodes/Play'
import Show from '../weeb-engine/nodes/Show'

describe(gameHistoryReducer, () => {
    it('should empty', () => {
        const empty = gameHistoryReducer({} as HistoryState<GameState>, {
            type: 'EMPTY'
        })
        expect(empty).toEqual({
            past: [],
            present: O.none,
            future: []
        })
    })

    const data = ({
        sounds: {
            music1: new Sound('music1', 'fileMusic1'),
            sound1: new Sound('sound1', 'fileSound1')
        },
        images: {
            toto: new Image('toto', 'fileToto'),
            titi: new Image('titi', 'fileTiti')
        }
    } as unknown) as AppData
    const node1 = new Play('music', 'music1', [])
    const node2 = new Play('sound', 'sound1', [])
    const node3 = new Show('toto', [])
    const node4 = new Show('titi', [])
    const block1: AstNode[] = [node1, node2]
    const block2: AstNode[] = [node3, node4];
    [block1, block2].map(_ => _.map(_ => _.init({ id: '', data })))

    const block1Props = {
        ...GameProps.empty,
        sounds: {
            music: O.some(new Sound('music1', 'fileMusic1')),
            sound: O.some(new Sound('sound1', 'fileSound1'))
        }
    }
    const block2Props = {
        ...GameProps.empty,
        charImgs: [
            new Image('toto', 'fileToto'),
            new Image('titi', 'fileTiti')
        ],
        sounds: {
            music: O.some(new Sound('music1', 'fileMusic1')),
            sound: O.none
        }
    }

    it('should have one block', () => {
        const state = gameHistoryReducer(emptyGameHistoryState, {
            type: 'ADD_BLOCK',
            block: block1
        })
        expect(state.toString()).toBe(
            {
                past: [],
                present: O.some([block1Props, block1]),
                future: []
            }.toString()
        )
    })

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
        )

        expect(state.toString()).toEqual(
            {
                past: [[block1Props, block1]],
                present: O.some([block2Props, block2]),
                future: []
            }.toString()
        )
    })

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
        )

        expect(state.toString()).toEqual(
            {
                past: [],
                present: O.some([block1Props, block1]),
                future: [[block2Props, block2]]
            }.toString()
        )
    })

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
        )

        expect(state.toString()).toEqual(
            {
                past: [[block1Props, block1]],
                present: O.some([block2Props, block2]),
                future: []
            }.toString()
        )
    })
})
