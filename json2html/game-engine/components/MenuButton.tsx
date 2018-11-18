import * as React from 'react';

import '../styles/MenuButton.css';


export interface IButton {
    text: string;
    action?: (e: React.MouseEvent) => void;
    selected?: boolean;
    disabled?: boolean;
}

export default class MenuButton extends React.Component<IButton> {
    render() {
        const selected = this.props.selected ? 'selected' : '';

        return (
            <button className={`MenuButton ${selected}`}
                    onClick={this.props.action}
                    disabled={this.props.disabled}>
                {this.props.text}
            </button>
        );
    }
}
