import { fromNullable, none, Option, some } from 'fp-ts/lib/Option';
import { lookup, StrMap } from 'fp-ts/lib/StrMap';
import * as React from 'react';
import {
    forwardRef,
    ForwardRefExoticComponent,
    Reducer,
    RefAttributes,
    useImperativeHandle,
    useReducer,
    useState
} from 'react';

import * as menuStyles from '../__style/menus.css';

import Context from '../../../app/Context';
import AstNode from '../../../nodes/AstNode';
import ConfirmService from '../../../services/ConfirmService';
import GameService from '../../../services/game/GameService';
import GameMenuService from '../../../services/GameMenuService';
import KeyUpAble from '../../../services/KeyUpAble';
import Save from '../../../services/storage/Save';
import StorageService from '../../../services/storage/StorageService';
import MenuButton from '../MenuButton';
import GameMenuBtn from './GameMenuBtn';
import History from './History';

interface Args {
    context: Context;
    storageService: StorageService;
    confirmService: ConfirmService;
    gameMenuService: GameMenuService;
    gameService: GameService;
}

interface Props {
    getHistory: () => AstNode[];
    selectedBtn?: GameMenuBtn;
}

export type GameMenuType = ForwardRefExoticComponent<
    Props & RefAttributes<KeyUpAble>
>;

const getGameMenu = ({
    context: { transl, SaveSlots, help },
    storageService,
    confirmService,
    gameMenuService,
    gameService
}: Args): GameMenuType =>
    forwardRef(({ getHistory, selectedBtn: propsSelectedBtn }, ref) => {
        useImperativeHandle(ref, () => ({ onKeyUp }));

        const [selectedBtn, setSelectedBtn] = useState<GameMenuBtn>(
            fromNullable(propsSelectedBtn).getOrElse(GameMenuBtn.None)
        );
        const [, forceUpdate] = useReducer<Reducer<number, void>>(
            _ => _ + 1,
            0
        );

        const saves = storageService.getSaves();

        return (
            <div className={menuStyles.menu}>
                <div className={menuStyles.gameMenuOverlay} />
                <div className={menuStyles.menuBar}>
                    <MenuButton
                        text={transl.menu.resume}
                        onClick={gameMenuService.hide}
                    />
                    <MenuButton
                        text={transl.menu.history}
                        onClick={selectBtn(GameMenuBtn.History)}
                        selected={isSelected(GameMenuBtn.History)}
                    />
                    <MenuButton
                        text={transl.menu.save}
                        onClick={selectBtn(GameMenuBtn.Save)}
                        selected={isSelected(GameMenuBtn.Save)}
                    />
                    <MenuButton
                        text={transl.menu.load}
                        onClick={selectBtn(GameMenuBtn.Load)}
                        selected={isSelected(GameMenuBtn.Load)}
                    />
                    <MenuButton
                        text={transl.menu.mmenu}
                        onClick={confirmMainMenu}
                        selected={isSelected(GameMenuBtn.MMenu)}
                    />
                    <MenuButton
                        text={transl.menu.help}
                        onClick={selectBtn(GameMenuBtn.Help)}
                        selected={isSelected(GameMenuBtn.Help)}
                    />
                </div>
                <div className={menuStyles.submenuTitle}>{submenuTitle()}</div>
                <div className={menuStyles.submenu}>
                    {getSubmenu().toNullable()}
                </div>
            </div>
        );

        function isSelected(btn: GameMenuBtn): boolean {
            return selectedBtn === btn;
        }

        function selectBtn(btn: GameMenuBtn): () => void {
            return () => setSelectedBtn(btn);
        }

        function submenuTitle(): string {
            switch (selectedBtn) {
                case GameMenuBtn.History:
                    return transl.menu.history;
                case GameMenuBtn.Save:
                    return transl.menu.save;
                case GameMenuBtn.Load:
                    return transl.menu.load;
                case GameMenuBtn.MMenu:
                    return transl.menu.mmenu;
                case GameMenuBtn.Help:
                    return transl.menu.help;
                case GameMenuBtn.None:
                    return '';
            }
        }

        function getSubmenu(): Option<JSX.Element> {
            switch (selectedBtn) {
                case GameMenuBtn.History:
                    return some(<History nodes={gameService.historyNodes()} />);
                case GameMenuBtn.Save:
                    return some(getSave());
                case GameMenuBtn.Load:
                    return some(getLoad());
                case GameMenuBtn.Help:
                    return some(help);
                default:
                    return none;
            }
        }

        function getSave(): JSX.Element {
            return <SaveSlots saves={saves} onClick={maybeSave} />;

            function maybeSave(iSlot: number, existingSave: Option<Save>) {
                existingSave.foldL(
                    () => save(iSlot),
                    _ => confirmService.confirmOverride(() => save(iSlot))
                );
            }

            function save(iSlot: number) {
                storageService.storeSave(getHistory(), iSlot);
                forceUpdate();
            }
        }

        function getLoad(): JSX.Element {
            return (
                <SaveSlots saves={storageService.getSaves()} onClick={load} />
            );

            function load(_: number, maybeSave: Option<Save>) {
                maybeSave.map(save =>
                    confirmService.confirmYesNo(transl.confirm.unsaved, () =>
                        gameService.restoreSave(save)
                    )
                );
            }
        }

        function confirmMainMenu() {
            setSelectedBtn(GameMenuBtn.MMenu);
            confirmService.confirmMainMenu(() =>
                setSelectedBtn(GameMenuBtn.None)
            );
        }

        function onKeyUp(e: React.KeyboardEvent) {
            const keyEvents: StrMap<
                (e: React.KeyboardEvent) => void
            > = new StrMap({
                Escape: e => {
                    e.stopPropagation();
                    gameMenuService.hide();
                }
            });
            lookup(e.key, keyEvents).map(_ => _(e));
        }
    });
export default getGameMenu;
