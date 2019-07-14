import { Do } from 'fp-ts-contrib/lib/Do'
import { tryCatch2v } from 'fp-ts/lib/Either'
import {
    fromEither,
    fromNullable,
    none,
    Option,
    option
} from 'fp-ts/lib/Option'
import * as t from 'io-ts'

import { nbSlots, storageKey } from '../context'
import QuickSave, { QuickSaveType } from './QuickSave'
import Save, { SaveType } from './Save'

export const SavesType = t.exact(
    t.type({
        quickSave: t.union([t.null, QuickSaveType]),
        slots: t.array(t.union([t.null, SaveType]))
    })
)
type RawSaves = t.TypeOf<typeof SavesType>

export default class Saves {
    quickSave: Option<QuickSave>
    slots: Array<Option<Save>>

    static empty: Saves = {
        quickSave: none,
        slots: Array.from({ length: nbSlots }, _ => none)
    }

    static fromNullable = (rawSaves: RawSaves): Saves => ({
        quickSave: fromNullable(rawSaves.quickSave),
        slots: rawSaves.slots.map(fromNullable)
    })

    static toNullable = (saves: Saves): RawSaves => ({
        quickSave: saves.quickSave.toNullable(),
        slots: saves.slots.map(_ => _.toNullable())
    })

    static fromStorage = (): Saves =>
        Do(option)
            .bindL('storage', () =>
                fromNullable(localStorage.getItem(storageKey))
            )
            .bindL('parsed', ({ storage }) =>
                fromEither(
                    tryCatch2v<unknown, void>(
                        () => JSON.parse(storage),
                        _ =>
                            console.warn('Error while parsing localStorage:', _)
                    )
                )
            )
            .bindL('rawSaves', ({ parsed }) =>
                fromEither(SavesType.decode(parsed))
            )
            .return(({ rawSaves }) => Saves.fromNullable(rawSaves))
            .getOrElse(Saves.empty)

    static store = (saves: Saves) =>
        localStorage.setItem(
            storageKey,
            JSON.stringify(SavesType.encode(Saves.toNullable(saves)))
        )
}
