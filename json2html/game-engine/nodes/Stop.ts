import { Either } from 'fp-ts/lib/Either';
import { none } from 'fp-ts/lib/Option';
import { insert } from 'fp-ts/lib/StrMap';
import * as t from 'io-ts';

import GameProps from '../gameHistory/GameProps';
import AstNode from './AstNode';

interface Arg {
    idNexts?: string[];
}

export default class Stop extends AstNode {
    private chanName: string;

    constructor(chanName: string, { idNexts = [] }: Arg = {}) {
        super({ idNexts });
        this.chanName = chanName;
    }

    toString = (): string => `Stop("${this.chanName}")`;

    reduce = (gameProps: GameProps): Partial<GameProps> => {
        const res = super.reduce(gameProps);
        return {
            ...res,
            sounds: insert(this.chanName, none, gameProps.sounds)
        };
    }

    static decode = (hide: unknown): Either<t.Errors, Stop> =>
        StopType.decode(hide).map(
            ({ arguments: [chanName, idNexts] }) =>
                new Stop(chanName, { idNexts })
        )
}

const StopType = t.exact(
    t.type({
        class_name: t.literal('Stop'),
        arguments: t.tuple([t.string, t.array(t.string)])
    })
);
