import * as _ from 'lodash';

import NodeWithChar from './NodeWithChar';

import GameController from '../GameController';


export default class Say extends NodeWithChar {
    toString(): string {
        return `Say(${this.who?`"${this.who.name}", `:''}"${this.what}")`;
    }

    execute(): void {
        super.execute(); // ensures that game isn't null
        (this.game as GameController).say(this.who, this.what);
    }
}
