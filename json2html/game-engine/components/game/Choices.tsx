import * as React from 'react';
import { FunctionComponent } from 'react';

import * as styles from './__style/Choices.css';

import Choice from '../../models/Choice';

interface Props {
    choices: Choice[];
}

const Choices: FunctionComponent<Props> = props => {
    const choices = props.choices.map((choice, i) => (
        <button key={i} className={styles.choice} onClick={choice.action}>
            {choice.text}
        </button>
    ));
    return <div className={styles.choices}>{choices}</div>;
};
export default Choices;
