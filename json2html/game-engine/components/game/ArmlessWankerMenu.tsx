/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { FunctionComponent } from 'react';

import { style, transl } from '../../context';
import { mediaQuery } from '../../utils/styles';
import withStopPropagation from '../../utils/withStopPropagation';
import Button from '../Button';
import GameMenuBtn from '../menus/gameMenu/GameMenuBtn';

interface BtnProps {
    onClick: (e: React.MouseEvent) => void;
    disabled?: boolean;
}

const AWButton: FunctionComponent<BtnProps> = ({
    onClick,
    disabled,
    children
}) => (
    <Button {...{ onClick, disabled }} css={styles.button}>
        {children}
    </Button>
);

export interface ArmlessWankerMenuProps {
    showGameMenu: (btn?: GameMenuBtn) => void;
    undo: () => void;
    disableUndo: boolean;
    quickSave: () => void;
    quickLoad: () => void;
    disableQuickLoad: boolean;
}

const ArmlessWankerMenu: FunctionComponent<ArmlessWankerMenuProps> = ({
    showGameMenu,
    disableUndo,
    undo,
    quickSave,
    quickLoad,
    disableQuickLoad
}) => {
    return (
        <div css={styles.armlessWankerMenu}>
            <AWButton
                onClick={withStopPropagation(undo)}
                disabled={disableUndo}
            >
                {transl.menu.back}
            </AWButton>
            <AWButton onClick={showGameMenuWSP('HISTORY')}>
                {transl.menu.history}
            </AWButton>
            <AWButton onClick={showGameMenuWSP('SAVE')}>
                {transl.menu.save}
            </AWButton>
            <AWButton onClick={withStopPropagation(quickSave)}>
                {transl.menu.qSave}
            </AWButton>
            <AWButton
                onClick={withStopPropagation(quickLoad)}
                disabled={disableQuickLoad}
            >
                {transl.menu.qLoad}
            </AWButton>
            <AWButton onClick={showGameMenuWSP()}>{transl.menu.pause}</AWButton>
        </div>
    );

    function showGameMenuWSP(btn?: GameMenuBtn): (e: React.MouseEvent) => void {
        return withStopPropagation(() => showGameMenu(btn));
    }
};
export default ArmlessWankerMenu;

const styles = {
    armlessWankerMenu: css({
        display: 'flex',
        justifyContent: 'center',
        paddingBottom: '0.2em',
        height: 'auto',
        bottom: 0,
        position: 'absolute',
        width: '100%',
        fontSize: `${style.quickbtn_fsize_h}vh`
    }),

    button: css({
        margin: '0 1em',
        [mediaQuery(style)]: {
            fontSize: `${style.quickbtn_fsize_v}vw`
        }
    })
};