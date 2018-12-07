import * as _ from 'lodash';

import NodeWithChar from './NodeWithChar';

import { IGameProps } from '../GameProps';


export default class Say extends NodeWithChar {
    toString(): string {
        return `Say(${this.who?`"${this.who.name}", `:''}"${this.what}")`;
    }

    execute(gameProps: IGameProps): Partial<IGameProps> {
        const res = super.execute(gameProps);
        res.textboxChar = this.who;
        res.textboxText = this.what;
        return res;
    }
}
