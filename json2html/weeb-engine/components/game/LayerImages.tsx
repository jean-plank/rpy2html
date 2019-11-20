/** @jsx jsx */
import { css, CSSObject, jsx } from '@emotion/core'
import { FunctionComponent } from 'react'

import Image from '../../medias/Image'
import Video from '../../medias/Video'

interface Props {
    medias: (Video | Image)[]
}

const LayerImages: FunctionComponent<Props> = ({ medias }) => (
    <div css={styles.container}>
        {medias.map(med => med.elt({ key: med.name, css: styles.img }))}
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
