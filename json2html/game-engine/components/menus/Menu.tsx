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
import SelectableButton from '../SelectableButton'

export type MenuBtn =
    | 'START'
    | 'RESUME'
    | 'HISTORY'
    | 'SAVE'
    | 'LOAD'
    | 'PREFS'
    | 'MAIN_MENU'
    | 'MEMORY'
    | 'HELP'

const menuBtnLabel = (btn: MenuBtn): string => {
    switch (btn) {
        case 'START':
            return transl.menu.start
        case 'RESUME':
            return transl.menu.resume
        case 'HISTORY':
            return transl.menu.history
        case 'SAVE':
            return transl.menu.save
        case 'LOAD':
            return transl.menu.load
        case 'PREFS':
            return transl.menu.prefs
        case 'MAIN_MENU':
            return transl.menu.mainMenu
        case 'MEMORY':
            return transl.menu.memory
        case 'HELP':
            return transl.menu.help
    }
}

export interface MenuAble {
    selectedBtn: Option<MenuBtn>
    setSelectedBtn: (btn: Option<MenuBtn>) => void
    setOverlay: (overlay: MenuOverlay) => void
}

interface Props {
    overlay: MenuOverlay
    buttons: BtnWithAction[]
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
            <div css={styles.menuBar}>{buttons.map(menuBtn)}</div>
            <div css={styles.submenuTitle}>{ifSelectedBtn(menuBtnLabel)}</div>
            <div css={styles.submenu}>{ifSelectedBtn(submenu)}</div>
        </div>
    )

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
    }),

    btn: css({
        padding: style.guibtn_padding,
        height: style.guibtn_height
    })
}
