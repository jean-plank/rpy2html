import * as O from 'fp-ts/lib/Option'
import * as t from 'io-ts'

import { nbSlots, storageKey } from '../context'
import fromStorage from '../utils/fromStorage'
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
    quickSave: O.Option<QuickSave>
    slots: O.Option<Save>[]

    static empty: Saves = {
        quickSave: O.none,
        slots: Array.from({ length: nbSlots }, _ => O.none)
    }

    static fromNullable = (rawSaves: RawSaves): Saves => ({
        quickSave: O.fromNullable(rawSaves.quickSave),
        slots: rawSaves.slots.map(O.fromNullable)
    })

    static toNullable = (saves: Saves): RawSaves => ({
        quickSave: O.toNullable(saves.quickSave),
        slots: saves.slots.map(O.toNullable)
    })

    static fromStorage = (): Saves =>
        fromStorage<RawSaves, Saves>(
            storageKey,
            SavesType.decode,
            Saves.fromNullable,
            Saves.empty
        )

    static store = (saves: Saves) =>
        localStorage.setItem(
            storageKey,
            JSON.stringify(SavesType.encode(Saves.toNullable(saves)))
        )
}
