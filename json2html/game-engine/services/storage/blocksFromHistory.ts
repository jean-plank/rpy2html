import { findFirst, head, isEmpty } from 'fp-ts/lib/Array';
import { Either, left, right } from 'fp-ts/lib/Either';
import { lookup, StrMap } from 'fp-ts/lib/StrMap';

import AstNode from '../../nodes/AstNode';
import GameProps from '../../store/GameProps';

type EitherArray = Either<string, Array<[GameProps, AstNode[]]>>;

const blocksFromHistory = (
    nodes: StrMap<AstNode>,
    firstNode: AstNode,
    history: string[]
): EitherArray => {
    if (isEmpty(history)) return right([]);
    return blocksFromHistRec(
        nodes,
        [firstNode],
        history,
        GameProps.empty,
        [],
        false,
        []
    );
};
export default blocksFromHistory;

const blocksFromHistRec = (
    nodes: StrMap<AstNode>,
    nexts: AstNode[],
    history: string[],
    currentProps: GameProps,
    currentBlock: AstNode[],
    previousWasStopping: boolean,
    acc: Array<[GameProps, AstNode[]]>
): EitherArray => {
    const historyHead = head(history);

    if (historyHead.isNone()) {
        return right(
            previousWasStopping ? acc : [...acc, [currentProps, currentBlock]]
        );
    }

    return lookup(historyHead.value, nodes)
        .filter(existsIn(nexts))
        .map(addNode)
        .getOrElse(left(`Could\'nt find node with id "${historyHead.value}"`));

    function addNode(currentNode: AstNode): EitherArray {
        const [, ...newHistory] = history;
        const newProps: GameProps = {
            ...currentProps,
            ...currentNode.reduce(currentProps)
        };
        const newBlock: AstNode[] = [...currentBlock, currentNode];

        if (currentNode.stopExecution) {
            return blocksFromHistRec(
                nodes,
                currentNode.nexts(),
                newHistory,
                GameProps.cleaned(newProps),
                [],
                true,
                [...acc, [newProps, newBlock]]
            );
        }

        return blocksFromHistRec(
            nodes,
            currentNode.nexts(),
            newHistory,
            newProps,
            newBlock,
            false,
            acc
        );
    }
};

const existsIn = (nexts: AstNode[]) => (node: AstNode): boolean =>
    findFirst(nexts, _ => _ === node).isSome();
