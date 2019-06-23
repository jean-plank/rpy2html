import { Either } from 'fp-ts/lib/Either';
import { lookup, StrMap } from 'fp-ts/lib/StrMap';
import * as t from 'io-ts';

import RenpyJson, { RawNode } from '../renpy-json-loader/RenpyJson';
import Char from './models/Char';
import Image from './models/medias/Image';
import Sound from './models/medias/Sound';
import Video from './models/medias/Video';
import Obj from './models/Obj';
import AstNode from './nodes/AstNode';
import Hide from './nodes/Hide';
import If from './nodes/If';
import IfBlock from './nodes/IfBlock';
import Menu from './nodes/Menu';
import MenuItem from './nodes/MenuItem';
import Play from './nodes/Play';
import PlayVideo from './nodes/PlayVideo';
import PyExpr from './nodes/PyExpr';
import Say from './nodes/Say';
import Scene from './nodes/Scene';
import Show from './nodes/Show';
import Stop from './nodes/Stop';
import translations from './translations';

const json = require(`../renpy-json-loader/index!${__INPUT_JSON}`) as RenpyJson;

export const nbSlots = 6;
export const storagePrefix = 'jpGame-';
export const storageKey = storagePrefix + json.game_name + ` (${json.lang})`;

export const nodes = mapColl(json.nodes, parseNode);
export const chars = mapColl(json.characters, Char.fromRawChar);
export const sounds = mapColl(json.sounds, _ => new Sound(_));
export const videos = mapColl(json.videos, _ => new Video(_));
export const images = mapColl(json.images, _ => new Image(_));

export const style = json.style;
export const fonts = new StrMap(json.fonts);
export const transl = lookup(json.lang, translations).getOrElse(
    translations.value.en // we're all consenting adults here
);
export const lang = json.lang;
export const help = json.help;
export const firstNode = lookup('0', nodes).getOrElseL(() => {
    throw EvalError('A node with id 0 is needed to start the story.');
});
export const gameName = json.game_name;

function mapColl<A, B>(coll: Obj<A>, f: (elt: A) => B): StrMap<B> {
    return new StrMap(
        Object.entries(coll).reduce(
            (acc, [key, val]) => ({ ...acc, [key]: f(val) }),
            {}
        )
    );
}

function parseNode(rawNode: RawNode): AstNode {
    return (Hide.decode(rawNode) as Either<t.Errors, AstNode>)
        .alt(If.decode(rawNode))
        .alt(IfBlock.decode(rawNode))
        .alt(Menu.decode(rawNode))
        .alt(MenuItem.decode(rawNode))
        .alt(Play.decode(rawNode))
        .alt(PlayVideo.decode(rawNode))
        .alt(PyExpr.decode(rawNode))
        .alt(Say.decode(rawNode))
        .alt(Scene.decode(rawNode))
        .alt(Show.decode(rawNode))
        .alt(Stop.decode(rawNode))
        .fold(
            errors => {
                console.error(errors);
                throw EvalError("Couldn't parse nodes");
            },
            _ => _
        );
}
