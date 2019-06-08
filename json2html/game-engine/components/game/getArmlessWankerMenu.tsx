import * as React from 'react';
import { FunctionComponent } from 'react';

import * as styles from './__style/ArmlessWankerMenu.css';

import Context from '../../app/Context';
import GameService from '../../services/game/GameService';
import GameMenuBtn from '../menus/gameMenu/GameMenuBtn';
import MenuButton from '../menus/MenuButton';

interface Args {
    context: Context;
    gameService: GameService;
    showGameMenu: (btn?: GameMenuBtn) => void;
}

interface Props {
    disableUndo: boolean;
    disableQuickLoad: boolean;
}

export type ArmlessWankerMenuType = FunctionComponent<Props>;

const getArmlessWankerMenu = ({
    context: { transl },
    gameService,
    showGameMenu
}: Args): ArmlessWankerMenuType => ({ disableUndo, disableQuickLoad }) => {
    return (
        <div className={styles.armlessWankerMenu}>
            <MenuButton
                text={transl.menu.back}
                onClick={withStopPropagation(gameService.undo)}
                disabled={disableUndo}
                className={styles.menuButton}
            />
            <MenuButton
                text={transl.menu.history}
                onClick={showGameMenuWSP(GameMenuBtn.History)}
                className={styles.menuButton}
            />
            <MenuButton
                text={transl.menu.save}
                onClick={showGameMenuWSP(GameMenuBtn.Save)}
                className={styles.menuButton}
            />
            <MenuButton
                text={transl.menu.qSave}
                onClick={withStopPropagation(gameService.quickSave)}
                className={styles.menuButton}
            />
            <MenuButton
                text={transl.menu.qLoad}
                onClick={withStopPropagation(gameService.quickLoad)}
                disabled={disableQuickLoad}
                className={styles.menuButton}
            />
            <MenuButton
                text={transl.menu.pause}
                onClick={showGameMenuWSP()}
                className={styles.menuButton}
            />
        </div>
    );

    function showGameMenuWSP(btn?: GameMenuBtn): (e: React.MouseEvent) => void {
        return withStopPropagation(() => showGameMenu(btn));
    }

    function withStopPropagation(f: () => void): (e: React.MouseEvent) => void {
        return (e: React.MouseEvent) => {
            e.stopPropagation();
            f();
        };
    }
};
export default getArmlessWankerMenu;
