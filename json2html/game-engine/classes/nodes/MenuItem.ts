import * as _ from 'lodash';

import Node from './Node';
import { convertToJs } from '../../utils/utils';
import GameController from '../GameController';


export default class MenuItem extends Node {
    text: string;
    condition: string;

    constructor (text: string, condition='false', idNext?: number[] | null) {
        super(idNext);

        this.text = text;
        this.condition = convertToJs(condition);
    }

    toString(): string {
        return `MenuItem("${this.text}")`;
    }

    execute(): void {
        super.execute(); // ensures that game isn't null
        (this.game as GameController).afterMenu();
    }
}
