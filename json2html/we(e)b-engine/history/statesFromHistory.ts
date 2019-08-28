import * as A from 'fp-ts/lib/Array'
import * as E from 'fp-ts/lib/Either'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'

import AstNode from '../nodes/AstNode'
import GameProps from './GameProps'
import { GameState } from './gameStateReducer'

const statesFromHistory = (
    firstNode: AstNode,
    history: string[]
): E.Either<string, GameState[]> => {
    if (A.isEmpty(history)) return E.right([])
    return statesFromHistRec(
        [firstNode],
        history,
        GameProps.empty,
        [],
        false,
        []
    )
}
export default statesFromHistory

const statesFromHistRec = (
    nexts: AstNode[],
    history: string[],
    currentProps: GameProps,
    currentBlock: AstNode[],
    previousWasStopping: boolean,
    acc: GameState[]
): E.Either<string, GameState[]> => {
    const maybeId = A.head(history)

    if (O.isNone(maybeId)) {
        return E.right(
            previousWasStopping ? acc : [...acc, [currentProps, currentBlock]]
        )
    }
    const id = maybeId.value

    return pipe(
        A.findFirstMap((next: AstNode) =>
            next.id === id ? O.some(addNode(next)) : O.none
        )(nexts),
        O.getOrElse(() => E.left(`Could\'nt find node with id "${id}"`))
    )

    function addNode(currentNode: AstNode): E.Either<string, GameState[]> {
        const [, ...newHistory] = history
        const newProps: GameProps = currentNode.reduce(currentProps)
        const newBlock: AstNode[] = [...currentBlock, currentNode]

        if (currentNode.stopExecution) {
            return statesFromHistRec(
                currentNode.nexts(),
                newHistory,
                GameProps.cleaned(newProps),
                [],
                true,
                [...acc, [newProps, newBlock]]
            )
        }

        return statesFromHistRec(
            currentNode.nexts(),
            newHistory,
            newProps,
            newBlock,
            false,
            acc
        )
    }
}
