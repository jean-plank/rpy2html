import * as _ from 'lodash';

import Node from './Node';
import GameController from '../GameController';


export default class Stop extends Node {
    private chanName: string;

    constructor (chanName: string, idNext?: number[] | null) {
        super(idNext);
        this.chanName = chanName;
    }

    toString(): string {
        return `Stop("${this.chanName}")`;
    }

    execute(): void {
        super.execute(); // ensures that game isn't null
        (this.game as GameController).stop(this.chanName);
    }
}
