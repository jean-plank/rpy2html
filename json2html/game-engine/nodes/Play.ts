import { Either } from 'fp-ts/lib/Either';
import { insert, lookup } from 'fp-ts/lib/StrMap';
import * as t from 'io-ts';

import Sound from '../models/medias/Sound';
import GameProps from '../store/GameProps';
import NodeWithMedia from './NodeWithMedia';

interface Args {
    idNexts?: string[];
}

export default class Play extends NodeWithMedia<Sound> {
    private chanName: string;

    constructor(
        chanName: string,
        sndName: string,
        { idNexts = [] }: Args = {}
    ) {
        super((data, sndName) => lookup(sndName, data.sounds), sndName, {
            idNexts
        });
        this.chanName = chanName;
    }

    toString = (): string => `Play("${this.chanName}", "${this.mediaName}")`;

    reduce = (gameProps: GameProps): Partial<GameProps> => {
        const res = super.reduce(gameProps);
        return {
            ...res,
            sounds: insert(this.chanName, this.media, gameProps.sounds)
        };
    }

    static decode = (play: unknown): Either<t.Errors, Play> =>
        PlayType.decode(play).map(
            ({ arguments: [chanName, sndName, idNexts] }) =>
                new Play(chanName, sndName, { idNexts })
        )
}

const PlayType = t.exact(
    t.type({
        class_name: t.literal('Play'),
        arguments: t.tuple([t.string, t.string, t.array(t.string)])
    })
);
