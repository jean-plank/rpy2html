import * as React from 'react';

import '../styles/Textbox.css';

import Char from '../classes/Char';


interface IProps {
    hide: boolean;
    char: Char | null;
    text: string;
}

export default class Textbox extends React.Component<IProps> {
    render() {
        const textboxStyle = this.props.hide ? { display: 'none' } : {};

        const charStyle = this.props.char !== null
            ? { color: this.props.char.color }
            : {};

        const charName = this.props.char !== null ? this.props.char.name : '';

        return (
            <div className='Textbox' style={textboxStyle}>
                <div className='namebox' style={charStyle}>{charName}</div>
                <div className='dialog'>{this.props.text}</div>
            </div>
        );
    }
}
