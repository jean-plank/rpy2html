import * as t from 'io-ts'

export const RawNodeType = t.strict({
    class_name: t.string,
    arguments: t.array(t.unknown)
})

type RawNode = t.TypeOf<typeof RawNodeType>
export default RawNode
