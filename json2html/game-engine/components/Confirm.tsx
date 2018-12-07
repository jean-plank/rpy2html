import * as React from 'react';
import * as _ from 'lodash';

import '../styles/Confirm.css';

import App from './App';
import MenuButton, { IButton } from './MenuButton';

import IObj from '../classes/IObj';
import IKeyboardHandler from '../classes/IKeyboardHandler';


interface IProps {
    app: App;
    msg: string;
    buttons: IButton[];
    escapeAction?: () => void;
}

export default class Confirm extends React.Component<IProps> implements IKeyboardHandler {
    render() {
        const buttons = _.map(this.props.buttons, (btn: IButton, i: number) => {
            const f = (e: React.MouseEvent) => {
                e.stopPropagation();
                if (btn.action !== undefined) btn.action(e);
                this.props.app.hideConfirm();
            };
            return <MenuButton key={i} text={btn.text} action={f} />;
        });

        return (
            <div className='Confirm'
                 onClick={this.onClickBg}>
                <div className='frame'
                     onClick={this.onClickFrame}>
                    <div className='msg'
                         dangerouslySetInnerHTML={{ __html: this.props.msg }} />
                    <div className='items'>{buttons}</div>
                </div>
            </div>
        );
    }

    onKeyUp(e: React.KeyboardEvent) {
        const keyEvents: IObj<(e: React.KeyboardEvent) => void> = {
            Escape: evt => {
                evt.stopPropagation();
                if (this.props.escapeAction !== undefined) {
                    this.props.escapeAction();
                }
                this.props.app.hideConfirm();
            },
        };
        if (_.has(keyEvents, e.key)) keyEvents[e.key](e);
    }

    private onClickBg = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (this.props.escapeAction !== undefined) this.props.escapeAction();
        this.props.app.hideConfirm();
    }

    private onClickFrame = (e: React.MouseEvent) => {
        e.stopPropagation();
    }
}
