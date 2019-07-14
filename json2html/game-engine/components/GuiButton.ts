import styled from '@emotion/styled'
import { TextAlignProperty } from 'csstype'

import { style } from '../context'
import { mediaQuery } from '../utils/styles'

const GuiButton = styled.button({
    whiteSpace: 'normal',
    color: style.guibtn_color,
    width: style.guibtn_width,
    textAlign: style.guibtn_txtalign as TextAlignProperty,
    fontFamily: style.guibtn_ffamily,
    fontSize: `${style.guibtn_fsize_h}vh`,
    [mediaQuery(style)]: {
        fontSize: `${style.guibtn_fsize_v}vw`
    },
    ':hover': {
        color: style.guibtn_color_hover
    },
    ':disabled': {
        color: style.disabledbtn_color
    }
})
export default GuiButton
