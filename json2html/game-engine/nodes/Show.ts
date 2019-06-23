import { Either } from 'fp-ts/lib/Either';
import * as t from 'io-ts';

import GameProps from '../gameHistory/GameProps';
import NodeWithImage from './NodeWithImage';

export default class Show extends NodeWithImage {
    reduce = (gameProps: GameProps): Partial<GameProps> => {
        const res = super.reduce(gameProps);
        return this.media
            .filter(_ => !gameProps.charImgs.includes(_))
            .map<Partial<GameProps>>(_ => ({
                ...res,
                charImgs: [...gameProps.charImgs, _]
            }))
            .getOrElse(res);
    }

    static decode = (show: unknown): Either<t.Errors, Show> =>
        ShowType.decode(show).map(
            ({ arguments: [imgName, idNexts] }) =>
                new Show(imgName, { idNexts })
        )
}

const ShowType = t.exact(
    t.type({
        class_name: t.literal('Show'),
        arguments: t.tuple([t.string, t.array(t.string)])
    })
);
