import * as _ from 'lodash';

import Node from './Node';
import IfBlock from './IfBlock';


export default class If extends Node {
    protected _nexts: IfBlock[];

    constructor (idNext?: number[] | null) {
        super(idNext);
    }

    toString(): string {
        return `If()`;
    }

    nexts(): IfBlock[] {
        const res = _.find(this._nexts, next => eval(next.condition) === true);
        if (res === undefined) return [];
        else return [res];
    }
}
