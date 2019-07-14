import { css, keyframes } from '@emotion/core'
import { Option } from 'fp-ts/lib/Option'
import { FunctionComponent } from 'react'

import Image from '../../models/medias/Image'

interface Props {
    image: Option<Image>
    animated?: boolean
}

const LayerScene: FunctionComponent<Props> = ({ image, animated = true }) =>
    image
        .map(_ =>
            _.elt({
                css: [styles.base, animated ? styles.animated : null]
            })
        )
        .toNullable()
export default LayerScene

const styles = {
    base: css({
        top: '0',
        left: '0',
        position: 'absolute',
        height: '100%',
        width: '100%',
        objectFit: 'contain'
    }),

    animated: css({
        animation: `${fadeIn()} 1s forwards`
    })
}

function fadeIn() {
    return keyframes({
        from: { opacity: 0 },
        to: { opacity: 1 }
    })
}
