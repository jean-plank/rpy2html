import * as React from 'react';
import * as _ from 'lodash';

import '../styles/Notifications.css';

export default class Notifications extends React.Component {
    private div: HTMLDivElement | null = null;

    render() {
        return <div className='Notifications' ref={this.setRef} />;
    }

    notify(txt: string) {
        if (this.div !== null) {
            const notif = document.createElement('div');
            notif.textContent = txt;
            this.div.appendChild(notif);
            setTimeout(() => {
                notif.classList.add('reduce');
                setTimeout(() => {
                    if (this.div !== null) this.div.removeChild(notif);
                }, 1500);
            }, 1500);
        }
    }

    private setRef = (div: HTMLDivElement | null) => {
        this.div = div;
    }
}
