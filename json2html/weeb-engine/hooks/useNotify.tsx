/** @jsx jsx */
import { jsx } from '@emotion/core'
import { useState } from 'react'

import Notifications, { Notification } from '../components/Notifications'

const durationMs: number = 2000

interface NotifyHook {
    notifications: JSX.Element
    notify: (message: string) => void
}

const useNotify = (): NotifyHook => {
    const [notifs, setNotifs] = useState<Notification[]>([])

    const notifications = (
        <Notifications notifs={notifs} durationMs={durationMs} />
    )

    const notify = (message: string) => {
        const key = Date.now()
        setNotifs(_ => [..._, { key, message }])
        setTimeout(removeNotif(key), durationMs)
    }

    function removeNotif(key: number): () => void {
        return () => setNotifs(_ => _.filter(_ => _.key !== key))
    }

    return { notifications, notify }
}
export default useNotify
