import * as _ from 'lodash';

import Node from './nodes/Node';


interface IQuickSave {
    history: string[];
}

export default class QuickSave implements IQuickSave {
    history: string[];

    constructor (history: string[]) {
        this.history = history;
    }

    static fromNodes(history: Node[]): QuickSave {
        return new QuickSave(_.map(history, node => node.toString()));
    }

    static fromAny(save: any): QuickSave | null {
        if (  _.keys(save).length === 1
           && _.has(save, 'history') && _.isArray(save.history)
                                     && _.every(save.history, _.isString))
            return new QuickSave(save.history);
        return null;
    }
}
