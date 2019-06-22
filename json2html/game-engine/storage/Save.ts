import * as t from 'io-ts';

import AstNode from '../nodes/AstNode';
import QuickSave from './QuickSave';

export const SaveType = t.exact(
    t.type({
        date: t.string,
        history: t.array(t.string)
    })
);

export default class Save {
    date: string;
    history: string[];

    static fromNodes = (history: AstNode[], date: string): Save => ({
        ...QuickSave.fromNodes(history),
        date
    })
}
