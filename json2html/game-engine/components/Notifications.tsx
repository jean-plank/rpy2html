import * as React from 'react';
import {
    forwardRef,
    RefForwardingComponent,
    useImperativeHandle,
    useState
} from 'react';

import * as styles from './__style/Notifications.css';

export interface Notifiable {
    notify: (message: string) => void;
}

const Notifications: RefForwardingComponent<Notifiable> = (_, ref) => {
    const [notifs, setNotifs] = useState<JSX.Element[]>([]);

    useImperativeHandle(ref, () => ({
        notify: (message: string) => {
            const notif = (
                <div key={Math.random()} className={styles.notification}>
                    {message}
                </div>
            );
            setNotifs([...notifs, notif]);
            setTimeout(() => setNotifs(notifs.filter(_ => _ !== notif)), 2000);
        }
    }));

    return <div className={styles.notifications}>{notifs}</div>;
};
export default forwardRef(Notifications);
