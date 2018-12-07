import * as _ from 'lodash';

import { byteCount, blocksFromHist } from '../utils/utils';

import IObj from './IObj';
import Block from './Block';
import QuickSave from './QuickSave';
import Save from './Save';
import Saves from './Saves';
import { IGameProps } from './GameProps';

import App from '../components/App';


export default class StorageService {
    private static nbSlots: number = 6;
    private static prefix: string = 'jpGame-';

    private static instance: StorageService | null = null;

    private storageKey: string;
    private saves: Saves;

    static getInstance(app: App): StorageService {
        if (StorageService.instance === null) {
            StorageService.instance = new StorageService(app);
        }
        return StorageService.instance;
    }

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
        const res: Saves | null = (() => {
            if (saves !== null) {
                const anySaves: any = (() => {
                    try {
                        return JSON.parse(saves);
                    } catch (e) {
                        console.warn('Error while parsing localStorage:', e);
                    }
                })();
                return Saves.fromAny(anySaves);
            } else return null;
        })();

        this.saves = res === null
            ? new Saves(null, _.times(StorageService.nbSlots, _.constant(null)))
            : res;
        this.loadSaves(app);
    }

    private loadSaves(app: App) {
        _.forEach(this.saves.slots, (save: Save | null) => {
            if (save !== null) {
                const block: Block | undefined = _.last(
                    blocksFromHist(save.history, [app.props.datas.nodes[0]])
                );
                if (block !== undefined) {
                    const props: IGameProps = block[1];
                    if (props.sceneImg !== null) props.sceneImg.load();
                    _.forEach(props.charImgs, img => { img.load(); });
                }
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

    storeQuickSave(quickSave: QuickSave) {
        this.saves.quickSave = quickSave;
        this.store();
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
