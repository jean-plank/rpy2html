import { Do } from 'fp-ts-contrib/lib/Do'
import * as E from 'fp-ts/lib/Either'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'

const fromStorage = <A, B>(
    storageKey: string,
    decode: (parsed: unknown) => E.Either<any, A>,
    fromRaw: (raw: A) => B,
    defaultValue: B
): B =>
    pipe(
        Do(O.option)
            .bind('storage', O.fromNullable(localStorage.getItem(storageKey)))
            .bindL('parsed', ({ storage }) =>
                O.fromEither(
                    E.tryCatch<unknown, void>(
                        () => JSON.parse(storage),
                        _ =>
                            console.warn('Error while parsing localStorage:', _)
                    )
                )
            )
            .bindL('rawSaves', ({ parsed }) => O.fromEither(decode(parsed)))
            .return(({ rawSaves }) => fromRaw(rawSaves)),
        O.getOrElse(() => defaultValue)
    )
export default fromStorage
