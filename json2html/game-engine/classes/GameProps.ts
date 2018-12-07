import * as _ from 'lodash';

import IObj from './IObj';
import Image from './Image';
import Char from './Char';
import Choice from './Choice';
import Sound from './Sound';
import Video from './Video';


export interface IGameProps {
    sceneImg: Image | null;
    charImgs: Image[];
    textboxHide: boolean;
    textboxChar: Char | null;
    textboxText: string;
    choices: Choice[];
    video: Video | null;
    sounds: IObj<Sound | null>; // key chanName
}

export const mergeProps = <T>(
    props1: T,
    props2: Partial<IGameProps>): T => {

    return _.assignWith(props1, props2,
        (prop1, prop2, key) =>
            key === 'sounds' ? _.assign(prop1, prop2) : undefined);
};

export default class GameProps implements IGameProps {
    sceneImg: Image | null;
    charImgs: Image[];
    textboxHide: boolean;
    textboxChar: Char | null;
    textboxText: string;
    choices: Choice[];
    video: Video | null;
    sounds: IObj<Sound | null>;

    constructor (props: IGameProps) {
        this.sceneImg = props.sceneImg;
        this.charImgs = props.charImgs;
        this.textboxHide = props.textboxHide;
        this.textboxChar = props.textboxChar;
        this.textboxText = props.textboxText;
        this.choices = props.choices;
        this.video = props.video;
        this.sounds = props.sounds;
    }

    toIProps(): IGameProps {
        return {
            sceneImg: this.sceneImg,
            charImgs: this.charImgs,
            textboxHide: this.textboxHide,
            textboxChar: this.textboxChar,
            textboxText: this.textboxText,
            choices: this.choices,
            video: this.video,
            sounds: this.sounds,
        };
    }

    cleanedIProps(): IGameProps {
        const res = this.toIProps();
        res.sounds = _.pick(res.sounds, 'music');
        return res;
    }

    static empty(): IGameProps {
        return {
            sceneImg: null,
            charImgs: [],
            textboxHide: false,
            textboxChar: null,
            textboxText: '',
            choices: [],
            video: null,
            sounds: {},
        };
    }

    static fromAny(props: any): GameProps | null {
        if (  _.keys(props).length === 8
           && _.has(props, 'sceneImg')
           && _.has(props, 'charImgs') && _.isArray(props.charImgs)
           && _.has(props, 'textboxHide') && _.isBoolean(props.textboxHide)
           && _.has(props, 'textboxChar')
           && _.has(props, 'textboxText') && _.isString(props.textboxText)
           && _.has(props, 'choices') && _.isArray(props.choices)
           && _.has(props, 'video')
           && _.has(props, 'sounds') && _.isPlainObject(props.sounds)) {

            const images: Image[] = [];
            _.forEach(props.charImgs,
                      (img: any) => {
                          const res = Image.fromAny(img);
                          if (res !== null) images.push(res);
                      });

            const theChoices: Choice[] = [];
            _.forEach(props.choices,
                      (choice: any) => {
                          const res = Choice.fromAny(choice);
                          if (res !== null) theChoices.push(res);
                      });

            const theSounds: IObj<Sound> = {};
            _.forEach(props.sounds,
                      (sound: any, key: string) => {
                          const res = Sound.fromAny(sound);
                          if (res !== null) theSounds[key] = res;
                      });

            return new GameProps({
                sceneImg: Image.fromAny(props.sceneImg),
                charImgs: images,
                textboxHide: props.textboxHide,
                textboxChar: Char.fromAny(props.textboxChar),
                textboxText: props.textboxText,
                choices: theChoices,
                video: Video.fromAny(props.video),
                sounds: theSounds,
            });
        } else return null;
    }
}
