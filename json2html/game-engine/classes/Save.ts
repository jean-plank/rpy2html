import * as _ from 'lodash';

import GameProps, { IGameProps } from './GameProps';

import Node from './nodes/Node';


interface ISave {
    gameProps: IGameProps;
    date: string;
    history: string[];
}

export default class Save implements ISave {
    gameProps: IGameProps;
    date: string;
    history: string[];

    constructor (props: IGameProps, date: string, history: string[]) {
        this.gameProps = props;
        this.date = date;
        this.history = history;
    }

    static fromNodes(props: IGameProps, date: string, history: Node[]): Save {
        return new Save(props, date, _.map(history, node => node.toString()));
    }

    static fromAny(save: any): Save | null {
        if (  _.keys(save).length === 3
           && _.has(save, 'date') && _.isString(save.date)
           && _.has(save, 'history') && _.isArray(save.history)
                                     && _.every(save.history, _.isString)
           && _.has(save, 'gameProps')) {

            const props = GameProps.fromAny(save.gameProps);

            if (props !== null) return new Save(props, save.date, save.history);
        }
        return null;
    }
}
