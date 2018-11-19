import * as _ from 'lodash';

import MenuItem from './MenuItem';
import GameController from '../GameController';
import Choice from '../Choice';
import NodeWithChar from './NodeWithChar';


export default class Menu extends NodeWithChar {
    protected _nexts: MenuItem[] | null;

    toString(): string {
        const args = [`${this.who?`"${this.who.name}", `:''}"${this.what}"`]
            .concat(_.map(this._nexts, (next: MenuItem) => `"${next.text}"`))
            .join(', ');

        return `Menu(${args})`;
    }

    execute(): void {
        super.execute(); // ensures that game isn't null

        const choices: Choice[] =
            _.map(this.nexts(), (item: MenuItem) =>
                new Choice(
                    item.text,
                    (e: React.MouseEvent) => {
                        e.stopPropagation();
                        (this.game as GameController).execThenExecNext(item);
                    }
                )
            );

        (this.game as GameController).menu(this.who, this.what, choices);
    }

    nexts(): MenuItem[] {
        this.throwErrorIfNotInitiated();

        return _.filter(this._nexts, next => eval(next.condition) === true);
    }
}
