import * as $ from 'jquery';

import { View } from "./View";
import { StoryHistory } from "../StoryHistory";
import { Node, Menu } from "../nodes";
import { actionKey } from "../../utils";


export class Game extends View {
    start(): void {
        if (  this.story.images == undefined
           || this.story.sounds == undefined
           || this.story.chars == undefined)
        {
            console.error(`Story must be initiated before starting.`);
        } else if (this.story.nodes == undefined) {
            console.error(`Story must have its nodes set before starting.`);
        } else {
            this.story.currentView.hide();
            this.show();

            this.story.cleanup();
            this.story.history = new StoryHistory();
            this.story.nodes[0].execute();

            if (!this.story.currentNode.stopExecution) {
                this._executeNextBlock(undefined, [this.story.nodes[0]]);
            }
        }
    }

    private _executeNextBlock(id?: number, acc: Node[]=[]): void {
        if (this.story.currentNode != undefined) {
            const nexts = this.story.currentNode.nexts();

            if (nexts.length === 0) {
                this.story.views.mainMenu.show();
            } else {
                let next: Node;

                if (this.story.currentNode instanceof Menu) {
                    if (id === undefined) {
                        console.error(`Missing id for next of menu.`);
                    } else {
                        next = nexts[id];
                    }
                } else if (nexts.length === 1) {
                    next = nexts[0];
                } else {
                    console.error(`Current node has more than one next node.`);
                }

                if (next === undefined) {
                    this.story.history.addBlock(acc);
                } else {
                    next.execute();
                    acc.push(next);

                    if (next.stopExecution) {
                        this.story.history.addBlock(acc);
                    } else {
                        this._executeNextBlock(undefined, acc);
                    }
                }
            }
        }
    }

    show(): void {
        this.story.hideCurrentView();
        super.show();
    }

    onLeftClick(event: any): void {
        if (this.story.currentNode instanceof Menu) {
            const btn = $(event.target).closest("button");

            if (btn.length !== 0) {
                this._executeNextBlock(btn.index());
            }
        } else {
            this._executeNextBlock()
        }
    }

    onMiddleClick(event: any): void {}

    onRightClick(event: any): void {
        this.story.views.gameMenu.show();
    }

    onKeyup(event: any): void {
        const siht = this;
        function enterOrSpace() {
            if (!(siht.story.currentNode instanceof Menu)) {
                siht._executeNextBlock();
            }
        }

        actionKey(event, {
            38: () => {}, // up arrow
            40: () => {}, // down arrow
            37: () => {}, // left arrow
            39: () => {}, // right arrow
            13: enterOrSpace, // enter
            32: enterOrSpace, // space
            27: () => { // escape
                event.preventDefault();
                this.story.views.gameMenu.show();
            },
            33: () => this.story.history.previousBlock(), // page up
            34: () => this.story.history.nextBlock(), // page down
            17: () => {}, // control
            9: () => {}, // tab
            72: () => {}, // h
        });
    }

    onWheel(event: any): void {
        if (event.originalEvent.deltaY < 0) {        // scroll up
            this.story.history.previousBlock();
        } else if (event.originalEvent.deltaY > 0) { // scroll down
            this.story.history.nextBlock();
        }
    }
}
