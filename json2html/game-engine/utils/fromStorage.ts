import { Do } from 'fp-ts-contrib/lib/Do'
import { Either, tryCatch2v } from 'fp-ts/lib/Either'
import { fromEither, fromNullable, option } from 'fp-ts/lib/Option'

const fromStorage = <A, B>(
    storageKey: string,
    decode: (parsed: unknown) => Either<any, A>,
    fromRaw: (raw: A) => B,
    defaultValue: B
): B =>
    Do(option)
        .bindL('storage', () => fromNullable(localStorage.getItem(storageKey)))
        .bindL('parsed', ({ storage }) =>
            fromEither(
                tryCatch2v<unknown, void>(
                    () => JSON.parse(storage),
                    _ => console.warn('Error while parsing localStorage:', _)
                )
            )
        )
        .bindL('rawSaves', ({ parsed }) => fromEither(decode(parsed)))
        .return(({ rawSaves }) => fromRaw(rawSaves))
        .getOrElse(defaultValue)
export default fromStorage
