import * as React from 'react';


export interface IButton {
    text: string;
    action?: (e: React.MouseEvent) => void;
    selected?: boolean;
}

export default class MenuButton extends React.Component<IButton> {
    render() {
        const classes = `MenuButton${this.props.selected?' selected':''}`;

        return (
            <button className={classes} onClick={this.props.action}>
                {this.props.text}
            </button>
        );
    }
}
