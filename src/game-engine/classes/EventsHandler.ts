import { Story } from "./Story";
import { Menu } from "./nodes";


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
export class EventsHandler {
    private story: Story;
    private keyEvents: { [id: number]: (e: any) => void };

    constructor() {
        this.story = Story.getInstance();

        const story = this.story;
        const siht = this;

        this.keyEvents = {
            // 38: () => {},           // up arrow
            // 40: () => {},           // down arrow
            // 37: () => {},           // left arrow
            39: () => siht._nextIfNotMenu(), // right arrow
            27: () => {                // escape
                if (story.confirmHandler.hidden) {
                    siht._quit();
                } else {
                    story.confirmHandler.hide();
                }},
            32: () => siht._nextIfNotMenu(), // space
            // 13: () => {},           // enter
            // 17: () => {},           // control
            // 9: () => {},            // tab
            // 33: () => {},           // page up
            // 72: () => {},           // h
            // 86: () => {},           // v
        }

        // navigation events
        story.$.container.on("click", () => siht._nextIfNotMenu());
        $(document).on("keyup", this._onkeyup());
        story.$.container.on("wheel", this._onwheel());

        // main menu button
        $('#start-btn').click(() => story.startStory());
        $('#quit-btn').click(() => this._quit());
    }

    private _nextIfNotMenu(): void {
        if (  !(this.story.state.currentNode instanceof Menu)
            && this.story.confirmHandler.hidden) {
            this.story.executeNextNodes();
        }
    }

    private _onkeyup(): (e: any) => void {
        const siht = this;

        return (event: any) => {
            const f: (e: any) => void = siht.keyEvents[event.which];

            if (f != undefined) f(event);
        };
    }

    private _onwheel(): (e: any) => void {
        const siht = this;

        return (event: any) => {
            if (event.originalEvent.deltaY < 0) {
                // console.log("scroll up");
            } else if (event.originalEvent.deltaY > 0) {
                siht._nextIfNotMenu();
            }
        };
    }

    private _quit(): void {
        this.story.confirmHandler.confirm(
            "Are you sure you want to quit?",
            {   "Yes": () => window.location.assign(".."),
                "No": () => {} })
    }
}
