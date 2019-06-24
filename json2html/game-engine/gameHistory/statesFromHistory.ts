import { findFirstMap, head, isEmpty } from 'fp-ts/lib/Array';
import { Either, left, right } from 'fp-ts/lib/Either';
import { none, some } from 'fp-ts/lib/Option';

import AstNode from '../nodes/AstNode';
import GameProps from './GameProps';
import { GameState } from './gameStateReducer';

const statesFromHistory = (
    firstNode: AstNode,
    history: string[]
): Either<string, GameState[]> => {
    if (isEmpty(history)) return right([]);
    return statesFromHistRec(
        [firstNode],
        history,
        GameProps.empty,
        [],
        false,
        []
    );
};
export default statesFromHistory;

const statesFromHistRec = (
    nexts: AstNode[],
    history: string[],
    currentProps: GameProps,
    currentBlock: AstNode[],
    previousWasStopping: boolean,
    acc: Array<[GameProps, AstNode[]]>
): Either<string, GameState[]> => {
    const maybeId = head(history);

    if (maybeId.isNone()) {
        return right(
            previousWasStopping ? acc : [...acc, [currentProps, currentBlock]]
        );
    }
    const id = maybeId.value;

    return findFirstMap(nexts, next =>
        next.id === id ? some(addNode(next)) : none
    ).getOrElse(left(`Could\'nt find node with id "${id}"`));

    function addNode(currentNode: AstNode): Either<string, GameState[]> {
        const [, ...newHistory] = history;
        const newProps: GameProps = {
            ...currentProps,
            ...currentNode.reduce(currentProps)
        };
        const newBlock: AstNode[] = [...currentBlock, currentNode];

        if (currentNode.stopExecution) {
            return statesFromHistRec(
                currentNode.nexts(),
                newHistory,
                GameProps.cleaned(newProps),
                [],
                true,
                [...acc, [newProps, newBlock]]
            );
        }

        return statesFromHistRec(
            currentNode.nexts(),
            newHistory,
            newProps,
            newBlock,
            false,
            acc
        );
    }
};
