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
import Preferences from '../Preferences';
import SaveSlots from '../SaveSlots';
import GameMenuBtn, { gameMenuBtnLabel } from './GameMenuBtn';
import History from './History';

interface Props {
    history: AstNode[];
    saves: Array<Option<Save>>;
    loadSave: (save: QuickSave) => void;
    deleteSave: (slot: number) => void;
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
        deleteSave,
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

    const btns: Array<[GameMenuBtn, (e: React.MouseEvent) => void]> = [
        ['RESUME', hideGameMenu],
        ['HISTORY', selectBtn('HISTORY')],
        ['SAVE', selectBtn('SAVE')],
        ['LOAD', selectBtn('LOAD')],
        ['PREFS', selectBtn('PREFS')],
        ['MAIN_MENU', confirmMainMenu],
        ['HELP', selectBtn('HELP')]
    ];

    return (
        <div css={menuStyles.menu}>
            <div className={gameMenuOverlay} />
            <div css={menuStyles.menuBar}>{btns.map(menuBtn)}</div>
            <div css={menuStyles.submenuTitle}>
                {gameMenuBtnLabel(selectedBtn)}
            </div>
            <div css={menuStyles.submenu}>{getSubmenu().toNullable()}</div>
        </div>
    );

    function menuBtn(
        [btn, onClick]: [GameMenuBtn, (e: React.MouseEvent) => void],
        key: number
    ): JSX.Element {
        return (
            <MenuButton
                key={key}
                onClick={onClick}
                selected={selectedBtn === btn}
            >
                {gameMenuBtnLabel(btn)}
            </MenuButton>
        );
    }

    function selectBtn(btn: GameMenuBtn): () => void {
        return () => setSelectedBtn(btn);
    }

    function getSubmenu(): Option<JSX.Element> {
        if (selectedBtn === 'HISTORY') return some(<History nodes={history} />);
        if (selectedBtn === 'SAVE') return some(getSave());
        if (selectedBtn === 'LOAD') return some(getLoad());
        if (selectedBtn === 'PREFS') return some(<Preferences />);
        if (selectedBtn === 'HELP') return some(<Help />);
        return none;
    }

    function getSave(): JSX.Element {
        return (
            <SaveSlots
                saves={saves}
                onClick={onClick}
                deleteSave={deleteSave}
            />
        );

        function onClick(slot: number, existingSave: Option<Save>) {
            existingSave.foldL(
                () => save(slot),
                _ => confirmYesNo(transl.confirm.override, () => save(slot))
            );
        }
    }

    function getLoad(): JSX.Element {
        return (
            <SaveSlots
                saves={saves}
                onClick={onClick}
                deleteSave={deleteSave}
            />
        );

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
