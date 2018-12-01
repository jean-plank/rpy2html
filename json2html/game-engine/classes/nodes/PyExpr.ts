import * as _ from 'lodash';

import Node from './Node';
import { convertToJs } from '../../utils/utils';


export default class PyExpr extends Node {
    private code: string;

    constructor (code: string, idNext?: number[] | null) {
        super(idNext);

        this.code = convertToJs(code);
    }

    toString() {
        return `PyExpr("${this.code}")`;
    }

    execute() {
        super.execute();

        try {
            eval(this.code);
        } catch (e) {
            console.error('PyExpr evaluation error:', e);
        }
    }
}
