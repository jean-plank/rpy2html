import * as t from 'io-ts'
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable'

export const CharType = t.strict({
    name: t.string,
    color: optionFromNullable(t.string)
})

type Char = t.TypeOf<typeof CharType>
export default Char
