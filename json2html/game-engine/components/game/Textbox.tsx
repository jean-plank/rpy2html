import { Option } from 'fp-ts/lib/Option';
import { escape as lodashEscape } from 'lodash';
import * as React from 'react';
import { FunctionComponent } from 'react';

import * as styles from './__style/Textbox.css';

import Char from '../../models/Char';

interface Props {
    hide: boolean;
    char: Option<Char>;
    text: string;
}

const Textbox: FunctionComponent<Props> = ({ hide, char, text }) => {
    const textboxStyle = hide ? { display: 'none' } : {};

    const charStyle = char
        .chain<React.CSSProperties>(_ => _.color.map(_ => ({ color: _ })))
        .getOrElse({});

    const charName = char.map(_ => _.name).getOrElse('');

    return (
        <div className={styles.textbox} style={textboxStyle}>
            <div className={styles.namebox} style={charStyle}>
                {charName}
            </div>
            <div
                className={styles.dialog}
                dangerouslySetInnerHTML={{
                    __html: lodashEscape(text).replace('\n', '<br>')
                }}
            />
        </div>
    );
};
export default Textbox;
