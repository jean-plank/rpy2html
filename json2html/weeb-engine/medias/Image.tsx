/** @jsx jsx */
import { InterpolationWithTheme, jsx } from '@emotion/core'

import Media, { Displayable } from './Media'

interface Args {
    key?: string | number
    css?: InterpolationWithTheme<any>
}

export default class Image extends Media implements Displayable {
    _tag: 'Displayable' = 'Displayable'

    reactNode = ({ key, css }: Args = {}): JSX.Element => (
        <img key={key} css={css} src={this.file} />
    )

    load = () => {
        document.createElement('img').src = this.file
    }
}
