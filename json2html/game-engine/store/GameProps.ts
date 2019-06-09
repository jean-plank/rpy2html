import { none, Option } from 'fp-ts/lib/Option';
import { StrMap } from 'fp-ts/lib/StrMap';

import isOption from '../utils/isOption';

import Char from '../models/Char';
import Choice from '../models/Choice';
import Image from '../models/medias/Image';
import Sound from '../models/medias/Sound';
import Video from '../models/medias/Video';

export default class GameProps {
    sceneImg: Option<Image>;
    charImgs: Image[];
    textboxHide: boolean;
    textboxChar: Option<Char>;
    textboxText: string;
    choices: Choice[];
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

    static toString = (props: GameProps): string => {
        const res = Object.entries(props).reduce((acc, [key, val]) => {
            if (Array.isArray(val)) {
                return { ...acc, [key]: val.map(_ => _.toString()) };
            }
            if (isOption(val)) {
                return { ...acc, [key]: val.map(_ => _.toString()).toString() };
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
        }, {});
        return JSON.stringify(res, null, 2);
    }
}
