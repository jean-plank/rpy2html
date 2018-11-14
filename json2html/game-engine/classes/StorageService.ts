import * as _ from 'lodash';

import { byteCount } from '../utils/utils';

import IObj from './IObj';
import Save from './Save';

import App from '../components/App';


export default class StorageService {
    private static nbSlots: number = 6;
    private static prefix: string = 'jpGame-';

    private static instance: StorageService | null = null;

    private storageKey: string;
    private saves: Array<Save | null>;

    private constructor (app: App) {
        StorageService.instance = this;

        this.storageKey = StorageService.prefix + app.props.datas.gameName;

        /**
         * Set this.saves from localStorage[StorageService.storageKey]
         * of length nbSlots.
         * Won't return more than nbSlots Saves (even if there are more in Storage).
         */
        const saves = localStorage.getItem(this.storageKey);
        if (saves !== null) {
            let anySaves: any;
            try {
                anySaves = JSON.parse(saves);
                if (_.isArray(anySaves)) {
                    this.setSaves(_.map((anySaves as any[]), Save.fromAny));
                    this.loadSaves();
                    return;
                }
            } catch (e) {
                console.warn('Error while parsing localStorage:', e);
            }
        }
        this.setSaves(_.times(StorageService.nbSlots, _.constant(null)));
    }

    static getInstance(app: App): StorageService {
        if (StorageService.instance === null)
            StorageService.instance = new StorageService(app);

        return StorageService.instance;
    }

    private loadSaves() {
        _.forEach(this.saves, (save: Save | null) => {
            if (save !== null) {
                if (save.gameProps.sceneImg !== null)
                    save.gameProps.sceneImg.load();
                _.forEach(save.gameProps.charImgs, img => { img.load(); });
            }
        });
    }

    private setSaves(saves: Array<Save | null>) {
        this.saves = _.take(saves, StorageService.nbSlots);
    }

    private setSave(iSlot: number, newSave: Save) {
        if (_.inRange(iSlot, StorageService.nbSlots))
            this.saves[iSlot] = newSave;
    }

    getSaves(): Array<Save | null> {
        return this.saves;
    }

    storeSave(newSave: Save, iSlot: number) {
        console.log('storing', newSave, '\non slot', iSlot);
        this.setSave(iSlot, newSave);
        localStorage.setItem(this.storageKey, JSON.stringify(this.saves));
    }

    allJPGamesStorages(): IObj<number> {
        const res: IObj<number> = {};
        _(localStorage).keys()
                       .filter(key => _.startsWith(key, StorageService.prefix))
                       .forEach(key => {
                           const value = localStorage.getItem(key);
                           if (value !== null)
                              res[key.replace(StorageService.prefix, '')] =
                                  byteCount(value);
                       });
        return res;
    }

    removeItem(key: string) {
        const keyWithPrefix = StorageService.prefix+key;
        localStorage.removeItem(keyWithPrefix);
        if (keyWithPrefix === this.storageKey) {
            this.setSaves(_.times(StorageService.nbSlots, _.constant(null)));
        }
    }
}
