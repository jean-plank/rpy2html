import * as t from 'io-ts';

import AstNode from '../../nodes/AstNode';

export default class QuickSave {
    history: string[];

    constructor(history: string[]) {
        this.history = history;
    }

    static fromNodes = (history: AstNode[]): QuickSave =>
        new QuickSave(history.map(_ => _.toString()))
}

export const QuickSaveType = t.exact(
    t.type({
        history: t.array(t.string)
    })
);
