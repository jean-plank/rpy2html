import { Story } from "../Story";


export abstract class View {
    protected story: Story;

    constructor () {
        this.story = Story.getInstance();
    }

    show(): void {
        this.story.currentView = this;
    }

    hide(): void {
        this.story.currentView = null;
    }

    abstract onKeyup(event: any): void;
    abstract onLeftClick(event: any): void;
    abstract onMiddleClick(event: any): void;
    abstract onRightClick(event: any): void;
    abstract onWheel(event: any): void;
}
