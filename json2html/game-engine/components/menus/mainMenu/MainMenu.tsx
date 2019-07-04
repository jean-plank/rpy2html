/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { none, Option, some } from 'fp-ts/lib/Option';
import { lookup, StrMap } from 'fp-ts/lib/StrMap';
import {
    forwardRef,
    KeyboardEvent,
    RefForwardingComponent,
    useImperativeHandle,
    useState
} from 'react';

import { transl } from '../../../context';
import QuickSave from '../../../storage/QuickSave';
import Save from '../../../storage/Save';
import { getBgOrElse } from '../../../utils/styles';
import { KeyUpAble } from '../../App';
import Help from '../Help';
import MenuButton from '../MenuButton';
import menuStyles, { gameMenuOverlay, mainMenuOverlay } from '../menuStyles';
import SaveSlots from '../SaveSlots';
import Memory from './Memory';

enum Btn {
    None,
    Load,
    Memory,
    Help
}

interface Props {
    startGame: () => void;
    saves: Array<Option<Save>>;
    emptySaves: () => void;
    loadSave: (save: QuickSave) => void;
    deleteSave: (slot: number) => void;
    confirmYesNo: (
        message: string,
        actionYes: () => void,
        actionNo?: () => void
    ) => void;
}

const MainMenu: RefForwardingComponent<KeyUpAble, Props> = (
    { startGame, saves, emptySaves, loadSave, deleteSave, confirmYesNo },
    ref
) => {
    useImperativeHandle(ref, () => ({ onKeyUp }));

    const [overlayClassName, setOverlay] = useState<string>(mainMenuOverlay);
    const [selectedBtn, setSelectedBtn] = useState<Btn>(Btn.None);
    const [submenu, setSubmenu] = useState<Option<JSX.Element>>(none);

    return (
        <div css={[menuStyles.menu, mainMenuStyles]}>
            <div className={overlayClassName} />
            <div css={menuStyles.menuBar}>
                <MenuButton onClick={startGame}>{transl.menu.start}</MenuButton>
                <MenuButton
                    onClick={showLoad}
                    selected={selectedBtn === Btn.Load}
                >
                    {transl.menu.load}
                </MenuButton>
                <MenuButton
                    onClick={showMemory}
                    selected={selectedBtn === Btn.Memory}
                >
                    {transl.menu.memory}
                </MenuButton>
                <MenuButton
                    onClick={showHelp}
                    selected={selectedBtn === Btn.Help}
                >
                    {transl.menu.help}
                </MenuButton>
            </div>
            <div css={menuStyles.submenuTitle}>{submenuTitle()}</div>
            <div css={menuStyles.submenu}>{submenu.toNullable()}</div>
        </div>
    );

    function submenuTitle(): string {
        switch (selectedBtn) {
            case Btn.Load:
                return transl.menu.load;
            case Btn.Memory:
                return transl.menu.memory;
            case Btn.Help:
                return transl.menu.help;
            case Btn.None:
                return '';
        }
    }

    function showLoad() {
        setOverlay(gameMenuOverlay);
        setSelectedBtn(Btn.Load);
        setSubmenu(
            some(
                <SaveSlots
                    saves={saves}
                    onClick={onClick}
                    deleteSave={deleteSave}
                />
            )
        );

        function onClick(_: number, save: Option<Save>) {
            save.map(loadSave);
        }
    }

    function showMemory() {
        setOverlay(gameMenuOverlay);
        setSelectedBtn(Btn.Memory);
        setSubmenu(
            some(<Memory emptySaves={emptySaves} confirmYesNo={confirmYesNo} />)
        );
    }

    function showHelp() {
        setOverlay(gameMenuOverlay);
        setSelectedBtn(Btn.Help);
        setSubmenu(some(<Help />));
    }

    function onKeyUp(e: KeyboardEvent) {
        const keyEvents = new StrMap<(e: KeyboardEvent) => void>({
            Escape: e => {
                if (selectedBtn !== Btn.None) {
                    e.stopPropagation();
                    setOverlay(mainMenuOverlay);
                    setSubmenu(none);
                    setSelectedBtn(Btn.None);
                }
            }
        });
        lookup(e.key, keyEvents).map(_ => _(e));
    }
};
export default forwardRef<KeyUpAble, Props>(MainMenu);

const mainMenuStyles = css({
    fontSize: 'inherit',
    ...getBgOrElse('main_menu_bg', '#5f777f')
});
