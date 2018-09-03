import * as _ from 'lodash';

import { Node } from "./nodes";


export class StoryHistory {
    private history: Array<Array<Node>>;

    /**
     * @property {number} iCurrentBlock Index of the block being displayed.
     * Usefull when navigating through already played history and changing to
     * an other ark
     */
    private iCurrentBlock: number;

    constructor () {
        this.history = [];
        this.iCurrentBlock = -1;
    }

    addBlock(block: Array<Node>): void {
        this.history = _(this.history).take(this.iCurrentBlock + 1)
                                      .push(block)
                                      .value();
        this.iCurrentBlock = this.history.length - 1;
    }

    nextFrame(): void {
        const newI: number = this.iCurrentBlock + 1
        const block: Array<Node> = this.history[newI];

        if (block != undefined) {
            _.forEach(block, (node: Node) => node.execute());
            this.iCurrentBlock = newI;
        }
    }

    previousFrame(): void {
        if (this.iCurrentBlock > 0) {
            const newI: number = this.iCurrentBlock - 1;

            for (let i = 0; i <= newI; i++) {
                const block: Array<Node> = this.history[i];

                _.forEach(block, (node: Node) => node.execute());
            }
            this.iCurrentBlock = newI;
        }
    }
}
