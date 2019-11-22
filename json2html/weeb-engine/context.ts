import * as E from 'fp-ts/lib/Either'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import * as R from 'fp-ts/lib/Record'
import * as t from 'io-ts'

import Char from '../renpy-json-loader/Char'
import Font from '../renpy-json-loader/Font'
import Node from '../renpy-json-loader/Node'
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

function parseNode(rawNode: Node): AstNode {
    const res = [
        E.alt(() => If.decode(rawNode)),
        E.alt(() => IfBlock.decode(rawNode)),
        E.alt(() => Menu.decode(rawNode)),
        E.alt(() => MenuItem.decode(rawNode)),
        E.alt(() => Pause.decode(rawNode)),
        E.alt(() => Play.decode(rawNode)),
        E.alt(() => PlayVideo.decode(rawNode)),
        E.alt(() => PyExpr.decode(rawNode)),
        E.alt(() => Say.decode(rawNode)),
        E.alt(() => Scene.decode(rawNode)),
        E.alt(() => Show.decode(rawNode)),
        E.alt(() => ShowVideo.decode(rawNode)),
        E.alt(() => ShowWindow.decode(rawNode)),
        E.alt(() => Stop.decode(rawNode))
    ].reduce<E.Either<t.Errors, AstNode>>(
        (acc, decode) => pipe(acc, decode),
        Hide.decode(rawNode)
    )

    return pipe(
        res,
        E.fold(
            errors => {
                console.error(
                    "Couldn't parse node:",
                    '\nrawNode =',
                    rawNode,
                    '\nerrors =',
                    errors
                )
                throw new Error("Couldn't parse nodes")
            },
            _ => _
        )
    )
}
