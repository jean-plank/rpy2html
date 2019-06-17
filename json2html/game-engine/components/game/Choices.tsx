import { Option } from 'fp-ts/lib/Option';
import * as React from 'react';
import { FunctionComponent } from 'react';

import * as styles from './__style/Choices.css';

interface Props {
    choices: Choice[];
}

interface Choice {
    text: string;
    onClick: Option<(e: React.MouseEvent) => void>;
}

const Choices: FunctionComponent<Props> = props => {
    const choices = props.choices.map((choice, i) => (
        <button
            key={i}
            className={styles.choice}
            onClick={choice.onClick.toUndefined()}
        >
            {choice.text}
        </button>
    ));
    return <div className={styles.choices}>{choices}</div>;
};
export default Choices;
