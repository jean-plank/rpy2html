/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { FunctionComponent } from 'react'

import { style } from '../../context'
import MenuButton, { BtnProps } from './MenuButton'

const Radio: FunctionComponent<BtnProps> = ({
    onClick,
    selected = false,
    disabled,
    children
}) => (
    <div css={styles.container}>
        <div css={styles.rect} className={selected ? 'selected' : undefined} />
        <MenuButton
            {...{ onClick, disabled, selected }}
            styles={styles.menuBtn}
        >
            {children}
        </MenuButton>
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

    menuBtn: css({
        flexShrink: 0
    })
}
