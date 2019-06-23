import { Do } from 'fp-ts-contrib/lib/Do';
import { head, init, last, tail } from 'fp-ts/lib/Array';
import { none, Option, option, some } from 'fp-ts/lib/Option';
import { Reducer } from 'react';

export class HistoryState<S> {
    past: S[];
    present: Option<S>;
    future: S[];

    static empty = <S>(): HistoryState<S> => ({
        past: [],
        present: none,
        future: []
    })
}

interface Action<T = any> {
    type: T;
}

export type HistoryAction<S> =
    | { type: 'UNDO' }
    | { type: 'REDO' }
    | { type: 'EMPTY' }
    | { type: 'RESET'; past: S[]; present: S };

const historiable = <S, A extends Action>(
    empty: S,
    reducer: Reducer<S, A>
): Reducer<HistoryState<S>, HistoryAction<S> | A> => (
    prevState: HistoryState<S>,
    action: HistoryAction<S>
): HistoryState<S> => {
    const { past, present: maybePresent, future } = prevState;

    if (action.type === 'UNDO') {
        return Do(option)
            .bind('present', maybePresent)
            .bindL('newPast', () => init(past))
            .bindL('previous', () => last(past))
            .return(({ newPast, previous, present }) => ({
                past: newPast,
                present: some(previous),
                future: [present, ...future]
            }))
            .getOrElse(prevState);
    }

    if (action.type === 'REDO') {
        return Do(option)
            .bind('present', maybePresent)
            .bindL('next', () => head(future))
            .bindL('newFuture', () => tail(future))
            .return(({ present, next, newFuture }) => ({
                past: [...past, present],
                present: some(next),
                future: newFuture
            }))
            .getOrElse(prevState);
    }

    if (action.type === 'EMPTY') return HistoryState.empty();

    if (action.type === 'RESET') {
        return {
            past: action.past,
            present: some(action.present),
            future: []
        };
    }

    return maybePresent.foldL(
        () => ({
            past,
            present: some(reducer(empty, action)),
            future: []
        }),
        present => {
            const newPresent = reducer(present, action);
            if (present === newPresent) return prevState;
            return {
                past: [...past, present],
                present: some(newPresent),
                future: []
            };
        }
    );
};
export default historiable;
