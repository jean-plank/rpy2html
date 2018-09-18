// import * as $ from 'jquery';

// import { Story } from "./Story";
// import { Menu } from "./nodes";


// /*
//  */
// export class EventsHandler {
//     private story: Story;
//     private keyEvents: { [id: number]: (e: any) => void };

//     constructor() {
//         this.story = Story.getInstance();



//         // const keyEvents = {
//         //     // 38: () => {},                        // up arrow
//         //     // 40: () => {},                        // down arrow
//         //     // 37: () => {},                        // left arrow
//         //     // 39: () => {},                        // right arrow
//         //     27: () => {                             // escape
//         //         if (story.confirmHandler.hidden) {
//         //             siht._quit();
//         //         } else {
//         //             story.confirmHandler.hide();
//         //         }},
//         //     32: () => siht._nextIfNotMenu(),        // space
//         //     13: () => siht._nextIfNotMenu(),        // enter
//         //     // 17: () => {},                        // control
//         //     // 9: () => {},                         // tab
//         //     33: () => siht._historyPrevious(),      // page up
//         //     34: () => siht._historyNext(),          // page down
//         //     // 72: () => {},                        // h
//         //     // 86: () => {},                        // v
//         // }

//         // navigation events
//         // story.$.container.on("click", () => siht._nextIfNotMenu());
//         // $(document).on("keyup", this._onkeyup());
//         // story.$.container.on("wheel", this._onwheel());

//         // main menu button
//         // $('#start-btn').click(story.startStory());
//         // $('#quit-btn').click(() => siht._quit());
//     }

//     // private _nextIfNotMenu(): void {
//     //     if (  !(this.story.currentNode instanceof Menu)
//     //        && this.story.confirmHandler.hidden) {
//     //         this.story.executeNextBlock();
//     //     }
//     // }

//     // private _historyPrevious(): void {
//     //     if (this.story.confirmHandler.hidden) {
//     //         this.story.history.previousFrame();
//     //     }
//     // }

//     // private _historyNext(): void {
//     //     if (this.story.confirmHandler.hidden) {
//     //         this.story.history.nextFrame();
//     //     }
//     // }

//     // private _onKeyup(): (e: any) => void {
//     //     // const siht = this;

//     //     // return (event: any) => {
//     //     //     const f: (e: any) => void = siht.keyEvents[event.which];

//     //     //     if (f != undefined) f(event);
//     //     // };
//     //     const story = this.story;

//     //     return (event: any) => story.currentView.onKeyup(event);
//     // }

//     // private _onwheel(): (e: any) => void {
//     //     const siht = this;

//     //     return (event: any) => {
//     //         if (event.originalEvent.deltaY < 0) {        // scroll up
//     //             siht._historyPrevious();
//     //         } else if (event.originalEvent.deltaY > 0) { // scroll down
//     //             siht._historyNext();
//     //         }
//     //     };
//     // }

//     // private _quit(): void {
//     //     this.story.confirmHandler.confirm(
//     //         "Are you sure you want to quit?",
//     //         {   "Yes": () => window.location.assign(".."),
//     //             "No": () => {} })
//     // }
// }
