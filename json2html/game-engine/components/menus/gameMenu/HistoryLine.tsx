/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Option } from 'fp-ts/lib/Option';
import { CSSProperties, FunctionComponent } from 'react';

import Char from '../../../models/Char';

interface Props {
    char: Option<Char>;
    text: string;
}

const HistoryLine: FunctionComponent<Props> = ({ char, text }) => {
    const charStyle = char
        .chain<CSSProperties>(_ => _.color.map(_ => ({ color: _ })))
        .toUndefined();
    const charName = char.map(_ => _.name).toNullable();

    return (
        <div css={styles.historyLine}>
            <div css={styles.who} style={charStyle}>
                {charName}
            </div>
            <div css={styles.what}>{text}</div>
        </div>
    );
};
export default HistoryLine;

const styles = {
    historyLine: css({
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        paddingTop: '1em',

        ':last-of-type': {
            paddingBottom: '1em'
        },

        '& > div': {
            padding: '0 0.5em'
        }
    }),

    who: css({
        width: '20%',
        color: '#0099cc',
        textAlign: 'right'
    }),

    what: css({
        width: '80%'
    })
};
