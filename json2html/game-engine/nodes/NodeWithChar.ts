import { none, Option } from 'fp-ts/lib/Option';
import { lookup } from 'fp-ts/lib/StrMap';

import AstNode, { InitArgs } from './AstNode';

import Char from '../models/Char';

interface Args {
    idNexts?: string[];
}

export default abstract class NodeWithChar extends AstNode {
    who: Option<Char>;
    what: string;

    private whosName: Option<string>;

    constructor(
        whosName: Option<string>,
        what: string,
        { idNexts = [] }: Args = {}
    ) {
        super({ idNexts, stopExecution: true });
        this.who = none;
        this.what = what;
        this.whosName = whosName;
    }

    init({ id, data, execThenExecNext }: InitArgs) {
        super.init({ id, data, execThenExecNext });
        this.who = this.whosName.chain(name => {
            const res = lookup(name, data.chars);
            if (res.isNone()) {
                console.warn(`Say: invalid character name: ${name}`);
            }
            return res;
        });
    }
}
