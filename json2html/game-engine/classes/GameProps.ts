import * as _ from 'lodash';

import Image from './Image';
import Char from './Char';
import Choice from './Choice';
import Video from './Video';


export interface IGameProps {
    sceneImg: Image | null;
    charImgs: Image[];
    textboxHide: boolean;
    textboxChar: Char | null;
    textboxText: string;
    choices: Choice[];
    video: Video | null;
}

export default class GameProps implements IGameProps {
    sceneImg: Image | null;
    charImgs: Image[];
    textboxHide: boolean;
    textboxChar: Char | null;
    textboxText: string;
    choices: Choice[];
    video: Video | null;

    static fromAny(props: any): GameProps | null {
        if (  _.keys(props).length === 6
           && _.has(props, 'sceneImg')
           && _.has(props, 'charImgs') && _.isArray(props.charImgs)
           && _.has(props, 'textboxHide') && _.isBoolean(props.textboxHide)
           && _.has(props, 'textboxChar')
           && _.has(props, 'textboxText') && _.isString(props.textboxText)
           && _.has(props, 'choices') && _.isArray(props.choices)
           && _.has(props, 'video')) {

            const images: Image[] = [];
            _.forEach(props.charImgs,
                      img => { const res = Image.fromAny(img);
                               if (res !== null) images.push(res); });

            const theChoices: Choice[] = [];
            _.forEach(props.choices,
                      choice => { const res = Choice.fromAny(choice);
                                  if (res !== null) theChoices.push(res); });

            return {
                sceneImg: Image.fromAny(props.sceneImg),
                charImgs: images,
                textboxHide: props.textboxHide,
                textboxChar: Char.fromAny(props.textboxChar),
                textboxText: props.textboxText,
                choices: theChoices,
                video: Video.fromAny(props.video),
            };
        }
        return null;
    }
}
