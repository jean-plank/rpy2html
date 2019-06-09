import { none, some } from 'fp-ts/lib/Option';
import { StrMap } from 'fp-ts/lib/StrMap';

import AppData from '../game-engine/app/AppData';
import Image from '../game-engine/models/medias/Image';
import Sound from '../game-engine/models/medias/Sound';
import Block from '../game-engine/nodes/Block';
import Play from '../game-engine/nodes/Play';
import Show from '../game-engine/nodes/Show';
import GameHistory from '../game-engine/store/GameHistory';
import GameProps from '../game-engine/store/GameProps';
import isAddBlockAction from '../game-engine/store/isAddBlockAction';

describe(isAddBlockAction, () => {
    it('should check if object is AddBlockAction', () => {
        expect(
            isAddBlockAction({
                type: 'ADD_BLOCK',
                block: []
            })
        ).toBe(true);
    });
});

describe(GameHistory, () => {
    const execThenExecNext = () => () => {};

    it('should construct and be empty', () => {
        const history = new GameHistory();
        expect(history.state()).toEqual({
            past: [],
            present: none,
            future: []
        });
    });

    const data = ({
        sounds: new StrMap({
            music1: new Sound('fmusic1'),
            sound1: new Sound('fsound1')
        }),
        images: new StrMap({
            toto: new Image('ftoto'),
            titi: new Image('ftiti')
        })
    } as unknown) as AppData;
    const node1 = new Play('music', 'music1');
    const node2 = new Play('sound', 'sound1');
    const node3 = new Show('toto');
    const node4 = new Show('titi');
    const block1: Block = [node1, node2];
    const block2: Block = [node3, node4];
    [block1, block2].map(_ => _.map(_ => _.init({ data, execThenExecNext })));

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
        const history = new GameHistory();
        history.addBlock(block1);

        expect(history.state().toString()).toBe(
            {
                past: [],
                present: some([block1Props, block1]),
                future: []
            }.toString()
        );
    });

    it('should have two blocks', () => {
        const history = new GameHistory();
        history.addBlock(block1);
        history.addBlock(block2);

        expect(history.state().toString()).toEqual(
            {
                past: [[block1Props, block1]],
                present: some([block2Props, block2]),
                future: []
            }.toString()
        );
    });

    it('should undo', () => {
        const history = new GameHistory();
        history.addBlock(block1);
        history.addBlock(block2);
        history.undo();

        expect(history.state().toString()).toEqual(
            {
                past: [],
                present: some([block1Props, block1]),
                future: [[block2Props, block2]]
            }.toString()
        );
    });

    it('should redo', () => {
        const history = new GameHistory();
        history.addBlock(block1);
        history.addBlock(block2);
        history.undo();
        history.redo();

        expect(history.state().toString()).toEqual(
            {
                past: [[block1Props, block1]],
                present: some([block2Props, block2]),
                future: []
            }.toString()
        );
    });
});
