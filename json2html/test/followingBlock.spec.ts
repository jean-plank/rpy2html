import * as O from 'fp-ts/lib/Option'

import Image from '../weeb-engine/medias/Image'
import { AppData } from '../weeb-engine/nodes/AstNode'
import Say from '../weeb-engine/nodes/Say'
import Show from '../weeb-engine/nodes/Show'

describe('AstNode.followingBlock', () => {
    it('should return none for node without nexts', () => {
        const node = new Show('', [])
        expect(node.followingBlock()).toEqual(O.none)
    })

    it('should return nodes until stopping node', () => {
        const node = new Show('toto', ['node1'])
        const node1 = new Show('toto', ['node2'])
        const node2 = new Say(O.none, '', ['node3'])
        const node3 = new Show('toto', [])

        const data = ({
            nodes: { node1, node2, node3 },
            images: { toto: new Image('toto', 'fileToto') }
        } as unknown) as AppData;
        [node, node1, node2, node3].map(_ => _.init({ id: '', data }))

        expect(node.followingBlock()).toEqual(O.some([node1, node2]))
    })

    it('should return nodes until end', () => {
        const node = new Show('toto', ['node1'])
        const node1 = new Show('toto', [])

        const data = ({
            nodes: { node1 },
            images: { toto: new Image('toto', 'fileToto') }
        } as unknown) as AppData;
        [node, node1].map(_ => _.init({ id: '', data }))

        expect(node.followingBlock()).toEqual(O.some([node1]))
    })

    it('should throw when more than one next', () => {
        const node = new Show('toto', ['node1', 'node2'])
        const node1 = new Show('toto', [])
        const node2 = new Show('toto', [])

        const data = ({
            nodes: { node1, node2 },
            images: { toto: new Image('toto', 'fileToto') }
        } as unknown) as AppData;
        [node, node1, node2].map(_ => _.init({ id: '', data }))

        expect(() => node.followingBlock()).toThrow(
            EvalError('Node Show("toto") has more than one next node')
        )
    })
})
