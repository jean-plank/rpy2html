/** @jsx jsx */
import { css, jsx, keyframes, SerializedStyles } from '@emotion/core'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import {
    CSSProperties,
    forwardRef,
    FunctionComponent,
    RefForwardingComponent,
    useImperativeHandle,
    useMemo,
    useState
} from 'react'
import { TransitionStatus } from 'react-transition-group/Transition'

import { style, transl } from '../../context'
import { getBgOrElse, ifOldStyle, mediaQuery } from '../../utils/styles'
import AnimateWithDep from '../AnimateWithDep'
import GuiButton from '../GuiButton'
import SelectableButton from '../SelectableButton'
import MenuBtn, { menuBtnLabel } from './MenuBtn'

const durationMs: number = 100

export interface MenuAble {
    selectedBtn: O.Option<MenuBtn>
    setSelectedBtn: (btn: O.Option<MenuBtn>) => void
    setOverlay: (overlay: MenuOverlay) => void
}

interface Props {
    overlay: MenuOverlay
    buttons: BtnWithAction[]
    returnAction?: (e: React.MouseEvent) => void
    submenu: (btn: MenuBtn) => JSX.Element | null
    selectedBtn?: O.Option<MenuBtn>
    styles?: SerializedStyles
}

interface BtnWithAction {
    btn: MenuBtn
    specialAction?: O.Option<(e: React.MouseEvent) => void>
}

const Menu: RefForwardingComponent<MenuAble, Props> = (
    {
        overlay,
        buttons,
        returnAction,
        submenu,
        selectedBtn: propsSelectedBtn = O.none,
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
    const [selectedBtn, setSelectedBtn] = useState<O.Option<MenuBtn>>(
        propsSelectedBtn
    )

    const dep = useMemo(() => O.getOrElse(() => 'NONE')(selectedBtn), [
        selectedBtn
    ])

    return (
        <div css={[styles.menu, stylesOverride]}>
            <div className={overlayClassName} />
            <div css={styles.menuBar}>
                {buttons.map(menuBtn)}
                {returnBtn()}
            </div>
            <AnimatedDiv
                dep={dep}
                animation={animations.leftToRight}
                styles={styles.submenuTitle}
            >
                {ifSelectedBtn(menuBtnLabel)}
            </AnimatedDiv>
            <AnimatedDiv
                dep={dep}
                animation={animations.rightToLeft}
                styles={styles.submenu}
            >
                {ifSelectedBtn(submenu)}
            </AnimatedDiv>
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
        return pipe(
            selectedBtn,
            O.fold(() => null, f)
        )
    }

    function menuBtn(
        { btn, specialAction = O.none }: BtnWithAction,
        key: number
    ): JSX.Element {
        return (
            <SelectableButton
                key={key}
                onClick={onClick}
                selected={pipe(
                    selectedBtn,
                    O.exists(_ => _ === btn)
                )}
                styles={styles.btn}
            >
                {menuBtnLabel(btn)}
            </SelectableButton>
        )

        function onClick(e: React.MouseEvent) {
            pipe(
                specialAction,
                O.fold(
                    () => {
                        setSelectedBtn(O.some(btn))
                        setOverlay(MenuOverlay.GameMenu)
                    },
                    action => action(e)
                )
            )
        }
    }

    function unselectSubmenu() {
        setSelectedBtn(O.none)
        setOverlay(overlay)
    }
}
export default forwardRef<MenuAble, Props>(Menu)

const AnimatedDiv: FunctionComponent<{
    dep?: string | number;
    animation: {
        initial: SerializedStyles;
        animation: SerializedStyles;
    };
    styles: SerializedStyles;
}> = ({ dep, animation, styles: containerStyles, children }) => (
    <AnimateWithDep dep={dep} durationMs={durationMs} styles={containerStyles}>
        {status => (
            <div
                css={[
                    styles.full,
                    animation.initial,
                    stylesFromStatus(animation.animation)(status)
                ]}
            >
                {children}
            </div>
        )}
    </AnimateWithDep>
)

function stylesFromStatus(
    style: SerializedStyles
): (status: TransitionStatus) => SerializedStyles | undefined {
    return status => {
        if (status === 'entering') return style
        if (status === 'entered') return styles.noTransform
        return undefined
    }
}

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
    }),

    full: css({
        width: '100%',
        height: '100%'
    }),

    noTransform: css({
        transform: 'none'
    })
}

const animations = {
    topToBottom: animation({
        from: { transform: 'translateY(-100%)' },
        to: { transform: 'translateY(0)' }
    }),

    leftToRight: animation({
        from: { transform: 'translateX(-100%)' },
        to: { transform: 'translateX(0)' }
    }),

    rightToLeft: animation({
        from: { transform: 'translateX(100%)' },
        to: { transform: 'translateX(0)' }
    })
}

function animation({
    from,
    to
}: {
    from: CSSProperties;
    to: CSSProperties;
}): { initial: SerializedStyles; animation: SerializedStyles } {
    return {
        initial: css({ ...from }),
        animation: css({
            animation: `${keyframes({
                from: { ...from },
                to: { ...to }
            })} ${durationMs}ms forwards`
        })
    }
}
