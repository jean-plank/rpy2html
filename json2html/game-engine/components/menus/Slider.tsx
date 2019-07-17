/** @jsx jsx */
import { css, CSSObject, jsx, SerializedStyles } from '@emotion/core'
import { FunctionComponent } from 'react'

import { style } from '../../context'
import { mediaQuery } from '../../utils/styles'

interface Props {
    title: string
    defaultValue: number
    setValue: (value: number) => void
    styles?: {
        container?: SerializedStyles;
        title?: SerializedStyles;
    }
}

const Slider: FunctionComponent<Props> = ({
    title,
    defaultValue,
    setValue,
    styles: overrideStyles = {}
}) => {
    return (
        <div css={overrideStyles.container}>
            <div css={overrideStyles.title}>{title}</div>
            <input
                type='range'
                min={0}
                max={1}
                step={0.1}
                defaultValue={defaultValue.toString()}
                onChange={onChange}
                css={styles.input}
            />
        </div>
    )

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = Number(e.target.value)
        if (!isNaN(value)) setValue(value)
    }
}
export default Slider

const both: CSSObject = {
    height: '100%'
}

const thumb: CSSObject = {
    ...both,
    width: '0.6em',
    backgroundColor: style.accent_color,
    borderRadius: 0,
    border: 'none'
}

const track: CSSObject = {
    ...both,
    width: '100%',
    backgroundColor: style.muted_color,
    padding: 'none'
}

const styles = {
    container: css({
        fontSize: `${style.guibtn_fsize_h}vh`,
        [mediaQuery(style)]: {
            fontSize: `${style.guibtn_fsize_v}vw`
        }
    }),

    input: css({
        '-webkit-appearance': 'none',
        margin: '0.2em 0 0',
        height: '1em',
        width: '100%',
        cursor: 'pointer',
        fontSize: 'inherit',
        ':focus': {
            outline: 'none'
        },
        '::-webkit-slider-thumb': {
            ...thumb,
            '-webkit-appearance': 'none',
            marginTop: 0
        },
        '::-moz-range-thumb': thumb,
        '::-webkit-slider-runnable-track': track,
        '::-moz-range-track': track
    })
}
