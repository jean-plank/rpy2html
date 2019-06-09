import { Either } from 'fp-ts/lib/Either';
import * as t from 'io-ts';

import GameProps from '../store/GameProps';
import NodeWithImage from './NodeWithImage';

export default class Hide extends NodeWithImage {
    reduce = (gameProps: GameProps): Partial<GameProps> => {
        const res = super.reduce(gameProps);
        return this.media
            .map<Partial<GameProps>>(image => ({
                ...res,
                charImgs: gameProps.charImgs.filter(_ => _ !== image)
            }))
            .getOrElse(res);
    }

    static decode = (hide: unknown): Either<t.Errors, Hide> =>
        HideType.decode(hide).map(
            ({ arguments: [imgName, idNexts] }) =>
                new Hide(imgName, { idNexts })
        )
}

const HideType = t.exact(
    t.type({
        class_name: t.literal('Hide'),
        arguments: t.tuple([t.string, t.array(t.string)])
    })
);
