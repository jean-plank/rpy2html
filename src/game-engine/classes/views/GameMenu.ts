import { View } from "./View";
import { Story } from "../Story";


export class GameMenu extends View {
    show(): void {
        super.show();
    }

    hide(): void {
        super.hide();
    }

    onClick(story: Story, event: any): void {}
    onKeyup(story: Story, event: any): void {}
    onWheel(story: Story, event: any): void {}
}
