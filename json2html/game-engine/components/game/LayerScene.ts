import { css, keyframes } from '@emotion/core'
import { Option } from 'fp-ts/lib/Option'
import { FunctionComponent } from 'react'

import Image from '../../models/medias/Image'

interface Props {
    image: Option<Image>
}

const LayerScene: FunctionComponent<Props> = ({ image }) =>
    image.map(_ => _.elt({ css: imageStyles })).toNullable()
export default LayerScene

const imageStyles = css({
    top: '0',
    left: '0',
    position: 'absolute',
    height: '100%',
    width: '100%',
    objectFit: 'contain',
    animation: `${fadeIn()} 1s forwards`
})

function fadeIn() {
    return keyframes({
        from: { opacity: 0 },
        to: { opacity: 1 }
    })
}
