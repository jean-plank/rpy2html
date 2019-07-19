import * as O from 'fp-ts/lib/Option'

import { RawChar } from '../renpy-json-loader/RenpyJson'

export default class Char {
    name: string
    color: O.Option<string>

    static fromRawChar = ({ name, color }: RawChar): Char => ({
        name,
        color: O.fromNullable(color)
    })
}
