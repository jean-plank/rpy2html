import * as _ from 'lodash';

import Node from './nodes/Node';

import Block from './Block';
// import GameProps from './GameProps';
import GameController from './GameController';

// import { partialGamePropsToString } from '../utils/utils';


export default class StoryHistory {
    private game: GameController;
    private blocks: Block[] = [];
    // private blockAcc: Node[] = [];

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
        return _(this.blocks).take(this.iCurrentBlock + 1)
                             .flatMap(([nodes, _gameProps]) => nodes)
                             .value() as Node[];
    }

    addBlock(block: Block) {
        this.blocks = _(this.blocks).take(this.iCurrentBlock + 1)
                                    .push(block)
                                    .value() as Block[];
        this.iCurrentBlock = this.blocks.length - 1;
    }

    noNextBlock(): boolean {
        return this.iCurrentBlock === this.blocks.length - 1;
    }

    nextBlock() {
        if (!this.noNextBlock()) {
            this.iCurrentBlock += 1;
            this.game.execute(this.blocks[this.iCurrentBlock]);
        }
    }

    noPreviousBlock(): boolean {
        return this.iCurrentBlock <= 0;
    }

    previousBlock() {
        if (!this.noPreviousBlock()) {
            this.iCurrentBlock -= 1;
            this.game.execute(this.blocks[this.iCurrentBlock]);
        }
    }
}
