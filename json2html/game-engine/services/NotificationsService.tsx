import * as React from 'react';
import { createRef, RefObject } from 'react';

import { fromNullable } from 'fp-ts/lib/Option';
import Notifications, { Notifiable } from '../components/Notifications';

export default class NotificationsService {
    element: JSX.Element;

    private notifiable: RefObject<Notifiable> = createRef();

    constructor() {
        this.element = <Notifications ref={this.notifiable} />;
    }

    init = ({}) => {};

    notify = (message: string) =>
        fromNullable(this.notifiable.current).map(_ => _.notify(message))
}
