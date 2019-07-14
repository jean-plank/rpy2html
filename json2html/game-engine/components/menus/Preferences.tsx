/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { FunctionComponent, useEffect, useState } from 'react'

import { style, transl } from '../../context'
import MenuButton, { BtnProps } from './MenuButton'

const PrefsBtn: FunctionComponent<BtnProps> = ({
    onClick,
    selected = false,
    disabled,
    children
}) => (
    <div css={styles.btn.container}>
        <div
            css={styles.btn.rect}
            className={selected ? 'selected' : undefined}
        />
        <MenuButton
            {...{ onClick, disabled, selected }}
            styles={styles.btn.menuBtn}
        >
            {children}
        </MenuButton>
    </div>
)

const Preferences: FunctionComponent = () => {
    const [isFullscreen, setIsFullscreen] = useState(document.fullscreen)

    useEffect(
        () =>
            (document.onfullscreenchange = () =>
                setIsFullscreen(document.fullscreen)),
        []
    )

    return (
        <div css={styles.container}>
            {document.fullscreenEnabled ? display() : null}
        </div>
    )

    function display(): JSX.Element {
        return (
            <div css={styles.group}>
                <div css={styles.title}>{transl.prefs.display}</div>
                <PrefsBtn onClick={windowed} selected={!isFullscreen}>
                    {transl.prefs.window}
                </PrefsBtn>
                <PrefsBtn onClick={fullscreen} selected={isFullscreen}>
                    {transl.prefs.fullscreen}
                </PrefsBtn>
            </div>
        )
    }

    function windowed() {
        document.exitFullscreen()
    }

    function fullscreen() {
        document.body.requestFullscreen({ navigationUI: 'hide' })
    }
}
export default Preferences

const styles = {
    container: css({
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center'
    }),

    group: css({
        marginLeft: '4%'
    }),

    title: css({
        color: style.accent_color,
        paddingBottom: '0.2em'
    }),

    btn: {
        container: css({
            display: 'flex',
            alignItems: 'center'
        }),

        rect: css({
            flexShrink: 0,
            width: '0.3em',
            height: '1em',

            '&.selected': {
                backgroundColor: style.accent_color
            }
        }),

        menuBtn: css({
            flexShrink: 0
        })
    }
}
