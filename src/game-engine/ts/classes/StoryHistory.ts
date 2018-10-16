import * as _ from 'lodash';

import { Node } from "./nodes";
import { Story } from './Story';


export class StoryHistory {
    private history: Node[][];

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

    addBlock(block: Node[]): void {
        this.history = _(this.history).take(this.iCurrentBlock + 1)
                                      .push(block)
                                      .value();
        this.iCurrentBlock = this.history.length - 1;
    }

    nextBlock(): void {
        const newI: number = this.iCurrentBlock + 1
        const block: Node[] = this.history[newI];

        if (block != undefined) {
            _.forEach(block, (node: Node) => node.execute());
            this.iCurrentBlock = newI;
        }
    }

    previousBlock(): void {
        if (this.iCurrentBlock > 0) {
            // cleanup
            const story: Story = Story.getInstance();
            story.cleanup();

            const newI: number = this.iCurrentBlock - 1;

            for (let i = 0; i <= newI; i++) {
                const block: Node[] = this.history[i];

                _.forEach(block, (node: Node) => node.execute());
            }
            this.iCurrentBlock = newI;
        }
    }
}
