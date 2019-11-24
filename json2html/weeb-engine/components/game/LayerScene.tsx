/** @jsx jsx */
import { css, jsx, keyframes, SerializedStyles } from '@emotion/core'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import { FunctionComponent } from 'react'
import { TransitionStatus } from 'react-transition-group/Transition'

import { Displayable } from '../../medias/Media'
import AnimateWithDep from '../AnimateWithDep'

const durationMs: number = 1000

interface Props {
    media: O.Option<Displayable>
    animate?: boolean
}

const LayerScene: FunctionComponent<Props> = ({ media, animate = true }) => {
    const key: string = pipe(
        media,
        O.map(_ => _.name),
        O.getOrElse(() => '')
    )

    return (
        <AnimateWithDep key={key} durationMs={durationMs} animate={animate}>
            {status =>
                pipe(
                    media,
                    O.map(_ =>
                        _.reactNode({
                            css: [styles.base, stylesFromStatus(status)]
                        })
                    ),
                    O.toNullable
                )
            }
        </AnimateWithDep>
    )
}
export default LayerScene

const stylesFromStatus = (
    status: TransitionStatus
): SerializedStyles | undefined => {
    if (status === 'entering') return styles.entering
    if (status === 'entered') return styles.entered
    return undefined
}

const styles = {
    base: css({
        top: '0',
        left: '0',
        position: 'absolute',
        height: '100%',
        width: '100%',
        objectFit: 'contain',
        opacity: 0
    }),

    entering: css({
        animation: `${keyframes({
            from: { opacity: 0 },
            to: { opacity: 1 }
        })} ${durationMs}ms forwards`
    }),

    entered: css({
        opacity: 1
    })
}
