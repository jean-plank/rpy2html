import * as t from 'io-ts'

export const NodeType = t.strict({
    class_name: t.string,
    arguments: t.array(t.unknown)
})

type Node = t.TypeOf<typeof NodeType>
export default Node
