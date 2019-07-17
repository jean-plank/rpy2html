/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { FunctionComponent } from 'react'

import { style } from '../../context'
import SelectableButton, { BtnProps } from '../SelectableButton'

const Radio: FunctionComponent<BtnProps> = ({
    onClick,
    selected = false,
    disabled,
    children
}) => (
    <div css={styles.container}>
        <div css={styles.rect} className={selected ? 'selected' : undefined} />
        <SelectableButton
            {...{ onClick, disabled, selected }}
            styles={styles.btn}
        >
            {children}
        </SelectableButton>
    </div>
)
export default Radio

const styles = {
    container: css({
        display: 'flex',
        alignItems: 'center'
    }),

    rect: css({
        flexShrink: 0,
        width: '0.3em',
        height: '1em',

        '&.selected': {
            backgroundColor: style.accent_color
        }
    }),

    btn: css({
        flexShrink: 0,
        padding: '0.1em 0.5em'
    })
}
