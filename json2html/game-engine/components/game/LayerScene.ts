import { css, keyframes } from '@emotion/core'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import { createRef, FunctionComponent } from 'react'

import useAnimation from '../../hooks/useAnimation'
import Image from '../../medias/Image'

const durationMs: number = 1000

interface Props {
    image: O.Option<Image>
    animated?: boolean
}

const LayerScene: FunctionComponent<Props> = ({ image, animated = true }) => {
    const ref = createRef<HTMLImageElement>()
    useAnimation(
        ref,
        pipe(
            image,
            O.map(_ => _.name),
            O.getOrElse(() => '')
        ),
        styles.animated,
        durationMs,
        animated
    )

    return pipe(
        image,
        O.map(_ => _.elt({ ref, css: styles.base })),
        O.toNullable
    )
}

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
        animation: `${fadeIn()} ${durationMs / 1000}s forwards`
    })
}

function fadeIn() {
    return keyframes({
        from: { opacity: 0 },
        to: { opacity: 1 }
    })
}
