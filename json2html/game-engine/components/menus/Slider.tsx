/** @jsx jsx */
import { css, jsx, SerializedStyles } from '@emotion/core'
import { fromNullable } from 'fp-ts/lib/Option'
import { FunctionComponent } from 'react'

interface Props {
    title: string
    defaultValue: number
    setValue: (value: number) => void
    styles?: {
        title?: SerializedStyles;
    }
}

const Slider: FunctionComponent<Props> = ({
    title,
    defaultValue,
    setValue,
    styles
}) => {
    return (
        <div>
            <div
                css={fromNullable(styles)
                    .map(_ => _.title)
                    .toNullable()}
            >
                {title}
            </div>
            <input
                type='range'
                min={0}
                max={1}
                step={0.1}
                defaultValue={defaultValue.toString()}
                onChange={onChange}
                css={inputStyles}
            />
        </div>
    )

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = Number(e.target.value)
        if (!isNaN(value)) setValue(value)
    }
}
export default Slider

const inputStyles = css({
    cursor: 'pointer'
})
