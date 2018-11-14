import * as _ from 'lodash';

import Node from './nodes/Node';
import GameController from './GameController';


export default class StoryHistory {
    private game: GameController;
    private blocks: Node[][] = [];
    private blockAcc: Node[] = [];

    /**
     * @property {number} iCurrentBlock Index of the block being displayed.
     * Usefull when navigating through already played history and changing to
     * an other ark.
     */
    private iCurrentBlock: number = -1;

    constructor (game: GameController) {
        this.game = game;
    }

    getNodes(): Node[] {
        return _.flatten(this.blocks);
    }

    addNode(node: Node) {
        this.blockAcc.push(node);

        if (node.stopExecution) {
            // add block
            this.blocks = _(this.blocks).take(this.iCurrentBlock + 1)
                                        .push(this.blockAcc)
                                        .value();
            this.iCurrentBlock = this.blocks.length - 1;
            this.blockAcc = [];
        }
    }

    nextBlock(): void {
        const newI: number = this.iCurrentBlock + 1;

        if (_.inRange(newI, this.blocks.length)) {
            const block: Node[] = this.blocks[newI];

            _.forEach(block, (node: Node) => { this.game.execute(node); });

            this.iCurrentBlock = newI;
        }
    }

    previousBlock(): void {
        if (this.iCurrentBlock <= 0) return;

        this.game.cleanup();

        const newI = this.iCurrentBlock - 1;

        for (let i = 0; i <= newI; i++) {
            const block: Node[] = this.blocks[i];
            _.forEach(block, (node: Node) => { this.game.execute(node); });
        }

        this.iCurrentBlock = newI;
    }
}
