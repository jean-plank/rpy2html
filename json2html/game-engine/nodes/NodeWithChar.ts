import { none, Option } from 'fp-ts/lib/Option';
import { lookup } from 'fp-ts/lib/StrMap';

import AstNode, { InitArgs } from './AstNode';

import Char from '../models/Char';

export default abstract class NodeWithChar extends AstNode {
    who: Option<Char> = none;

    constructor(
        private whosName: Option<string>,
        public what: string,
        idNexts: string[]
    ) {
        super(idNexts, true);
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
