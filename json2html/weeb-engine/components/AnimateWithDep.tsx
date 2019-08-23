/** @jsx jsx */
import { InterpolationWithTheme, jsx } from '@emotion/core'
import { FunctionComponent } from 'react'
import { Transition, TransitionGroup } from 'react-transition-group'
import { TransitionChildren } from 'react-transition-group/Transition'

interface Props {
    dep?: string | number
    durationMs: number
    animate?: boolean
    styles?: InterpolationWithTheme<any>
    children: TransitionChildren
}

const AnimateWithDep: FunctionComponent<Props> = ({
    dep,
    durationMs,
    animate = true,
    styles,
    children
}) => (
    <TransitionGroup css={styles}>
        <Transition
            key={dep}
            timeout={durationMs}
            in={true}
            appear={animate}
            enter={animate}
            exit={false}
        >
            {children}
        </Transition>
    </TransitionGroup>
)
export default AnimateWithDep
