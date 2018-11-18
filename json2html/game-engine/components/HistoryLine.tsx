import * as React from 'react';
import * as _ from 'lodash';
import Char from 'game-engine/classes/Char';


interface IProps {
    char: Char | null;
    text: string;
}

export default class HistoryLine extends React.Component<IProps> {
    render() {
        const charStyle = this.props.char !== null
            ? { color: this.props.char.color }
            : {};

        const charName = this.props.char !== null ? this.props.char.name : '';

        return (
            <div className='HistoryLine'>
                <div className='who' style={charStyle}>{charName}</div>
                <div className='what'>{this.props.text}</div>
            </div>
        );
    }
}
