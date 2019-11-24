import { css, SerializedStyles } from '@emotion/core'

import Font from '../../renpy-json-loader/Font'

export default (name: string, { src, bold }: Font): SerializedStyles =>
    css({
        '@font-face': {
            fontFamily: name,
            src: `url('${src}')`,
            ...(bold ? { fontWeight: 'bold' } : undefined)
        }
    })
