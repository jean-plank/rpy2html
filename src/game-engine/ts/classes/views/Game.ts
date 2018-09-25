import * as $ from 'jquery';

import { View } from "./View";
import { StoryHistory } from "../StoryHistory";
import { Node, Menu } from "../nodes";
import { Story } from "../Story";

/*
    Ren'Py help:

    * `Enter`: Advances dialogue and activates the interface.
    * `Space`: Advances dialogue without selecting choices.
    * `Arrow Keys`: Navigate the interface.
    * `Escape`: Accesses the game menu.
    * `Ctrl`: Skips dialogue while held down.
    * `Tab`: Toggles dialogue skipping.
    * `Page Up`: Rolls back to earlier dialogue.
    * `Page Down`: Rolls forward to later dialogue.
    * `H`: Hides the user interface.
    * `S`: Takes a screenshot.
    * `V`: Toggles assistive self-voicing.

    * `Left Click`: Advances dialogue and activates the interface.
    * `Middle Click`: Hides the user interface.
    * `Right Click`: Accesses the game menu.
    * `Mouse Wheel Up`, `Click Rollbalck Side`: Rolls back to earlier dialogue.
    * `Mouse Wheel Down`: Rolls forward to later dialogue.
 */


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

            this.story.history = new StoryHistory();
            this.story.nodes[0].execute();

            if (!this.story.currentNode.stopExecution) {
                this._executeNextBlock(undefined, [this.story.nodes[0]]);
            }
        }
    }

    private _executeNextBlock(id?: number, acc: Array<Node>=[]): void {
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

    hide(): void {
        super.hide();

        this.story.history = null;
    }

    onClick(story: Story, event: any): void {
        if (story.currentNode instanceof Menu) {
            const btn = $(event.target).closest("button");

            if (btn.length !== 0) {
                story.views.game._executeNextBlock(btn.index());
            }
        } else {
            story.views.game._executeNextBlock()
        }
    }

    onKeyup(story: Story, event: any): void {
        switch (event.which) {
            case 38: // up arrow
                break;

            case 40: // down arrow
                break;

            case 37: // left arrow
                break;

            case 39: // right arrow
                break;

            case 13: // enter
            case 32: // space
                if (!(story.currentNode instanceof Menu)) {
                    story.views.game._executeNextBlock();
                }
                break;

            case 27: // escape
                event.preventDefault();
                story.views.confirm.confirmQuit();
                break;

            case 33: // page up
                story.history.previousBlock();
                break;

            case 34: // page down
                story.history.nextBlock();
                break;

            case 17: // control
                break;

            case 9:  // tab
                break;

            case 72: // h
                break;
        }
    }

    onWheel(story: Story, event: any): void {
        if (event.originalEvent.deltaY < 0) {        // scroll up
            story.history.previousBlock();
        } else if (event.originalEvent.deltaY > 0) { // scroll down
            story.history.nextBlock();

        }
    }
}
