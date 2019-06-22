import { none } from 'fp-ts/lib/Option';
import { StrMap } from 'fp-ts/lib/StrMap';

import Image from '../game-engine/models/medias/Image';
import { AppData } from '../game-engine/nodes/AstNode';
import Say from '../game-engine/nodes/Say';
import Show from '../game-engine/nodes/Show';

describe('AstNode.followingBlock', () => {
    const execThenExecNext = () => () => {};

    it('should return empty array for node without nexts', () => {
        const node = new Show('');
        expect(node.followingBlock()).toEqual([]);
    });

    it('should return nodes until stopping node', () => {
        const node = new Show('toto', { idNexts: ['node1'] });
        const node1 = new Show('toto', { idNexts: ['node2'] });
        const node2 = new Say(none, '', { idNexts: ['node3'] });
        const node3 = new Show('toto');

        const data = ({
            nodes: new StrMap({ node1, node2, node3 }),
            images: new StrMap({ toto: new Image('toto') })
        } as unknown) as AppData;
        [node, node1, node2, node3].map(_ =>
            _.init({ id: '', data, execThenExecNext })
        );

        expect(node.followingBlock()).toEqual([node1, node2]);
    });

    it('should return nodes until end', () => {
        const node = new Show('toto', { idNexts: ['node1'] });
        const node1 = new Show('toto');

        const data = ({
            nodes: new StrMap({ node1 }),
            images: new StrMap({ toto: new Image('toto') })
        } as unknown) as AppData;
        [node, node1].map(_ => _.init({ id: '', data, execThenExecNext }));

        expect(node.followingBlock()).toEqual([node1]);
    });

    it('should throw when more than one next', () => {
        const node = new Show('toto', { idNexts: ['node1', 'node2'] });
        const node1 = new Show('toto');
        const node2 = new Show('toto');

        const data = ({
            nodes: new StrMap({ node1, node2 }),
            images: new StrMap({ toto: new Image('toto') })
        } as unknown) as AppData;
        [node, node1, node2].map(_ =>
            _.init({ id: '', data, execThenExecNext })
        );

        expect(() => node.followingBlock()).toThrow(
            EvalError('Node Show("toto") has more than one next node')
        );
    });
});
