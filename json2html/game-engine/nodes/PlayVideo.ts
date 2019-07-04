import { Either } from 'fp-ts/lib/Either';
import { lookup } from 'fp-ts/lib/StrMap';
import * as t from 'io-ts';

import GameProps from '../gameHistory/GameProps';
import Video from '../models/medias/Video';
import NodeWithMedia from './NodeWithMedia';

export default class PlayVideo extends NodeWithMedia<Video> {
    constructor(vidName: string, idNexts: string[]) {
        super(
            (data, vidName) => lookup(vidName, data.videos),
            vidName,
            idNexts,
            true
        );
    }

    reduce = (gameProps: GameProps): GameProps => ({
        ...gameProps,
        video: this.media
    })

    static decode = (playVideo: unknown): Either<t.Errors, PlayVideo> =>
        PlayVideoType.decode(playVideo).map(
            ({ arguments: [vidName, idNexts] }) =>
                new PlayVideo(vidName, idNexts)
        )
}

const PlayVideoType = t.exact(
    t.type({
        class_name: t.literal('Video'),
        arguments: t.tuple([t.string, t.array(t.string)])
    })
);
