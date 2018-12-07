import * as _ from 'lodash';

import Node from './Node';
import { convertToJs } from '../../utils/utils';


export default class IfBlock extends Node {
    condition: string;

    constructor (condition: string, idNext?: number[] | null) {
        super(idNext);
        this.condition = convertToJs(condition);
    }

    toString(): string {
        return `IfBlock("${this.condition}")`;
    }
}
