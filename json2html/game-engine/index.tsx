import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash';

import IRenpyJson, { IRawChar, IRawDefinition } from '../renpy-json-loader/IRenpyJson';

// import registerServiceWorker from './utils/registerServiceWorker';
import { mapColl } from './utils/utils';
import parseNode from './utils/parseNodes';

import IAppDatas from './classes/IAppDatas';
import Char from './classes/Char';
import Image from './classes/Image';
import Sound from './classes/Sound';
import Video from './classes/Video';
import Font from './classes/Font';

import App from './components/App';

const renpyJson: IRenpyJson =
    require(`../renpy-json-loader/index!${__INPUT_JSON}`);


const main = (json: IRenpyJson) => {
    const datas: IAppDatas = {
        lang: json.lang,
        help: json.help,
        nodes: mapColl(json.nodes, parseNode),
        chars: mapColl(json.characters, (char: IRawChar) =>
            char.color === null ? new Char(char.name)
                                : new Char(char.name, char.color)),
        images: mapColl(json.images, file => new Image(file)),
        sounds: mapColl(json.sounds, file => new Sound(file)),
        videos: mapColl(json.videos, file => new Video(file)),
        fonts: mapColl(json.fonts,
                        (def: IRawDefinition) => new Font(def.src, def.bold)),
        style: json.style,
        gameName: json.game_name,
    };

    ReactDOM.render(<App datas={datas} />, document.getElementById('root'));
    // registerServiceWorker();
};

main(renpyJson);
