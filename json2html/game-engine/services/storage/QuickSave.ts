import { Either } from 'fp-ts/lib/Either';
import * as t from 'io-ts';

import AstNode from '../../nodes/AstNode';
import GameProps from '../../store/GameProps';
import blocksFromHistory from './blocksFromHistory';

export default class QuickSave {
    history: string[];

    constructor(history: string[]) {
        this.history = history;
    }

    blocks = (
        firstNode: AstNode
    ): Either<string, Array<[GameProps, AstNode[]]>> =>
        blocksFromHistory(firstNode, this.history)

    static fromNodes = (history: AstNode[]): QuickSave =>
        new QuickSave(history.map(_ => _.id))
}

export const QuickSaveType = t.exact(
    t.type({
        history: t.array(t.string)
    })
);
