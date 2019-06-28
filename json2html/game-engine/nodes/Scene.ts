import { Either } from 'fp-ts/lib/Either';
import { none } from 'fp-ts/lib/Option';
import * as t from 'io-ts';

import GameProps from '../gameHistory/GameProps';
import NodeWithImage from './NodeWithImage';

export default class Scene extends NodeWithImage {
    reduce = (gameProps: GameProps): GameProps => ({
        ...gameProps,
        sceneImg: this.media,
        charImgs: [],
        textboxChar: none,
        textboxText: ''
    })

    static decode = (scene: unknown): Either<t.Errors, Scene> =>
        SceneType.decode(scene).map(
            ({ arguments: [imgName, idNexts] }) =>
                new Scene(imgName, { idNexts })
        )
}

const SceneType = t.exact(
    t.type({
        class_name: t.literal('Scene'),
        arguments: t.tuple([t.string, t.array(t.string)])
    })
);
