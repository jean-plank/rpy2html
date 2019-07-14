/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { FunctionComponent } from 'react'

import { help, style } from '../../context'

const Help: FunctionComponent = (): JSX.Element => {
    return <div css={helpStyles} dangerouslySetInnerHTML={{ __html: help }} />
}
export default Help

const helpStyles = css({
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflowY: 'auto',
    flexWrap: 'wrap',

    '& table': {
        fontSize: 'inherit'
    },

    '& thead': {
        display: 'none'
    },

    '& td': {
        padding: '0.5em 0'
    },

    '& td:first-of-type': {
        textAlign: 'right',
        paddingRight: '1em',
        color: style.accent_color
    }
})
