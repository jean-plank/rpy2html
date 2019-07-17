/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { fromNullable } from 'fp-ts/lib/Option'
import { lookup, StrMap } from 'fp-ts/lib/StrMap'
import { forwardRef, RefForwardingComponent, useImperativeHandle } from 'react'

import { style } from '../context'
import { getBgOrElse, ifOldStyle, mediaQuery } from '../utils/styles'
import withStopPropagation from '../utils/withStopPropagation'
import { KeyUpAble } from './App'
import GuiButton from './GuiButton'

interface Button {
    text: string
    onClick?: () => void
    selected?: boolean
    disabled?: boolean
}

export interface ConfirmProps {
    hideConfirm: () => void
    message: string
    buttons: Button[]
    escapeAction?: () => void
}

// hideConfirm will always be called after escapeAction
const RawConfirm: RefForwardingComponent<KeyUpAble, ConfirmProps> = (
    { hideConfirm, message, buttons, escapeAction },
    ref
) => {
    useImperativeHandle(ref, () => ({ onKeyUp }))

    return (
        <div css={styles.confirm} onClick={onClickBg}>
            <div css={styles.frame} onClick={stopPropagation}>
                <div
                    css={styles.message}
                    dangerouslySetInnerHTML={{ __html: message }}
                />
                <div css={styles.items}>{buttonsElts()}</div>
            </div>
        </div>
    )

    function buttonsElts(): JSX.Element[] {
        return buttons.map((btn: Button, i: number) => (
            <GuiButton
                key={i}
                onClick={withStopPropagation(() => {
                    fromNullable(btn.onClick).map(_ => _())
                    hideConfirm()
                })}
            >
                {btn.text}
            </GuiButton>
        ))
    }

    function onKeyUp(e: KeyboardEvent) {
        const keyEvents = new StrMap<(e: KeyboardEvent) => void>({
            Escape: onClickBg
        })
        lookup(e.key, keyEvents).map(_ => _(e))
    }

    function onClickBg(e: React.SyntheticEvent | Event) {
        withStopPropagation(() => {
            fromNullable(escapeAction).map(_ => _())
            hideConfirm()
        })(e)
    }

    function stopPropagation(e: React.MouseEvent) {
        e.stopPropagation()
    }
}
const Confirm = forwardRef<KeyUpAble, ConfirmProps>(RawConfirm)
export default Confirm

const styles = {
    confirm: css({
        position: 'absolute',
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        outline: 'none',
        fontFamily: style.mmenu_ffamily,
        fontSize: `${style.mmenu_fsize_h}vh`,
        ...getBgOrElse('confirm_overlay', 'rgba(19, 24, 25, 0.25)'),
        [mediaQuery(style)]: {
            fontSize: `${style.mmenu_fsize_v}vw`
        }
    }),

    frame: css({
        backgroundSize: '100% 100%',
        display: 'flex',
        flexDirection: 'column',
        padding: style.confirmframe_padding,
        ...getBgOrElse('frame_bg', 'black'),
        ...ifOldStyle({
            border: '3px solid #0095c7'
        })
    }),

    message: css({
        textAlign: 'center'
    }),

    items: css({
        display: 'flex',
        justifyContent: 'space-around',
        marginTop: '1.67em'
    })
}
