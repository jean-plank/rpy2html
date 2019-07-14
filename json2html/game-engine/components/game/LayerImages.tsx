/** @jsx jsx */
import { css, CSSObject, jsx } from '@emotion/core'
import { FunctionComponent } from 'react'

import Image from '../../models/medias/Image'

interface Props {
    images: Image[]
}

const LayerImages: FunctionComponent<Props> = ({ images }) => (
    <div css={styles.container}>
        {images.map(img => img.elt({ key: img.name, css: styles.img }))}
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
