import * as _ from 'lodash';

import MenuItem from './MenuItem';
import GameController from '../GameController';
import Choice from '../Choice';
import NodeWithChar from './NodeWithChar';
import { IGameProps } from '../GameProps';


export default class Menu extends NodeWithChar {
    protected _nexts: MenuItem[] | null;

    toString(): string {
        const args = [`${this.who?`"${this.who.name}", `:''}"${this.what}"`]
            .concat(_.map(this._nexts, (next: MenuItem) => `"${next.text}"`))
            .join(', ');

        return `Menu(${args})`;
    }

    execute(gameProps: IGameProps): Partial<IGameProps> {
        const res = super.execute(gameProps);
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

        if (this.what === '') {
            res.textboxHide = true;
            res.choices = choices;
        } else {
            res.textboxChar = this.who;
            res.textboxText = this.what;
            res.choices = choices;
        }
        return res;
    }

    beforeNext(gameProps: IGameProps): Partial<IGameProps> {
        const res = super.beforeNext(gameProps);
        if (this.game !== null) {
            res.textboxHide = false;
            res.choices = [];
        }
        return res;
    }

    nexts(): MenuItem[] {
        this.throwErrorIfNotInitiated();

        return _.filter(this._nexts, next => eval(next.condition) === true);
    }
}
