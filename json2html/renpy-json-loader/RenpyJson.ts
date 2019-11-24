import * as t from 'io-ts'

import Char, { CharType } from './Char'
import Font, { FontType } from './Font'
import Node, { NodeType } from './Node'
import Obj, { ObjType } from './Obj'
import Style, { StyleType } from './Style'

export const RawRenpyJsonType = t.strict({
    game_name: t.string,
    lang: t.string,
    images: ObjType(t.string),
    sounds: ObjType(t.string),
    videos: ObjType(t.string),
    characters: ObjType(CharType),
    nodes: ObjType(NodeType),
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
    nodes: Obj<Node>
    fonts: Obj<Font>
    style: Style
}
