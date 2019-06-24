/** @jsx jsx */
import { jsx } from '@emotion/core';
import { none, Option, some } from 'fp-ts/lib/Option';
import { lookup, StrMap } from 'fp-ts/lib/StrMap';
import {
    forwardRef,
    RefForwardingComponent,
    useImperativeHandle,
    useState
} from 'react';

import { transl } from '../../../context';
import AstNode from '../../../nodes/AstNode';
import QuickSave from '../../../storage/QuickSave';
import Save from '../../../storage/Save';
import { KeyUpAble } from '../../App';
import Help from '../Help';
import MenuButton from '../MenuButton';
import menuStyles, { gameMenuOverlay } from '../menuStyles';
import SaveSlots from '../SaveSlots';
import GameMenuBtn from './GameMenuBtn';
import History from './History';

interface Props {
    history: AstNode[];
    saves: Array<Option<Save>>;
    loadSave: (save: QuickSave) => void;
    hideGameMenu: () => void;
    showMainMenu: () => void;
    save: (slot: number) => void;
    confirmYesNo: (
        msg: string,
        actionYes: () => void,
        actionNo?: () => void
    ) => void;
    selectedBtn?: GameMenuBtn;
}

const GameMenu: RefForwardingComponent<KeyUpAble, Props> = (
    {
        history,
        saves,
        loadSave,
        hideGameMenu,
        showMainMenu,
        save,
        confirmYesNo,
        selectedBtn: propsSelectedBtn = 'NONE'
    },
    ref
) => {
    useImperativeHandle(ref, () => ({ onKeyUp }));

    const [selectedBtn, setSelectedBtn] = useState<GameMenuBtn>(
        propsSelectedBtn
    );

    return (
        <div css={menuStyles.menu}>
            <div className={gameMenuOverlay} />
            <div css={menuStyles.menuBar}>
                <MenuButton onClick={hideGameMenu}>
                    {transl.menu.resume}
                </MenuButton>
                <MenuButton
                    onClick={selectBtn('HISTORY')}
                    selected={isSelected('HISTORY')}
                >
                    {transl.menu.history}
                </MenuButton>
                <MenuButton
                    onClick={selectBtn('SAVE')}
                    selected={isSelected('SAVE')}
                >
                    {transl.menu.save}
                </MenuButton>
                <MenuButton
                    onClick={selectBtn('LOAD')}
                    selected={isSelected('LOAD')}
                >
                    {transl.menu.load}
                </MenuButton>
                <MenuButton
                    onClick={confirmMainMenu}
                    selected={isSelected('MAIN_MENU')}
                >
                    {transl.menu.mainMenu}
                </MenuButton>
                <MenuButton
                    onClick={selectBtn('HELP')}
                    selected={isSelected('HELP')}
                >
                    {transl.menu.help}
                </MenuButton>
            </div>
            <div css={menuStyles.submenuTitle}>{submenuTitle()}</div>
            <div css={menuStyles.submenu}>{getSubmenu().toNullable()}</div>
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
            case 'HISTORY':
                return transl.menu.history;
            case 'SAVE':
                return transl.menu.save;
            case 'LOAD':
                return transl.menu.load;
            case 'MAIN_MENU':
                return transl.menu.mainMenu;
            case 'HELP':
                return transl.menu.help;
            case 'NONE':
                return '';
        }
    }

    function getSubmenu(): Option<JSX.Element> {
        switch (selectedBtn) {
            case 'HISTORY':
                return some(<History nodes={history} />);
            case 'SAVE':
                return some(getSave());
            case 'LOAD':
                return some(getLoad());
            case 'HELP':
                return some(<Help />);
            default:
                return none;
        }
    }

    function getSave(): JSX.Element {
        return <SaveSlots saves={saves} onClick={onClick} />;

        function onClick(iSlot: number, existingSave: Option<Save>) {
            existingSave.foldL(
                () => save(iSlot),
                _ => confirmYesNo(transl.confirm.override, () => save(iSlot))
            );
        }
    }

    function getLoad(): JSX.Element {
        return <SaveSlots saves={saves} onClick={onClick} />;

        function onClick(_: number, save: Option<Save>) {
            save.map(_ =>
                confirmYesNo(transl.confirm.unsaved, () => save.map(loadSave))
            );
        }
    }

    function confirmMainMenu() {
        setSelectedBtn('MAIN_MENU');
        confirmYesNo(transl.confirm.unsaved, showMainMenu, () =>
            setSelectedBtn('NONE')
        );
    }

    function onKeyUp(e: React.KeyboardEvent) {
        const keyEvents: StrMap<(e: React.KeyboardEvent) => void> = new StrMap({
            Escape: e => {
                e.stopPropagation();
                hideGameMenu();
            }
        });
        lookup(e.key, keyEvents).map(_ => _(e));
    }
};
export default forwardRef<KeyUpAble, Props>(GameMenu);
