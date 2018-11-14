import * as React from 'react';
import * as _ from 'lodash';

import '../styles/Choices.css';

import Choice from '../classes/Choice';


interface IProps {
    choices: Choice[];
}

export default class Choices extends React.Component<IProps> {
    render() {
        const choices = _.map(this.props.choices, (choice: Choice, i: number) =>
            <button key={i} onClick={choice.action}>{choice.text}</button>);

        return <div className="Choices">{choices}</div>;
    }
}
