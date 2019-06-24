/** @jsx jsx */
import { css, jsx, keyframes } from '@emotion/core';
import {
    forwardRef,
    RefForwardingComponent,
    useImperativeHandle,
    useState
} from 'react';

import { style } from '../context';
import { mediaQuery } from '../utils/styles';

export interface Notifiable {
    notify: (message: string) => void;
}

const Notifications: RefForwardingComponent<Notifiable, {}> = (_, ref) => {
    const [notifs, setNotifs] = useState<JSX.Element[]>([]);

    useImperativeHandle(ref, () => ({
        notify: (message: string) => {
            const notif = (
                <div key={Math.random()} css={styles.notification}>
                    {message}
                </div>
            );
            setNotifs([...notifs, notif]);
            setTimeout(() => setNotifs(notifs.filter(_ => _ !== notif)), 2000);
        }
    }));

    return <div css={styles.notifications}>{notifs}</div>;
};
export default forwardRef<Notifiable>(Notifications);

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
        animation: `${fadeOut()} 1.5s linear forwards`
        // animation: `${reduce()} 1s linear 2s forwards`
    })
};

function fadeOut() {
    return keyframes({
        from: { opacity: 1 },
        to: { opacity: 0 }
    });
}

// function reduce() {
//     return keyframes({
//         '0%': {
//             opacity: 1,
//             padding: '1em',
//             height: '1em'
//         },
//         '50%': {
//             opacity: 0,
//             padding: '1em',
//             height: '1em'
//         },
//         '100%': {
//             opacity: 0,
//             padding: '0 1em',
//             height: 0
//         }
//     });
// }
