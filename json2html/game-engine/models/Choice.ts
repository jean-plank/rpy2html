import { Either } from 'fp-ts/lib/Either';
import * as t from 'io-ts';

export default class Choice {
    text: string;
    action: (e: React.MouseEvent) => void;

    constructor(text: string, action: (e: React.MouseEvent) => void) {
        this.text = text;
        this.action = action;
    }

    // toJSON(): { text: string } {
    //     return { text: this.text };
    // }

    static decode = (choice: unknown): Either<t.Errors, Choice> =>
        ChoiceType.decode(choice).map(_ => new Choice(_.text, () => {}))
}

const ChoiceType = t.exact(
    t.type({
        text: t.string
    })
);
