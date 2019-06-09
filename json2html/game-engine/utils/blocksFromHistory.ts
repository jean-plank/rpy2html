import { head } from 'fp-ts/lib/Array';
import { none, Option, some } from 'fp-ts/lib/Option';

import AstNode from '../nodes/AstNode';
import Block from '../nodes/Block';
import GameProps from '../store/GameProps';

const blocksFromHistory = (
    history: string[],
    nexts: Block
): Option<Array<[Block, GameProps]>> =>
    blocksFromHistRec(history, nexts, [[], GameProps.empty], []);
export default blocksFromHistory;

const blocksFromHistRec = (
    history: string[],
    nexts: Block,
    current: [Block, GameProps],
    acc: Array<[Block, GameProps]>
): Option<Array<[Block, GameProps]>> => {
    const firstNode = head(history);

    if (firstNode.isNone()) return some(acc);

    const realNexts = nexts.filter(node =>
        firstNode.exists(_ => _ === node.toString())
    );

    if (realNexts.length === 1) {
        return blocksFromNext(realNexts[0], history, current, acc);
    }

    if (realNexts.length === 0) {
        console.error(
            `Error while restoring save: couldn't find node "${firstNode}"`
        );
        return none;
    }

    console.error(
        `Error while restoring save: find several matching nodes for "${firstNode}":\n`,
        realNexts
    );
    return none;
};

const blocksFromNext = (
    next: AstNode,
    history: string[],
    [currentNodes, currentProps]: [Block, GameProps],
    acc: Array<[Block, GameProps]>
): Option<Array<[Block, GameProps]>> => {
    const [, ...newHistory] = history;
    const props = { ...currentProps, ...next.reduce(currentProps) };
    if (next.stopExecution) {
        return blocksFromHistRec(
            newHistory,
            next.nexts(),
            [[], GameProps.cleaned(props)],
            acc.concat([currentNodes.concat(next), props])
        );
    } else {
        return blocksFromHistRec(
            newHistory,
            next.nexts(),
            [currentNodes.concat(next), props],
            acc
        );
    }
};
