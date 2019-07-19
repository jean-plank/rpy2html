import { Do } from 'fp-ts-contrib/lib/Do'
import * as A from 'fp-ts/lib/Array'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import { Reducer } from 'react'

export class HistoryState<S> {
    past: S[]
    present: O.Option<S>
    future: S[]

    static empty = <S>(): HistoryState<S> => ({
        past: [],
        present: O.none,
        future: []
    })
}

interface Action<T = any> {
    type: T
}

export type HistoryAction<S> =
    | { type: 'UNDO' }
    | { type: 'REDO' }
    | { type: 'EMPTY' }
    | { type: 'RESET'; past: S[]; present: S }

const historiable = <S, A extends Action>(
    empty: S,
    reducer: Reducer<S, A>
): Reducer<HistoryState<S>, HistoryAction<S> | A> => (
    prevState: HistoryState<S>,
    action: HistoryAction<S>
): HistoryState<S> => {
    const { past, present: maybePresent, future } = prevState

    if (action.type === 'UNDO') {
        return pipe(
            Do(O.option)
                .bind('present', maybePresent)
                .bindL('newPast', () => A.init(past))
                .bindL('previous', () => A.last(past))
                .return(({ newPast, previous, present }) => ({
                    past: newPast,
                    present: O.some(previous),
                    future: [present, ...future]
                })),
            O.getOrElse(() => prevState)
        )
    }

    if (action.type === 'REDO') {
        return pipe(
            Do(O.option)
                .bind('present', maybePresent)
                .bindL('next', () => A.head(future))
                .bindL('newFuture', () => A.tail(future))
                .return(({ present, next, newFuture }) => ({
                    past: [...past, present],
                    present: O.some(next),
                    future: newFuture
                })),
            O.getOrElse(() => prevState)
        )
    }

    if (action.type === 'EMPTY') return HistoryState.empty()

    if (action.type === 'RESET') {
        return {
            past: action.past,
            present: O.some(action.present),
            future: []
        }
    }

    return pipe(
        maybePresent,
        O.fold(
            () => ({
                past,
                present: O.some(reducer(empty, action)),
                future: []
            }),
            present => {
                const newPresent = reducer(present, action)
                if (present === newPresent) return prevState
                return {
                    past: [...past, present],
                    present: O.some(newPresent),
                    future: []
                }
            }
        )
    )
}
export default historiable
