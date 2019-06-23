import { Either } from 'fp-ts/lib/Either';
import { lookup } from 'fp-ts/lib/StrMap';
import * as t from 'io-ts';

import GameProps from '../gameHistory/GameProps';
import Video from '../models/medias/Video';
import NodeWithMedia from './NodeWithMedia';

interface Args {
    idNexts?: string[];
}

export default class PlayVideo extends NodeWithMedia<Video> {
    constructor(vidName: string, { idNexts = [] }: Args = {}) {
        super((data, vidName) => lookup(vidName, data.videos), vidName, {
            idNexts,
            stopExecution: true
        });
    }

    reduce = (gameProps: GameProps): Partial<GameProps> => ({
        ...super.reduce(gameProps),
        video: this.media.map(_ => _.clone())
    })

    static decode = (playVideo: unknown): Either<t.Errors, PlayVideo> =>
        PlayVideoType.decode(playVideo).map(
            ({ arguments: [vidName, idNexts] }) =>
                new PlayVideo(vidName, { idNexts })
        )
}

const PlayVideoType = t.exact(
    t.type({
        class_name: t.literal('Video'),
        arguments: t.tuple([t.string, t.array(t.string)])
    })
);
