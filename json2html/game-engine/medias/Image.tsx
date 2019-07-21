/** @jsx jsx */
import { InterpolationWithTheme, jsx } from '@emotion/core'
import { RefObject } from 'react'

import Media from './Media'

interface Args {
    ref?: RefObject<HTMLImageElement>
    key?: string | number
    css?: InterpolationWithTheme<any>
}

export default class Image extends Media {
    constructor(public name: string, file: string) {
        super(file)
    }

    elt = ({ ref, key, css }: Args = {}): JSX.Element => (
        <img ref={ref} key={key} css={css} src={this.file} />
    )

    load = () => (document.createElement('img').src = this.file)
}
