import { StrMap } from 'fp-ts/lib/StrMap';

import RenpyJson, { Style } from '../../renpy-json-loader/RenpyJson';

import Char from '../models/Char';
import Font from '../models/Font';
import Image from '../models/medias/Image';
import Sound from '../models/medias/Sound';
import Video from '../models/medias/Video';
import Obj from '../models/Obj';
import AstNode from '../nodes/AstNode';
import parseNode from './parseNodes';

// useful stuff to initiate nodes
export default class AppData {
    gameName: string;
    lang: string;
    help: string;
    nodes: StrMap<AstNode>;
    chars: StrMap<Char>;
    images: StrMap<Image>;
    sounds: StrMap<Sound>;
    videos: StrMap<Video>;
    fonts: StrMap<Font>;
    style: Style;

    static fromJson(json: RenpyJson): AppData {
        return {
            lang: json.lang,
            help: json.help,
            nodes: mapColl(json.nodes, parseNode),
            chars: mapColl(json.characters, Char.fromRawChar),
            images: mapColl(json.images, _ => new Image(_)),
            sounds: mapColl(json.sounds, _ => new Sound(_)),
            videos: mapColl(json.videos, _ => new Video(_)),
            fonts: mapColl(json.fonts, Font.fromRawDefinition),
            style: json.style,
            gameName: json.game_name
        };
    }
}

const mapColl = <A, B>(coll: Obj<A>, f: (elt: A) => B): StrMap<B> =>
    new StrMap(
        Object.entries(coll).reduce(
            (acc, [key, val]) => ({ ...acc, [key]: f(val) }),
            {}
        )
    );
