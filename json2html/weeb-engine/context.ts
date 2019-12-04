import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import * as R from 'fp-ts/lib/Record'

import Char from '../renpy-json-loader/Char'
import Font from '../renpy-json-loader/Font'
import RawNode from '../renpy-json-loader/RawNode'
import RenpyJson from '../renpy-json-loader/RenpyJson'
import Style from '../renpy-json-loader/Style'
import Image from './medias/Image'
import Sound from './medias/Sound'
import Video from './medias/Video'
import AstNode from './nodes/AstNode'
import Hide from './nodes/Hide'
import If from './nodes/If'
import IfBlock from './nodes/IfBlock'
import Menu from './nodes/Menu'
import MenuItem from './nodes/MenuItem'
import Pause from './nodes/Pause'
import Play from './nodes/Play'
import PlayVideo from './nodes/PlayVideo'
import PyExpr from './nodes/PyExpr'
import Say from './nodes/Say'
import Scene from './nodes/Scene'
import Show from './nodes/Show'
import ShowVideo from './nodes/ShowVideo'
import ShowWindow from './nodes/ShowWindow'
import Stop from './nodes/Stop'
import Obj from './Obj'
import translations, { Translation } from './translations'

const json: RenpyJson = require(`../renpy-json-loader/dist/index!${__INPUT_JSON}`)

export const nbSlots: number = 6
export const storagePrefix: string = 'jpGame-'
export const storageKey: string =
    storagePrefix + json.game_name + ` (${json.lang})`

export const nodes: Obj<AstNode> = pipe(json.nodes, R.map(parseNode))

export const chars: Obj<Char> = json.characters

export const sounds: Obj<Sound> = pipe(
    json.sounds,
    R.mapWithIndex((name, file) => new Sound(name, file))
)

export const videos: Obj<Video> = pipe(
    json.videos,
    R.mapWithIndex((name, file) => new Video(name, file))
)

export const images: Obj<Image> = pipe(
    json.images,
    R.mapWithIndex((name, file) => new Image(name, file))
)

export const style: Style = json.style
export const fonts: Obj<Font> = json.fonts
export const transl: Translation = pipe(
    R.lookup(json.lang, translations),
    O.getOrElse(() => translations.en) // we're all consenting adults here
)
export const lang: string = json.lang
export const help: string = json.help
export const firstNode: AstNode = pipe(
    R.lookup('0', nodes),
    O.getOrElse(() => {
        throw EvalError('A node with id 0 is needed to start the story.')
    })
)
export const gameName: string = json.game_name

function parseNode(rawNode: RawNode): AstNode {
    switch (rawNode.class_name) {
        case 'Hide':
            return new Hide(...rawNode.arguments)
        case 'If':
            return new If(...rawNode.arguments)
        case 'IfBlock':
            return new IfBlock(...rawNode.arguments)
        case 'Menu':
            return new Menu(O.none, ...rawNode.arguments)
        case 'MenuItem':
            return new MenuItem(...rawNode.arguments)
        case 'Pause':
            return new Pause(...rawNode.arguments)
        case 'Play':
            return new Play(...rawNode.arguments)
        case 'Video':
            return new PlayVideo(...rawNode.arguments)
        case 'PyExpr':
            return new PyExpr(...rawNode.arguments)
        case 'Say':
            return new Say(...rawNode.arguments)
        case 'Scene':
            return new Scene(...rawNode.arguments)
        case 'Show':
            return new Show(...rawNode.arguments)
        case 'ShowVideo':
            return new ShowVideo(...rawNode.arguments)
        case 'ShowWindow':
            return new ShowWindow(...rawNode.arguments)
        case 'Stop':
            return new Stop(...rawNode.arguments)
    }
}
