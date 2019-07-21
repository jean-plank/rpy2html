/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import * as O from 'fp-ts/lib/Option'
import { FunctionComponent } from 'react'

import { style, transl } from '../../context'
import { HistoryHook } from '../../hooks/useHistory'
import { SavesHook } from '../../hooks/useSaves'
import { mediaQuery } from '../../utils/styles'
import withStopPropagation from '../../utils/withStopPropagation'
import GuiButton from '../GuiButton'
import MenuBtn, { menuBtnLabel } from '../menus/MenuBtn'

interface BtnProps {
    onClick: (e: React.MouseEvent) => void
    disabled?: boolean
}

const AWButton: FunctionComponent<BtnProps> = ({
    onClick,
    disabled,
    children
}) => (
    <GuiButton {...{ onClick, disabled }} css={styles.button}>
        {children}
    </GuiButton>
)

export interface ArmlessWankerMenuProps {
    showGameMenu: (btn?: O.Option<MenuBtn>) => void
    quickLoad: () => void
    savesHook: SavesHook
    historyHook: HistoryHook
}

const ArmlessWankerMenu: FunctionComponent<ArmlessWankerMenuProps> = ({
    showGameMenu,
    quickLoad,
    savesHook: { quickSave, noQuickSave },
    historyHook: { undo, noPast, skip }
}) => {
    return (
        <div css={styles.armlessWankerMenu}>
            <AWButton onClick={withStopPropagation(undo)} disabled={noPast()}>
                {transl.armless.back}
            </AWButton>
            {showGameMenuBtn('HISTORY')}
            <AWButton onClick={withStopPropagation(skip)}>
                {transl.armless.skip}
            </AWButton>
            {showGameMenuBtn('SAVE')}
            <AWButton onClick={withStopPropagation(quickSave)}>
                {transl.armless.qSave}
            </AWButton>
            <AWButton
                onClick={withStopPropagation(quickLoad)}
                disabled={noQuickSave()}
            >
                {transl.armless.qLoad}
            </AWButton>
            {showGameMenuBtn('PREFS')}
        </div>
    )

    function showGameMenuBtn(btn: MenuBtn): JSX.Element {
        return (
            <AWButton
                onClick={withStopPropagation(() => showGameMenu(O.some(btn)))}
            >
                {menuBtnLabel(btn)}
            </AWButton>
        )
    }
}
export default ArmlessWankerMenu

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
}
