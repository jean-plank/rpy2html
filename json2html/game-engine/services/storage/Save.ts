import { fromNullable } from 'fp-ts/lib/Option';
import * as t from 'io-ts';

import AstNode from '../../nodes/AstNode';
import QuickSave from './QuickSave';

export default class Save extends QuickSave {
    date: string;

    constructor(date: string, history: string[]) {
        super(history);
        this.date = date;
    }

    static fromNodes = (history: AstNode[], date?: string): Save =>
        new Save(
            fromNullable(date).getOrElse(''),
            QuickSave.fromNodes(history).history
        )
}

export const SaveType = t.exact(
    t.type({
        date: t.string,
        history: t.array(t.string)
    })
);
