import * as _ from 'lodash';

import { byteCount } from '../utils/utils';

import IObj from './IObj';
import QuickSave from './QuickSave';
import Save from './Save';
import Saves from './Saves';

import App from '../components/App';


export default class StorageService {
    private static nbSlots: number = 6;
    private static prefix: string = 'jpGame-';

    private static instance: StorageService | null = null;

    private storageKey: string;
    private saves: Saves;

    private constructor (app: App) {
        StorageService.instance = this;

        this.storageKey = StorageService.prefix + app.props.datas.gameName
                                                + ` (${app.props.datas.lang})`;

        /**
         * Set this.saves from localStorage[StorageService.storageKey]
         * of length nbSlots.
         * Won't return more than nbSlots Saves (even if there are more in
         * Storage).
         */
        const saves = localStorage.getItem(this.storageKey);
        let res: Saves | null = null;

        if (saves !== null) {
            let anySaves: any;
            try {
                anySaves = JSON.parse(saves);
            } catch (e) {
                console.warn('Error while parsing localStorage:', e);
            }
            res = Saves.fromAny(anySaves);
        }

        this.saves = res === null
            ? new Saves(null, _.times(StorageService.nbSlots, _.constant(null)))
            : res;
        this.loadSaves();
    }

    static getInstance(app: App): StorageService {
        if (StorageService.instance === null) {
            StorageService.instance = new StorageService(app);
        }

        return StorageService.instance;
    }

    private loadSaves() {
        _.forEach(this.saves.slots, (save: Save | null) => {
            if (save !== null) {
                if (save.gameProps.sceneImg !== null) {
                    save.gameProps.sceneImg.load();
                }
                _.forEach(save.gameProps.charImgs, img => { img.load(); });
            }
        });
    }

    private setSaves(saves: Array<Save | null>) {
        this.saves.slots = _.take(saves, StorageService.nbSlots);
    }

    private setSave(iSlot: number, newSave: Save) {
        if (_.inRange(iSlot, StorageService.nbSlots)) {
            this.saves.slots[iSlot] = newSave;
        }
    }

    private store() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.saves));
    }

    getSaves(): Array<Save | null> {
        return this.saves.slots;
    }

    storeSave(newSave: Save, iSlot: number) {
        this.setSave(iSlot, newSave);
        this.store();
    }

    getQuickSave(): QuickSave | null {
        return this.saves.quickSave;
    }

    storeQuickSave(quickSave: QuickSave, onSave: () => void) {
        this.saves.quickSave = quickSave;
        this.store();
        onSave();
    }

    // for Memory submenu
    // get all games
    allJPGamesStorages(): IObj<number> {
        const res: IObj<number> = {};
        _(localStorage).keys()
                       .filter(key => _.startsWith(key, StorageService.prefix))
                       .forEach(key => {
                           const value = localStorage.getItem(key);
                           if (value !== null) {
                               const k = key.replace(StorageService.prefix, '');
                              res[k] = byteCount(value);
                           }
                       });
        return res;
    }

    // delete one game
    removeItem(key: string) {
        const keyWithPrefix = StorageService.prefix+key;
        localStorage.removeItem(keyWithPrefix);
        if (keyWithPrefix === this.storageKey) {
            this.setSaves(_.times(StorageService.nbSlots, _.constant(null)));
            this.saves.quickSave = null;
        }
    }
}
