import * as _ from 'lodash';

import Node from './Node';
import { IGameProps } from '../GameProps';


export default class Stop extends Node {
    private chanName: string;

    constructor (chanName: string, idNext?: number[] | null) {
        super(idNext);
        this.chanName = chanName;
    }

    toString(): string {
        return `Stop("${this.chanName}")`;
    }

    execute(gameProps: IGameProps): Partial<IGameProps> {
        const res = super.execute(gameProps);
        if (res.sounds === undefined) res.sounds = {};
        res.sounds[this.chanName] = null;
        return res;
    }
}
