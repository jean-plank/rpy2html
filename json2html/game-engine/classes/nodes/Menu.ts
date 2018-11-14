import * as _ from 'lodash';

import Node from './Node';
import MenuItem from './MenuItem';
import GameController from '../GameController';
import Choice from '../Choice';


export default class Menu extends Node {
    protected _nexts: MenuItem[] | null;

    private displayTxt: string;

    constructor (displayTxt: string, idNext?: number[] | null) {
        super(idNext, true);
        this.displayTxt = displayTxt;
    }

    toString(): string {
        const args = [`"${this.displayTxt}"`]
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

        (this.game as GameController).menu(this.displayTxt, choices);
    }

    nexts(): MenuItem[] {
        this.throwErrorIfNotInitiated();

        return _.filter(this._nexts, next => eval(next.condition) === true);
    }
}
