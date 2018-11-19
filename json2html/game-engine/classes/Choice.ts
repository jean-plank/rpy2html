import * as _ from 'lodash';


export default class Choice {
    text: string;
    action: (e: React.MouseEvent) => void;

    constructor (text: string, action: (e: React.MouseEvent) => void) {
        this.text = text;
        this.action = action;
    }

    toJSON(): { text: string } {
        return { text: this.text };
    }

    static fromAny(choice: any): Choice | null {
        if (  _.keys(choice).length === 1
           && _.has(choice, 'text') && _.isString(choice.text))
            return new Choice(choice.text, () => {});
        return null;
    }
}
