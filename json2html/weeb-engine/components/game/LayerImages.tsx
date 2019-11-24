/** @jsx jsx */
import { css, CSSObject, jsx } from '@emotion/core'
import { FunctionComponent } from 'react'

import { Displayable } from '../../medias/Media'

interface Props {
    medias: Displayable[]
}

const LayerImages: FunctionComponent<Props> = ({ medias }) => (
    <div css={styles.container}>
        {medias.map(med => med.reactNode({ key: med.name, css: styles.img }))}
    </div>
)
export default LayerImages

const styles = {
    container: css({
        ...common()
    }),

    img: css({
        ...common(),
        top: '0',
        left: '0',
        objectFit: 'contain'
    })
}

function common(): CSSObject {
    return {
        position: 'absolute',
        height: '100%',
        width: '100%'
    }
}
