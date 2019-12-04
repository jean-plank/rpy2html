import * as t from 'io-ts'

import Char, { CharType } from './Char'
import Font, { FontType } from './Font'
import Obj, { ObjType } from './Obj'
import RawNode, { RawNodeType } from './RawNode'
import Style, { StyleType } from './Style'

export const RawRenpyJsonType = t.strict({
    game_name: t.string,
    lang: t.string,
    images: ObjType(t.string),
    sounds: ObjType(t.string),
    videos: ObjType(t.string),
    characters: ObjType(CharType),
    nodes: ObjType(RawNodeType),
    fonts: ObjType(FontType),
    style: StyleType
})

export type RawRenpyJson = t.TypeOf<typeof RawRenpyJsonType>

export default interface RenpyJson {
    game_name: string
    lang: string
    help: string
    images: Obj<string>
    sounds: Obj<string>
    videos: Obj<string>
    characters: Obj<Char>
    nodes: Obj<RawNode>
    fonts: Obj<Font>
    style: Style
}
