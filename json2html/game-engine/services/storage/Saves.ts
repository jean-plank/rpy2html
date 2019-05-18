import { Either } from 'fp-ts/lib/Either';
import { fromNullable, Option } from 'fp-ts/lib/Option';
import * as t from 'io-ts';

import QuickSave, { QuickSaveType } from './QuickSave';
import Save, { SaveType } from './Save';

export default class Saves {
    /**
     * Wraps quick save and save slots.
     */
    quickSave: Option<QuickSave>;
    slots: Array<Option<Save>>;

    constructor(quickSave: Option<QuickSave>, slots: Array<Option<Save>>) {
        this.quickSave = quickSave;
        this.slots = slots;
    }

    encode = (): ISaves =>
        SavesType.encode({
            quickSave: this.quickSave.toNullable(),
            slots: this.slots.map(_ => _.toNullable())
        })

    static decode = (saves: unknown): Either<t.Errors, Saves> =>
        SavesType.decode(saves).map(
            saves =>
                new Saves(
                    fromNullable(saves.quickSave).map(
                        save => new QuickSave(save.history)
                    ),
                    saves.slots.map(_ =>
                        fromNullable(_).map(
                            save => new Save(save.date, save.history)
                        )
                    )
                )
        )
}

const SavesType = t.exact(
    t.type({
        quickSave: t.union([t.null, QuickSaveType]),
        slots: t.array(t.union([t.null, SaveType]))
    })
);

type ISaves = t.TypeOf<typeof SavesType>;
