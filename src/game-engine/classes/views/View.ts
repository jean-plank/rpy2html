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

    abstract onKeyup(story: Story, event: any): void;
    abstract onClick(story: Story, event: any): void;
    abstract onWheel(story: Story, event: any): void;
}
