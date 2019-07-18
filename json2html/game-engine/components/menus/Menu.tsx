/** @jsx jsx */
import { css, jsx, SerializedStyles } from '@emotion/core'
import { none, Option, some } from 'fp-ts/lib/Option'
import {
    forwardRef,
    RefForwardingComponent,
    useImperativeHandle,
    useState
} from 'react'

import { style, transl } from '../../context'
import { getBgOrElse, ifOldStyle, mediaQuery } from '../../utils/styles'
import GuiButton from '../GuiButton'
import SelectableButton from '../SelectableButton'
import MenuBtn, { menuBtnLabel } from './MenuBtn'

export interface MenuAble {
    selectedBtn: Option<MenuBtn>
    setSelectedBtn: (btn: Option<MenuBtn>) => void
    setOverlay: (overlay: MenuOverlay) => void
}

interface Props {
    overlay: MenuOverlay
    buttons: BtnWithAction[]
    returnAction?: (e: React.MouseEvent) => void
    submenu: (btn: MenuBtn) => JSX.Element | null
    selectedBtn?: Option<MenuBtn>
    styles?: SerializedStyles
}

interface BtnWithAction {
    btn: MenuBtn
    specialAction?: Option<(e: React.MouseEvent) => void>
}

const Menu: RefForwardingComponent<MenuAble, Props> = (
    {
        overlay,
        buttons,
        returnAction,
        submenu,
        selectedBtn: propsSelectedBtn = none,
        styles: stylesOverride
    },
    ref
) => {
    useImperativeHandle(ref, () => ({
        selectedBtn,
        setSelectedBtn,
        setOverlay
    }))

    const [overlayClassName, setOverlay] = useState<MenuOverlay>(overlay)
    const [selectedBtn, setSelectedBtn] = useState<Option<MenuBtn>>(
        propsSelectedBtn
    )

    return (
        <div css={[styles.menu, stylesOverride]}>
            <div className={overlayClassName} />
            <div css={styles.menuBar}>
                {buttons.map(menuBtn)}
                {returnBtn()}
            </div>
            <div css={styles.submenuTitle}>{ifSelectedBtn(menuBtnLabel)}</div>
            <div css={styles.submenu}>{ifSelectedBtn(submenu)}</div>
        </div>
    )

    function returnBtn(): JSX.Element | null {
        return ifSelectedBtn(() => (
            <GuiButton
                onClick={
                    returnAction === undefined ? unselectSubmenu : returnAction
                }
                css={[styles.btn, styles.returnBtn]}
            >
                {transl.menu.return}
            </GuiButton>
        ))
    }

    function ifSelectedBtn<T>(f: (btn: MenuBtn) => T): T | null {
        return selectedBtn.fold(null, f)
    }

    function menuBtn(
        { btn, specialAction = none }: BtnWithAction,
        key: number
    ): JSX.Element {
        return (
            <SelectableButton
                key={key}
                onClick={onClick}
                selected={selectedBtn.exists(_ => _ === btn)}
                styles={styles.btn}
            >
                {menuBtnLabel(btn)}
            </SelectableButton>
        )

        function onClick(e: React.MouseEvent) {
            specialAction.foldL(
                () => {
                    setSelectedBtn(some(btn))
                    setOverlay(MenuOverlay.GameMenu)
                },
                action => action(e)
            )
        }
    }

    function unselectSubmenu() {
        setSelectedBtn(none)
        setOverlay(overlay)
    }
}
export default forwardRef<MenuAble, Props>(Menu)

export enum MenuOverlay {
    MainMenu = 'main-menu-overlay',
    GameMenu = 'game-menu-overlay'
}

const styles = {
    menu: css({
        display: 'flex',
        backgroundSize: '100% 100%',
        position: 'absolute',
        outline: 'none',
        height: '100%',
        width: '100%',
        fontFamily: style.mmenu_ffamily,
        fontSize: `${style.mmenu_fsize_h}vh`,
        [mediaQuery(style)]: {
            fontSize: `${style.mmenu_fsize_v}vw`
        },

        [`& .${MenuOverlay.MainMenu}, & .${MenuOverlay.GameMenu}`]: {
            position: 'absolute',
            height: '100%',
            width: '100%',
            backgroundSize: '100% 100%'
        },

        [`& .${MenuOverlay.MainMenu}`]: {
            ...getBgOrElse('main_menu_overlay')
        },

        [`& .${MenuOverlay.GameMenu}`]: {
            ...getBgOrElse('game_menu_overlay', 'rgba(19, 24, 25, 0.75)')
        }
    }),

    menuBar: css({
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        width: style.mmenuitems_width,
        ...ifOldStyle({
            backgroundColor: 'rgba(19, 24, 25, 0.75)'
        })
    }),

    btn: css({
        padding: style.guibtn_padding,
        height: style.guibtn_height
    }),

    returnBtn: css({
        position: 'absolute',
        bottom: '1em'
    }),

    submenuTitle: css({
        position: 'absolute',
        top: '1%',
        padding: '0.33em 0.67em',
        fontSize: `${style.title_fsize_h}vh`,
        color: style.accent_color,
        [mediaQuery(style)]: {
            fontSize: `${style.title_fsize_v}vw`
        }
    }),

    submenu: css({
        position: 'relative',
        height: '100%',
        width: style.submenu_width,
        fontFamily: style.guibtn_ffamily,
        fontSize: `${style.guibtn_fsize_h}vh`,
        [mediaQuery(style)]: {
            fontSize: `${style.guibtn_fsize_v}vw`
        }
    })
}
