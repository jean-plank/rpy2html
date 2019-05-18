import { none, Option, some } from 'fp-ts/lib/Option';
import { lookup, StrMap } from 'fp-ts/lib/StrMap';
import * as React from 'react';
import { FunctionComponent, KeyboardEvent, useState } from 'react';

import * as menuStyles from '../__style/menus.css';
import * as mainMenuStyles from './__style/MainMenu.css';

import Context from '../../../app/Context';
import GameService from '../../../services/game/GameService';
import Save from '../../../services/storage/Save';
import StorageService from '../../../services/storage/StorageService';
import MenuButton from '../MenuButton';
import getMemory from './getMemory';

enum Btn {
    None,
    Load,
    Memory,
    Help
}

interface Props {
    context: Context;
    storageService: StorageService;
    gameService: GameService;
}

const MainMenu: FunctionComponent<Props> = ({
    context,
    storageService,
    gameService
}) => {
    const [overlayClassName, setOverlay] = useState<string>(
        menuStyles.mainMenuOverlay
    );
    const [selectedBtn, setSelectedBtn] = useState<Btn>(Btn.None);
    const [submenu, setSubmenu] = useState<Option<JSX.Element>>(none);

    const Memory = getMemory({ context, storageService });
    const { transl, SaveSlots, help } = context;

    return (
        <div
            className={`${menuStyles.menu} ${mainMenuStyles.mainMenu}`}
            tabIndex={1}
            onKeyUp={onKeyUp}
        >
            <div className={overlayClassName} />
            <div className={menuStyles.menuBar}>
                <MenuButton
                    text={transl.menu.start}
                    onClick={gameService.start}
                />
                <MenuButton
                    text={transl.menu.load}
                    onClick={showLoad}
                    selected={selectedBtn === Btn.Load}
                />
                <MenuButton
                    text={transl.menu.memory}
                    onClick={showMemory}
                    selected={selectedBtn === Btn.Memory}
                />
                <MenuButton
                    text={transl.menu.help}
                    onClick={showHelp}
                    selected={selectedBtn === Btn.Help}
                />
            </div>
            <div className={menuStyles.submenuTitle}>{submenuTitle()}</div>
            <div className={menuStyles.submenu}>{submenu.toNullable()}</div>
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
        const load = (_: number, save: Option<Save>) =>
            save.map(_ => gameService.restoreSave(_.history));
        setOverlay(menuStyles.gameMenuOverlay);
        setSelectedBtn(Btn.Load);
        setSubmenu(
            some(<SaveSlots action={load} saves={storageService.getSaves()} />)
        );
    }

    function showMemory() {
        setOverlay(menuStyles.gameMenuOverlay);
        setSelectedBtn(Btn.Memory);
        setSubmenu(some(<Memory />));
    }

    function showHelp() {
        setOverlay(menuStyles.gameMenuOverlay);
        setSelectedBtn(Btn.Help);
        setSubmenu(some(help));
    }

    function onKeyUp(e: KeyboardEvent) {
        const keyEvents = new StrMap<(e: KeyboardEvent) => void>({
            Escape: e => {
                if (selectedBtn !== Btn.None) {
                    e.stopPropagation();
                    setOverlay(menuStyles.mainMenuOverlay);
                    setSubmenu(none);
                    setSelectedBtn(Btn.None);
                }
            }
        });
        lookup(e.key, keyEvents).map(_ => _(e));
    }
};

export default MainMenu;
