import * as A from 'fp-ts/lib/Array'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import { createRef, RefObject } from 'react'

import { KeyUpAble } from '../components/App'

const useAppKeyUpAbles = (): {
    topKeyUpAble: () => O.Option<KeyUpAble>;
    viewKeyUpAble: RefObject<KeyUpAble>;
    confirmKeyUpAble: RefObject<KeyUpAble>;
} => {
    const viewKeyUpAble = createRef<KeyUpAble>()
    const confirmKeyUpAble = createRef<KeyUpAble>()

    const topKeyUpAble = () =>
        pipe(
            [confirmKeyUpAble, viewKeyUpAble],
            A.findFirstMap(_ => O.fromNullable(_.current))
        )

    return { topKeyUpAble, viewKeyUpAble, confirmKeyUpAble }
}
export default useAppKeyUpAbles
