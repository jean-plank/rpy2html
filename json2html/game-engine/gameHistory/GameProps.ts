import { fromNullable, none, Option, tryCatch } from 'fp-ts/lib/Option';
import { StrMap } from 'fp-ts/lib/StrMap';

import Char from '../models/Char';
import Image from '../models/Image';
import Sound from '../models/medias/Sound';
import Video from '../models/medias/Video';
import MenuItem from '../nodes/MenuItem';

export default class GameProps {
    sceneImg: Option<Image>;
    charImgs: Image[];
    textboxHide: boolean;
    textboxChar: Option<Char>;
    textboxText: string;
    choices: MenuItem[];
    video: Option<Video>;
    sounds: StrMap<Option<Sound>>; // key chanName

    static empty: GameProps = {
        sceneImg: none,
        charImgs: [],
        textboxHide: false,
        textboxChar: none,
        textboxText: '',
        choices: [],
        video: none,
        sounds: new StrMap({})
    };

    static cleaned = (props: GameProps): GameProps => ({
        ...props,
        textboxHide: false,
        choices: [],
        video: none,
        sounds: props.sounds.mapWithKey((chanName, sound) =>
            chanName === 'music' ? sound : none
        )
    })

    static toJSON = (props: GameProps): object =>
        Object.entries(props).reduce((acc, [key, val]) => {
            if (Array.isArray(val)) {
                return { ...acc, [key]: val.map(_ => _.toString()) };
            }
            if (isOption(val)) {
                return { ...acc, [key]: val.map(_ => _.toString()) };
            }
            if (key === 'sounds') {
                return {
                    ...acc,
                    sounds: props.sounds.map(_ =>
                        _.map(_ => _.toString()).toString()
                    )
                };
            }
            return { ...acc, [key]: val };
        }, {})
}

export const isOption = (obj: any): obj is Option<any> =>
    tryCatch(() => fromNullable(obj._tag)).exists(_ =>
        _.exists(tag => tag === 'Some' || tag === 'None')
    );