import { Option } from 'fp-ts/lib/Option';
import * as React from 'react';
import { CSSProperties, FunctionComponent } from 'react';

import * as styles from './__style/History.css';

import Char from '../../../models/Char';

interface Props {
    char: Option<Char>;
    text: string;
}

const HistoryLine: FunctionComponent<Props> = ({ char, text }) => {
    const charStyle = char
        .chain<CSSProperties>(_ => _.color.map(_ => ({ color: _ })))
        .getOrElse({});
    const charName = char.map(_ => _.name).getOrElse('');
    return (
        <div className={styles.historyLine}>
            <div className={styles.who} style={charStyle}>
                {charName}
            </div>
            <div className={styles.what}>{text}</div>
        </div>
    );
};
export default HistoryLine;
