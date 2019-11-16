import * as t from 'io-ts'

export const ObjType = <A extends t.Mixed>(codec: A): t.RecordC<t.StringC, A> =>
    t.record(t.string, codec)

type Obj<A> = Record<string, A>
export default Obj
