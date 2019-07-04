import { Either } from 'fp-ts/lib/Either';
import { insert, lookup } from 'fp-ts/lib/StrMap';
import * as t from 'io-ts';

import GameProps from '../gameHistory/GameProps';
import Sound from '../models/medias/Sound';
import NodeWithMedia from './NodeWithMedia';

export default class Play extends NodeWithMedia<Sound> {
    constructor(private chanName: string, sndName: string, idNexts: string[]) {
        super(
            (data, sndName) => lookup(sndName, data.sounds),
            sndName,
            idNexts
        );
    }

    toString = (): string => `Play("${this.chanName}", "${this.mediaName}")`;

    reduce = (gameProps: GameProps): GameProps => ({
        ...gameProps,
        sounds: insert(this.chanName, this.media, gameProps.sounds)
    })

    static decode = (play: unknown): Either<t.Errors, Play> =>
        PlayType.decode(play).map(
            ({ arguments: [chanName, sndName, idNexts] }) =>
                new Play(chanName, sndName, idNexts)
        )
}

const PlayType = t.exact(
    t.type({
        class_name: t.literal('Play'),
        arguments: t.tuple([t.string, t.string, t.array(t.string)])
    })
);
