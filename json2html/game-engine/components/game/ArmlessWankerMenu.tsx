/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Option, some } from 'fp-ts/lib/Option';
import { FunctionComponent } from 'react';

import { style, transl } from '../../context';
import { mediaQuery } from '../../utils/styles';
import withStopPropagation from '../../utils/withStopPropagation';
import GuiButton from '../GuiButton';
import { MenuBtn } from '../menus/Menu';

interface BtnProps {
    onClick: (e: React.MouseEvent) => void;
    disabled?: boolean;
}

const AWButton: FunctionComponent<BtnProps> = ({
    onClick,
    disabled,
    children
}) => (
    <GuiButton {...{ onClick, disabled }} css={styles.button}>
        {children}
    </GuiButton>
);

export interface ArmlessWankerMenuProps {
    showGameMenu: (btn?: Option<MenuBtn>) => void;
    undo: () => void;
    disableUndo: boolean;
    skip: () => void;
    quickSave: () => void;
    quickLoad: () => void;
    disableQuickLoad: boolean;
}

const ArmlessWankerMenu: FunctionComponent<ArmlessWankerMenuProps> = ({
    showGameMenu,
    undo,
    disableUndo,
    skip,
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
            <AWButton onClick={showGameMenuWSP(some('HISTORY'))}>
                {transl.menu.history}
            </AWButton>
            <AWButton onClick={withStopPropagation(skip)}>
                {transl.menu.skip}
            </AWButton>
            <AWButton onClick={showGameMenuWSP(some('SAVE'))}>
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

    function showGameMenuWSP(
        btn?: Option<MenuBtn>
    ): (e: React.MouseEvent) => void {
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
        width: '100%'
    }),

    button: css({
        margin: '0 1em',
        fontSize: `${style.quickbtn_fsize_h}vh`,
        [mediaQuery(style)]: {
            fontSize: `${style.quickbtn_fsize_v}vw`
        }
    })
};
