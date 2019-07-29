/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import { CSSProperties, FunctionComponent } from 'react'

import Char from '../../../Char'

interface Props {
    char: O.Option<Char>
    text: string
}

const HistoryLine: FunctionComponent<Props> = ({ char, text }) => {
    const charStyle: CSSProperties | undefined = pipe(
        char,
        O.chain(_ =>
            pipe(
                _.color,
                O.map(_ => ({ color: _ }))
            )
        ),
        O.toUndefined
    )
    const charName = pipe(
        char,
        O.map(_ => _.name),
        O.toNullable
    )

    return (
        <div css={styles.historyLine}>
            <div css={styles.who} style={charStyle}>
                {charName}
            </div>
            <div css={styles.what}>{text}</div>
        </div>
    )
}
export default HistoryLine

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
}
