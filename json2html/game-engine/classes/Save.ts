import * as _ from 'lodash';

import QuickSave from './QuickSave';
import Node from './nodes/Node';


export default class Save extends QuickSave {
    date: string;

    constructor (date: string, history: string[]) {
        super(history);
        this.date = date;
    }

    static fromNodes(history: Node[], date?: string): Save {
        const quickSave = QuickSave.fromNodes(history);
        if (date === undefined) date = '';
        return new Save(date, quickSave.history);
    }

    static fromAny(save: any): Save | null {
        if (  _.keys(save).length === 2
           && _.has(save, 'date') && _.isString(save.date)
           && _.has(save, 'history') && _.isArray(save.history)) {

            const quickSave = QuickSave.fromAny({ history: save.history });

            if (quickSave !== null) {
                return new Save(save.date, quickSave.history);
            }
        }
        return null;
    }
}
