import { last, take } from 'fp-ts/lib/Array';
import { tryCatch } from 'fp-ts/lib/Either';
import { constant } from 'fp-ts/lib/function';
import { fromEither, fromNullable, none, Option, some } from 'fp-ts/lib/Option';
import { insert, StrMap } from 'fp-ts/lib/StrMap';

import Context from '../../app/Context';
import AstNode from '../../nodes/AstNode';
import byteCount from './byteCount';
import QuickSave from './QuickSave';
import Save from './Save';
import Saves from './Saves';

interface Args {
    context: Context;
}

export default class StorageService {
    private static nbSlots: number = 6;
    private static prefix: string = 'jpGame-';

    private lang: string;
    private storageKey: string;
    private saves: Saves;

    init = ({
        context: {
            data: { gameName },
            lang,
            firstNode
        }
    }: Args) => {
        this.lang = lang;
        this.storageKey = StorageService.prefix + gameName + ` (${lang})`;

        /**
         * Set this.saves from `localStorage[StorageService.storageKey]`
         * of length nbSlots.
         * Won't return more than nbSlots Saves (even if there are more in
         * Storage).
         */
        this.saves = fromNullable(localStorage.getItem(this.storageKey))
            .chain(localSaves =>
                tryCatch<unknown>(() => JSON.parse(localSaves))
                    .fold(
                        _ => {
                            console.warn(
                                'Error while parsing localStorage:',
                                _
                            );
                            return none;
                        },
                        _ => some(_)
                    )
                    .chain(_ => fromEither(Saves.decode(_)))
            )
            .getOrElseL(
                () =>
                    new Saves(
                        none,
                        Array.from(
                            { length: StorageService.nbSlots },
                            constant(none)
                        )
                    )
            );
        this.loadSaves(firstNode);
    }

    private loadSaves = (firstNode: AstNode) =>
        this.saves.slots.forEach(_ =>
            _.map(_ =>
                fromEither(_.blocks(firstNode))
                    .chain(_ => last(_))
                    .map(([props]) => {
                        props.sceneImg.map(_ => _.load());
                        props.charImgs.forEach(_ => _.load());
                    })
            )
        )

    private setSaves = (saves: Array<Option<Save>>) =>
        (this.saves.slots = take(StorageService.nbSlots, saves))

    private setSave = (iSlot: number, newSave: Save) => {
        if (0 <= iSlot && iSlot < StorageService.nbSlots) {
            this.saves.slots[iSlot] = some(newSave);
        }
    }

    private store = () =>
        localStorage.setItem(
            this.storageKey,
            JSON.stringify(this.saves.encode())
        )

    getSaves = (): Array<Option<Save>> => this.saves.slots;

    storeSave = (history: AstNode[], iSlot: number) => {
        const date = new Date().toLocaleDateString(this.lang, {
            day: 'numeric',
            month: 'short',
            weekday: 'short',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });
        this.setSave(iSlot, Save.fromNodes(history, date));
        this.store();
    }

    getQuickSave = (): Option<QuickSave> => this.saves.quickSave;

    storeQuickSave = (history: AstNode[]) => {
        this.saves.quickSave = some(QuickSave.fromNodes(history));
        this.store();
    }

    // get all games for Memory submenu
    allJPGamesStorages = (): StrMap<number> =>
        Object.keys(localStorage)
            .filter(key => key.startsWith(StorageService.prefix))
            .reduce(
                (acc, key) =>
                    fromNullable(localStorage.getItem(key))
                        .map(_ =>
                            insert(
                                key.replace(StorageService.prefix, ''),
                                byteCount(_),
                                acc
                            )
                        )
                        .getOrElse(acc),
                new StrMap<number>({})
            )

    // delete one game
    removeItem = (key: string) => {
        const keyWithPrefix = StorageService.prefix + key;
        localStorage.removeItem(keyWithPrefix);
        if (keyWithPrefix === this.storageKey) {
            this.setSaves(
                Array.from({ length: StorageService.nbSlots }, constant(none))
            );
            this.saves.quickSave = none;
        }
    }
}
