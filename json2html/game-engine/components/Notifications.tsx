/** @jsx jsx */
import { css, jsx, keyframes } from '@emotion/core'
import {
    forwardRef,
    RefForwardingComponent,
    useImperativeHandle,
    useState
} from 'react'

import { style } from '../context'
import { mediaQuery } from '../utils/styles'

export interface Notifiable {
    notify: (message: string) => void
}

interface Notification {
    key: number
    message: string
}

const duration: number = 2000 // ms

const Notifications: RefForwardingComponent<Notifiable, {}> = (_, ref) => {
    const [notifs, setNotifs] = useState<Notification[]>([])

    useImperativeHandle(ref, () => ({
        notify: (message: string) => {
            const key = Date.now()
            setNotifs(_ => [..._, { key, message }])
            setTimeout(removeNotif(key), duration)
        }
    }))

    return (
        <div css={styles.notifications}>
            {notifs.map(({ key, message }) => (
                <div key={key} css={styles.notification}>
                    {message}
                </div>
            ))}
        </div>
    )

    function removeNotif(key: number): () => void {
        return () => setNotifs(_ => _.filter(_ => _.key !== key))
    }
}
export default forwardRef<Notifiable>(Notifications)

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

    notification: css({
        boxSizing: 'content-box',
        display: 'inline-block',
        padding: '1em',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        animation: `${fadeOut()} ${duration / 1000}s linear forwards`
    })
}

function fadeOut() {
    return keyframes({
        '0%': { opacity: 0.9 },
        '67%': { opacity: 0.9 },
        '100%': { opacity: 0 }
    })
}
