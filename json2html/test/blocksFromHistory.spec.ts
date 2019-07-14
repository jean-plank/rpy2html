import { right } from 'fp-ts/lib/Either'
import { none, some } from 'fp-ts/lib/Option'
import { StrMap } from 'fp-ts/lib/StrMap'

import GameProps from '../game-engine/gameHistory/GameProps'
import statesFromHistory from '../game-engine/gameHistory/statesFromHistory'
import Image from '../game-engine/models/medias/Image'
import AstNode, { AppData } from '../game-engine/nodes/AstNode'
import Say from '../game-engine/nodes/Say'
import Scene from '../game-engine/nodes/Scene'
import Show from '../game-engine/nodes/Show'

describe(statesFromHistory, () => {
    const execThenExecNext = () => () => {}

    it('should return empty array for node without nexts', () => {
        const node = new Show('', [])
        expect(statesFromHistory(node, [])).toEqual(right([]))
    })

    it('should return block and props for one node', () => {
        const node = new Show('toto', [])

        const data = ({
            nodes: new StrMap({ '0': node }),
            images: new StrMap({ toto: new Image('toto', 'totoFile') })
        } as unknown) as AppData
        node.init({ id: '0', data, execThenExecNext })

        const props: GameProps = {
            ...GameProps.empty,
            charImgs: [new Image('toto', 'totoFile')]
        }
        const block: AstNode[] = [node]

        const got = statesFromHistory(node, ['0'])
        const expected = right([[props, block]])
        expect(got.toString()).toBe(expected.toString())
    })

    it('should return block and props for two non stopping nodes', () => {
        const node0 = new Show('toto', ['1'])
        const node1 = new Show('titi', [])

        const data = ({
            nodes: new StrMap({
                '0': node0,
                '1': node1
            }),
            images: new StrMap({
                toto: new Image('toto', 'fileToto'),
                titi: new Image('titi', 'fileTiti')
            })
        } as unknown) as AppData
        data.nodes.mapWithKey((id, node) =>
            node.init({ id, data, execThenExecNext })
        )

        const props: GameProps = {
            ...GameProps.empty,
            charImgs: [
                new Image('toto', 'fileToto'),
                new Image('titi', 'fileTiti')
            ]
        }
        const block: AstNode[] = [node0, node1]

        const got = statesFromHistory(node0, ['0', '1'])
        const expected = right([[props, block]])
        expect(got.toString()).toBe(expected.toString())
    })

    it('should return two blocks and props when one stopping nodes', () => {
        const node0 = new Scene('toto', ['1'])
        const node1 = new Show('toto', ['2'])
        const node2 = new Say(none, 'ouep', ['3'])
        const node3 = new Show('titi', [])

        const data = ({
            nodes: new StrMap({
                '0': node0,
                '1': node1,
                '2': node2,
                '3': node3
            }),
            images: new StrMap({
                toto: new Image('toto', 'fileToto'),
                titi: new Image('titi', 'fileTiti')
            })
        } as unknown) as AppData
        data.nodes.mapWithKey((id, node) =>
            node.init({ id, data, execThenExecNext })
        )

        const props1: GameProps = {
            ...GameProps.empty,
            sceneImg: some(new Image('toto', 'fileToto')),
            charImgs: [new Image('toto', 'fileToto')],
            textboxText: 'ouep'
        }
        const block1: AstNode[] = [node0, node1, node2]

        const loadedTiti = new Image('titi', 'fileTiti')
        loadedTiti.load()
        const props2: GameProps = {
            ...GameProps.empty,
            sceneImg: some(new Image('toto', 'fileToto')),
            charImgs: [new Image('toto', 'fileToto'), loadedTiti],
            textboxText: 'ouep'
        }
        const block2: AstNode[] = [node3]

        const got = statesFromHistory(node0, ['0', '1', '2', '3'])
        const expected = right([[props1, block1], [props2, block2]])
        expect(got.toString()).toBe(expected.toString())
    })

    it('should return multiple blocks', () => {
        const node0 = new Say(none, 'node 0', ['1'])
        const node1 = new Say(none, 'node 1', ['2'])
        const node2 = new Say(none, 'node 2', ['3'])
        const node3 = new Say(none, 'node 3', [])

        const data = ({
            nodes: new StrMap({
                '0': node0,
                '1': node1,
                '2': node2,
                '3': node3
            })
        } as unknown) as AppData
        data.nodes.mapWithKey((id, node) =>
            node.init({ id, data, execThenExecNext })
        )

        const props0: GameProps = {
            ...GameProps.empty,
            textboxText: 'node 0'
        }

        const props1: GameProps = {
            ...GameProps.empty,
            textboxText: 'node 1'
        }

        const props2: GameProps = {
            ...GameProps.empty,
            textboxText: 'node 2'
        }

        const props3: GameProps = {
            ...GameProps.empty,
            textboxText: 'node 3'
        }

        const got = statesFromHistory(node0, ['0', '1', '2', '3'])
        const expected = right([
            [props0, [node0]],
            [props1, [node1]],
            [props2, [node2]],
            [props3, [node3]]
        ])
        expect(got.toString()).toBe(expected.toString())
    })
})
