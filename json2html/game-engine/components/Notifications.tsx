/** @jsx jsx */
import { css, jsx, keyframes } from '@emotion/core'
import { FunctionComponent } from 'react'

import { style } from '../context'
import { mediaQuery } from '../utils/styles'

interface Props {
    notifs: Notification[]
    durationMs: number
}

export interface Notification {
    key: number
    message: string
}

const Notifications: FunctionComponent<Props> = ({ notifs, durationMs }) => (
    <div css={styles.notifications}>
        {notifs.map(({ key, message }) => (
            <div key={key} css={styles.notification(durationMs)}>
                {message}
            </div>
        ))}
    </div>
)
export default Notifications

const styles = {
    notifications: css({
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        outline: 'none',
        fontFamily: style.guibtn_ffamily,
        fontSize: `${style.guibtn_fsize_h}vh`,
        [mediaQuery(style)]: {
            fontSize: `${style.guibtn_fsize_v}vw`
        }
    }),

    notification: (durationMs: number) =>
        css({
            boxSizing: 'content-box',
            display: 'inline-block',
            padding: '1em',
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            animation: `${fadeOut()} ${durationMs / 1000}s linear forwards`
        })
}

function fadeOut() {
    return keyframes({
        '0%': { opacity: 0.9 },
        '67%': { opacity: 0.9 },
        '100%': { opacity: 0 }
    })
}
