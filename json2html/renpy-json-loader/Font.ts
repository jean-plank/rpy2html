import * as t from 'io-ts'

export const FontType = t.strict({
    src: t.string,
    bold: t.boolean
})

type Font = t.TypeOf<typeof FontType>
export default Font
